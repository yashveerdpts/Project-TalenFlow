import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useJobsState, useJobsDispatch, updateJobStatus, fetchJobs, reorderJobs } from "../context/JobsContext";
import JobFormModal from "../components/JobFormModal";
import "./JobsPage.css";

// REMOVED: The ThemeIcon component is no longer needed.

function JobsPage() {
  const navigate = useNavigate();
  const state = useJobsState();
  const dispatch = useJobsDispatch();
  const { list, filters, meta, loading } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  // REMOVED: All theme state and functions are gone.

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchJobs(dispatch, { filters, page: meta.page });
    }, 300);
    return () => clearTimeout(handler);
  }, [dispatch, filters, meta.page]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    reorderJobs(dispatch, list, result.source.index, result.destination.index);
  };

  return (
    // The theme class has been removed from this div
    <div className="jobs-page-container">
      <div className="jobs-content">
        <header className="jobs-header">
          <h1>Jobs</h1>
          {/* REMOVED: The theme toggle button is gone. */}
        </header>

        <div className="jobs-filters">
          <input
            className="filter-input"
            placeholder="Search title..."
            value={filters.search}
            onChange={(e) =>
              dispatch({
                type: "SET_FILTERS",
                payload: { ...filters, search: e.target.value },
              })
            }
          />
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) =>
              dispatch({
                type: "SET_FILTERS",
                payload: { ...filters, status: e.target.value },
              })
            }
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + Create Job
          </button>
        </div>

        {loading && <p>Loading jobs...</p>}
        {!loading && list.length === 0 && <p>No jobs found.</p>}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="jobs">
            {(provided) => (
              <ul className="jobs-list" {...provided.droppableProps} ref={provided.innerRef}>
                {list.map((job, index) => (
                  <Draggable key={job.id} draggableId={String(job.id)} index={index}>
                    {(provided, snapshot) => (
                      <li
                        className={`job-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="job-card-main" onClick={() => navigate(`/jobs/${job.id}`)}>
                          <strong>{job.title}</strong>
                          <small>{job.slug}</small>
                        </div>
                        <div className="job-card-actions">
                          <span className={`status-badge status-${job.status}`}>{job.status}</span>
                          <button
                            className="btn btn-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newStatus = job.status === "active" ? "archived" : "active";
                              updateJobStatus(dispatch, job, newStatus);
                            }}
                          >
                            {job.status === "active" ? "Archive" : "Unarchive"}
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        <div className="jobs-pagination">
          <button
            className="btn"
            onClick={() => dispatch({ type: "SET_PAGE", payload: meta.page - 1 })}
            disabled={meta.page <= 1}
          >
            Prev
          </button>
          <span>Page {meta.page} of {Math.ceil(meta.total / meta.pageSize) || 1}</span>
          <button
            className="btn"
            onClick={() => dispatch({ type: "SET_PAGE", payload: meta.page + 1 })}
            disabled={meta.page * meta.pageSize >= meta.total}
          >
            Next
          </button>
        </div>
      </div>
      <JobFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default JobsPage;