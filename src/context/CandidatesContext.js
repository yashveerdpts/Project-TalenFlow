import React, { createContext, useReducer, useEffect, useCallback } from "react";
import { db } from "../dexieDB";
import AddNoteModal from '../components/AddNoteModal'; 

export const CandidatesContext = createContext();

// Reducer to manage all candidate-related state changes
const candidatesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CANDIDATES':
      return { ...state, candidates: action.payload, loading: false };
    case 'UPDATE_SINGLE_CANDIDATE':
      return {
        ...state,
        candidates: state.candidates.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'ADD_NOTE_SUCCESS':
        return {
          ...state,
          candidates: state.candidates.map(c => 
            c.id === action.payload.candidateId 
              ? { ...c, notes: [...(c.notes || []), action.payload.note] } 
              : c
          ),
        };
    default:
      return state;
  }
};

export const CandidatesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(candidatesReducer, {
    candidates: [],
    loading: true,
    error: null,
  });

  const fetchCandidates = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const candidatesFromDB = await db.candidates.toArray();
      dispatch({ type: 'SET_CANDIDATES', payload: candidatesFromDB });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: "Failed to fetch candidates" });
      console.error(e);
    }
  }, []);

  const updateCandidateStage = async (candidateId, newStage, noteText = '') => {
  try {
    const id = Number(candidateId);

    const timelineEntry = {
      stage: newStage,
      date: new Date().toISOString(),
      ...(noteText.trim() && { note: noteText.trim() })
    };

    // Use modify instead of db.core.util.modify
    await db.candidates.where({ id }).modify(candidate => {
      candidate.stage = newStage;
      if (!candidate.timeline) candidate.timeline = [];
      candidate.timeline.push(timelineEntry);
    });

    const updatedCandidate = await db.candidates.get(id);
    dispatch({ type: 'UPDATE_SINGLE_CANDIDATE', payload: updatedCandidate });
  } catch (e) {
    dispatch({ type: 'SET_ERROR', payload: 'Failed to update candidate stage.' });
    console.error(e);
  }
};
  const addNoteToCandidate = async (candidateId, noteText) => {
    if (!noteText.trim()) return;

    const newNote = {
      id: Date.now(),
      text: noteText,
      date: new Date().toISOString(),
    };

    try {
      // Update the note in Dexie DB
      await db.candidates.where({ id: candidateId }).modify(candidate => {
        if (!candidate.notes) candidate.notes = [];
        candidate.notes.push(newNote);
      });
      
      // Optimistically update the UI
      dispatch({ type: 'ADD_NOTE_SUCCESS', payload: { candidateId, note: newNote } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add note.' });
      console.error('Failed to add note:', error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return (
    <CandidatesContext.Provider value={{ ...state, updateCandidateStage, addNoteToCandidate }}>
      {children}
    </CandidatesContext.Provider>
  );
};