import React, { createContext, useReducer, useContext, useEffect } from "react";
import { db } from "../dexieDB";

const JobsStateContext = createContext();
const JobsDispatchContext = createContext();

const PAGE_SIZE = 10;

const initialState = {
  list: [],
  meta: { total: 0, page: 1, pageSize: PAGE_SIZE },
  loading: false,
  filters: { search: "", status: "" ,tags: "" },
};

function jobsReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    
    case "SET_JOBS_AND_META":
      return { 
        ...state, 
        list: action.payload.jobs,
        meta: action.payload.meta 
      };

    case "ADD_JOB":
      return {
        ...state,
        list: [action.payload, ...state.list],
        meta: { ...state.meta, total: state.meta.total + 1 }
      };

    case "UPDATE_JOB":
      return {
        ...state,
        list: state.list.map((job) =>
          job.id === action.payload.id ? { ...job, ...action.payload } : job
        ),
      };

    case "REORDER_JOBS":
      return { ...state, list: action.payload };

    case "SET_FILTERS":
      return { 
        ...state, 
        filters: action.payload,
        meta: { ...state.meta, page: 1 }
      };

    case "SET_PAGE":
      return {
        ...state,
        meta: { ...state.meta, page: action.payload }
      };

    default:
      return state;
  }
}

export function JobsProvider({ children }) {
  const [state, dispatch] = useReducer(jobsReducer, initialState);
  return (
    <JobsStateContext.Provider value={state}>
      <JobsDispatchContext.Provider value={dispatch}>
        {children}
      </JobsDispatchContext.Provider>
    </JobsStateContext.Provider>
  );
}

export const useJobsState = () => useContext(JobsStateContext);
export const useJobsDispatch = () => useContext(JobsDispatchContext);

export async function fetchJobs(dispatch, { filters, page }) {
  dispatch({ type: "SET_LOADING", payload: true });
  let collection = db.jobs.orderBy("order").reverse();

  if (filters.status) {
    collection = collection.filter(job => job.status === filters.status);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    collection = collection.filter(job => 
      job.title.toLowerCase().includes(searchLower)
    );
  }
   if (filters.tags) {
    const tagLower = filters.tags.toLowerCase();
    collection = collection.filter(job => 
      Array.isArray(job.tags) && job.tags.some(tag => tag.toLowerCase().includes(tagLower))
    );
  }


  try {
    const total = await collection.count();
    const jobsOnPage = await collection
      .offset((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray();

    dispatch({
      type: "SET_JOBS_AND_META",
      payload: { jobs: jobsOnPage, meta: { total, page, pageSize: PAGE_SIZE } },
    });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
}

export async function createJob(dispatch, jobData) {
  try {
    const newJob = {
      ...jobData,
      status: 'active',
      order: Date.now(),
      createdAt: new Date()
    };
    const id = await db.jobs.add(newJob);
    dispatch({ type: "ADD_JOB", payload: { ...newJob, id } });
    return { success: true, id };
  } catch (error) {
    console.error("Failed to create job:", error);
    if (error.name === 'ConstraintError') {
      return { success: false, errors: { general: "A job with this title already exists." } };
    }
    return { success: false, errors: { general: "Failed to save job." } };
  }
}

export async function updateJob(dispatch, id, updates) {
  try {
    await db.jobs.update(id, updates);
    dispatch({ type: "UPDATE_JOB", payload: { id, ...updates } });
    return { success: true };
  } catch (error) {
    console.error("Failed to update job:", error);
    if (error.name === 'ConstraintError') {
      return { success: false, errors: { general: "Another job with this title already exists." } };
    }
    return { success: false, errors: { general: "Failed to save the job." } };
  }
}

export async function updateJobStatus(dispatch, job, newStatus) {
  return updateJob(dispatch, job.id, { status: newStatus });
}

export async function reorderJobs(dispatch, jobs, sourceIndex, destinationIndex) {
  const originalJobs = Array.from(jobs);
  const reordered = Array.from(originalJobs);
  const [moved] = reordered.splice(sourceIndex, 1);
  reordered.splice(destinationIndex, 0, moved);

  dispatch({ type: "REORDER_JOBS", payload: reordered });

  try {
    await db.transaction("rw", db.jobs, async () => {
      const updates = reordered.map((job, index) => 
        db.jobs.update(job.id, { order: Date.now() - index })
      );
      await Promise.all(updates);
    });
    return { success: true };
  } catch (error) {
    console.error("Reorder failed, rolling back UI:", error);
    dispatch({ type: "REORDER_JOBS", payload: originalJobs });
    return { success: false };
  }
}