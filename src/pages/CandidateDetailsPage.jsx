// src/pages/CandidateDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CandidateDetailsPage.css';

const MOCK_USERS = ["alice", "bob", "charlie"]; // For @mentions

const CandidateDetailsPage = () => {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState('');

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const res = await fetch(`/api/candidates/${id}`);
                const data = await res.json();
                setCandidate(data.candidate);
            } catch (e) {
                console.error("Failed to fetch candidate", e);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidate();
    }, [id]);

    const renderNote = (text) => {
        const parts = text.split(/(@\w+)/g);
        return parts.map((part, i) => 
            part.startsWith('@') && MOCK_USERS.includes(part.substring(1)) ? 
            <strong key={i} className="mention">{part}</strong> : 
            part
        );
    };

    if (loading) return <div>Loading...</div>;
    if (!candidate) return <div>Candidate not found.</div>;

    return (
        <div className="details-page">
            <div className="profile-header">
                <h2>{candidate.name}</h2>
                <p>{candidate.email}</p>
                <span className="stage-badge">{candidate.stage}</span>
            </div>

            <div className="details-body">
                <div className="timeline-section">
                    <h3>Hiring Timeline</h3>
                    <ul>
                        {candidate.timeline.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, index) => (
                            <li key={index}>
                                Moved to <strong>{item.stage}</strong>
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="notes-section">
                    <h3>Notes</h3>
                    <textarea 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note... @mention someone"
                    ></textarea>
                     <div className="rendered-note">
                        {renderNote(note)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetailsPage;