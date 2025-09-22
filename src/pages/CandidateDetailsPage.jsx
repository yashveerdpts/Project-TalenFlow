import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CandidatesContext } from '../context/CandidatesContext';
import { db } from '../dexieDB';
import ProfileAvatar from '../components/ProfileAvatar';
import './CandidateDetailsPage.css';

const MOCK_USERS = ["alice", "bob", "charlie"];

const CandidateDetailsPage = () => {
  const { id } = useParams();
  const { candidates, loading, addNoteToCandidate } = useContext(CandidatesContext);
  const [note, setNote] = useState('');
  const [job, setJob] = useState(null);

  const candidate = useMemo(() => {
    return candidates.find(c => c.id === Number(id));
  }, [id, candidates]);

  useEffect(() => {
    const fetchJobForCandidate = async () => {
      if (candidate && candidate.jobId) {
        const linkedJob = await db.jobs.get(candidate.jobId);
        setJob(linkedJob);
      }
    };
    fetchJobForCandidate();
  }, [candidate]);
  
  const handleSaveNote = () => {
    if (candidate) {
      addNoteToCandidate(candidate.id, note);
      setNote('');
    }
  };

  const renderNoteText = (text) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) =>
      part.startsWith('@') && MOCK_USERS.includes(part.substring(1))
        ? <strong key={i} className="mention">{part}</strong>
        : part
    );
  };

  if (loading && !candidate) return <div className="message-container">Loading...</div>;
  if (!candidate) return <div className="message-container">Candidate not found.</div>;

  return (
    <div className="details-page">
      <div className="profile-header">
        <ProfileAvatar name={candidate.name} />
        <div className="profile-header-info">
            <h2>{candidate.name}</h2>
            <p>{candidate.email}</p>
            {job && (
              <p className="job-link-container">
                Applying for: <Link to={`/jobs/${job.id}`} className="job-link">{job.title}</Link>
              </p>
            )}
        </div>
        <span className={`status-badge status-${candidate.stage.toLowerCase()}`}>{candidate.stage}</span>
      </div>

      <div className="details-body">
        <div className="timeline-section">
          <h3>Hiring Timeline</h3>
          <ul>
            {(candidate.timeline || []).sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, index) => (
              <li key={index}>
                <div className="timeline-item-header">
                  <span>Moved to <strong>{item.stage}</strong></span>
                  <small>{new Date(item.date).toLocaleString()}</small>
                </div>
                {item.note && (<p className="timeline-note">{item.note}</p>)}
              </li>
            ))}
          </ul>
        </div>

        <div className="notes-section">
          <h3>General Notes</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a general note..."
          ></textarea>
          <button onClick={handleSaveNote} className="btn btn-primary">Save Note</button>
          
          <div className="notes-list">
            {(candidate.notes || []).sort((a, b) => new Date(b.date) - new Date(a.date)).map((n, index) => (
              <div key={index} className="note-item">
                <p>{renderNoteText(n.text)}</p>
                <small>{new Date(n.date).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsPage;