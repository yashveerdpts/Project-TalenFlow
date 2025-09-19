import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { db } from "../dexieDB";

export default function JobDetails() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getJobDetails() {
      try {
        const jobFromDb = await db.jobs.get(parseInt(jobId, 10));
        setJob(jobFromDb);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setLoading(false);
      }
    }
    getJobDetails();
  }, [jobId]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!job) return <div style={{ padding: 20 }}>Job not found.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{job.title}</h1>
      <p><strong>Slug:</strong> {job.slug}</p>
      <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{job.status}</span></p>
      <p><strong>Internal Order ID:</strong> {job.order}</p>

      <hr style={{ margin: '2rem 0' }} />
      <div>
        <h2>Hiring Tools</h2>
        <Link
          to={`/jobs/${jobId}/assessment`}
          style={{
            display: 'inline-block',
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Go to Assessment Builder
        </Link>
      </div>
    </div>
  );
}