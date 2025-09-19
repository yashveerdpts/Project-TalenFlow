// src/context/CandidatesContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";

export const CandidatesContext = createContext();

export const CandidatesProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/candidates");
      const data = await response.json();
      setCandidates(data.candidates);
    } catch (e) {
      setError("Failed to fetch candidates");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCandidateStage = async (candidateId, newStage) => {
    const originalCandidates = [...candidates];
    
    // Optimistic UI update
    const updatedCandidates = candidates.map(c => 
        c.id === candidateId ? { ...c, stage: newStage } : c
    );
    setCandidates(updatedCandidates);

    try {
        const response = await fetch(`/api/candidates/${candidateId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stage: newStage })
        });

        if (!response.ok) {
            throw new Error('Failed to update stage');
        }
        
        const data = await response.json();
        
        // Final update with server response (includes timeline)
        setCandidates(prev => prev.map(c => c.id === data.candidate.id ? data.candidate : c));

    } catch (e) {
        setError('Failed to update candidate stage. Reverting.');
        setCandidates(originalCandidates); // Revert on error
        console.error(e);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return (
    <CandidatesContext.Provider value={{ candidates, loading, error, updateCandidateStage }}>
      {children}
    </CandidatesContext.Provider>
  );
};