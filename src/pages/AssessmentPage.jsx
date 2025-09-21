import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../dexieDB';
import CreateAssessmentModal from '../components/CreateAssessmentModal'; // Import the new modal
import './AssessmentsListPage.css';

const AssessmentsListPage = () => {
  const navigate = useNavigate();
  const [assessmentsWithJobs, setAssessmentsWithJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  const assessments = useLiveQuery(() => db.assessments.toArray(), []);

  useEffect(() => {
    const fetchJobsForAssessments = async () => {
      if (assessments) {
        const enrichedAssessments = await Promise.all(
          assessments.map(async (assessment) => {
            const job = assessment.jobId ? await db.jobs.get(assessment.jobId) : null;
            return {
              ...assessment,
              jobTitle: job ? job.title : 'Unassigned',
            };
          })
        );
        setAssessmentsWithJobs(enrichedAssessments);
      }
    };
    fetchJobsForAssessments();
  }, [assessments]);

  const handleCreate = (selectedJobId) => {
    if (selectedJobId) {
      // If a job was selected, go to the builder for that job
      navigate(`/jobs/${selectedJobId}/assessment`);
    } else {
      // If no job was selected, create a temporary ID for an unassigned assessment
      const tempId = `unassigned-${Date.now()}`;
      navigate(`/jobs/${tempId}/assessment`);
    }
  };

  const handleEdit = (jobId) => {
    if (jobId) {
      navigate(`/jobs/${jobId}/assessment`);
    } else {
      // Handle editing unassigned assessments if needed
      alert("This assessment is not linked to a job.");
    }
  };

  return (
    <>
      <CreateAssessmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectJob={handleCreate}
      />

      <div className="assessments-page-container">
        <div className="assessments-content">
          <header className="assessments-header">
            <h1>All Assessments</h1>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              + Create Assessment
            </button>
          </header>

          {assessmentsWithJobs.length > 0 ? (
            <div className="assessments-list">
              {assessmentsWithJobs.map((assessment) => (
                <div key={assessment.id} className="assessment-card">
                  <div className="assessment-card-main">
                    <strong>{assessment.title}</strong>
                    <small>Linked to Job: {assessment.jobTitle}</small>
                  </div>
                  <div className="assessment-card-actions">
                    <button onClick={() => handleEdit(assessment.jobId)} className="btn btn-secondary">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-assessments-message">
              <p>No assessments have been created yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AssessmentsListPage;