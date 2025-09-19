import React, { createContext, useReducer, useContext } from "react";
import { db } from "../dexieDB";

const JobsStateContext = createContext();
const JobsDispatchContext = createContext();

const PAGE_SIZE = 10;

const initialState = {
  list: [],
  meta: { total: 0, page: 1, pageSize: PAGE_SIZE },
  loading: false,
  filters: { search: "", status: "" },
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
    case "UPDATE_JOB":
      return {
        ...state,
        list: state.list.map((job) =>
          job.id === action.payload.id ? action.payload : job
        ),
      };
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

// JOB ACTIONS
export async function fetchJobs(dispatch, { filters, page }) {
  dispatch({ type: "SET_LOADING", payload: true });

  let collection = db.jobs.orderBy("order");

  if (filters.status) {
    collection = collection.filter(job => job.status === filters.status);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    collection = collection.filter(job => 
      job.title.toLowerCase().includes(searchLower)
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
      payload: {
        jobs: jobsOnPage,
        meta: { total, page, pageSize: PAGE_SIZE },
      },
    });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
}

export async function createJob(dispatch, job) {
  try {
    const id = await db.jobs.add({
      ...job,
      order: Date.now(),
    });
    await fetchJobs(dispatch, { filters: { search: "", status: "" }, page: 1 });
    return { success: true, id };
  } catch (error) {
    console.error("Failed to create job:", error);
    return { success: false, error: "Failed to save job." };
  }
}

export async function updateJobStatus(dispatch, job, newStatus) {
  try {
    await db.jobs.update(job.id, { status: newStatus });
    const updatedJob = { ...job, status: newStatus };
    dispatch({ type: "UPDATE_JOB", payload: updatedJob });
    return { success: true };
  } catch (error) {
    console.error("Failed to update job status:", error);
    return { success: false, error: "Failed to update job." };
  }
}

export async function reorderJobs(dispatch, jobs, sourceIndex, destinationIndex) {
  try {
    const reordered = Array.from(jobs);
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(destinationIndex, 0, moved);

    // Optimistic UI update
    dispatch({ type: "SET_JOBS_AND_META", payload: { jobs: reordered, meta: {} } });

    await db.transaction("rw", db.jobs, async () => {
      for (let i = 0; i < reordered.length; i++) {
        await db.jobs.update(reordered[i].id, { order: i });
      }
    });

    return true;
  } catch (error) {
    console.error("Reorder failed, rolling back:", error);
    dispatch({ type: "SET_JOBS_AND_META", payload: { jobs: jobs, meta: {} } });
    return false;
  }
}