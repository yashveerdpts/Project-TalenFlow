import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../dexieDB";
import "./JobDetailsPage.css"; // Import the new CSS file

export default function JobDetails() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getJobDetails() {
      try {
        // Dexie keys are numbers, so we parse the ID from the URL
        const id = parseInt(jobId, 10);
        if (isNaN(id)) {
          setJob(null);
          return;
        }
        const jobFromDb = await db.jobs.get(id);
        setJob(jobFromDb);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setLoading(false);
      }
    }
    getJobDetails();
  }, [jobId]);

  if (loading) {
    return <div className="message-container">Loading job details...</div>;
  }
  
  if (!job) {
    return <div className="message-container">Job not found.</div>;
  }

  return (
    <div className="job-details-page">
      {/* --- Header Card --- */}
      <div className="job-details-card job-header">
        <h1>{job.title}</h1>
        <div className="job-meta-details">
          <p><strong>Slug:</strong> {job.slug}</p>
          <p><strong>Status:</strong> <span className={`status-badge status-${job.status}`}>{job.status}</span></p>
        </div>
      </div>

      {/* --- Hiring Tools Card --- */}
      <div className="job-details-card hiring-tools-card">
        <h2>Hiring Tools</h2>
        <p>Manage assessments and other tools for this role.</p>
        <Link to={`/jobs/${jobId}/assessment`} className="btn btn-primary">
          Go to Assessment Builder
        </Link>
      </div>
    </div>
  );
}