import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../dexieDB';
import './CreateAssessmentModal.css';

const CreateAssessmentModal = ({ isOpen, onClose, onSelectJob }) => {
  const [selectedJobId, setSelectedJobId] = useState('');

  const jobs = useLiveQuery(() => db.jobs.toArray(), []);

  if (!isOpen) {
    return null;
  }

  const handleProceed = () => {
    onSelectJob(selectedJobId || null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Assessment</h2>
        <p>Select a job to link this assessment to, or proceed to create an unassigned assessment.</p>
        
        <div className="form-group">
          <label htmlFor="job-select">Link to Job (Optional)</label>
          <select 
            id="job-select" 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <option value="">-- Select a Job --</option>
            {jobs && jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleProceed}>
            Proceed to Builder
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessmentModal;