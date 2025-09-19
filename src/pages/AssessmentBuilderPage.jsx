// src/pages/AssessmentBuilderPage.jsx
import React, { useEffect, useReducer, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../dexieDB';
import AssessmentForm from '../components/AssessmentForm'; // We will create this
import './AssessmentBuilderPage.css';
import { nanoid } from 'nanoid';

// Reducer for managing complex assessment state
const assessmentReducer = (state, action) => {
  const newState = JSON.parse(JSON.stringify(state)); // Deep copy for immutability
  switch (action.type) {
    case 'LOAD_ASSESSMENT':
      return action.payload;
    case 'UPDATE_TITLE':
      newState.title = action.payload;
      return newState;
    case 'ADD_SECTION':
      newState.sections.push({ id: nanoid(), title: 'New Section', questions: [] });
      return newState;
    case 'UPDATE_SECTION_TITLE':
      newState.sections[action.payload.sectionIndex].title = action.payload.title;
      return newState;
    case 'ADD_QUESTION':
      newState.sections[action.payload.sectionIndex].questions.push({
        id: nanoid(),
        text: 'New Question',
        type: 'short-text',
        options: [],
        validation: { required: false },
      });
      return newState;
    case 'UPDATE_QUESTION':
      const { sectionIndex, questionIndex, field, value } = action.payload;
      newState.sections[sectionIndex].questions[questionIndex][field] = value;
      return newState;
    case 'DELETE_QUESTION':
      newState.sections[action.payload.sectionIndex].questions.splice(action.payload.questionIndex, 1);
      return newState;
    default:
      return state;
  }
};

const AssessmentBuilderPage = () => {
  const { jobId } = useParams();
  const [assessmentState, dispatch] = useReducer(assessmentReducer, { title: '', sections: [] });

  // Load existing assessment or create a new one
  const existingAssessment = useLiveQuery(() => db.assessments.get({ jobId: Number(jobId) }), [jobId]);

  useEffect(() => {
    if (existingAssessment) {
      dispatch({ type: 'LOAD_ASSESSMENT', payload: existingAssessment.structure });
    } else {
      dispatch({ type: 'LOAD_ASSESSMENT', payload: { id: nanoid(), title: 'New Assessment', sections: [] } });
    }
  }, [existingAssessment]);
  
  // Debounced save to Dexie
  const saveAssessment = useCallback(async (state) => {
    await db.assessments.put({
      jobId: Number(jobId),
      title: state.title,
      structure: state,
    });
    console.log("Assessment saved!");
  }, [jobId]);

  useEffect(() => {
    if (assessmentState.title) { // Avoid saving initial empty state
        const handler = setTimeout(() => {
            saveAssessment(assessmentState);
        }, 1500); // Save 1.5s after last change
        return () => clearTimeout(handler);
    }
  }, [assessmentState, saveAssessment]);


  const handleQuestionChange = (sectionIndex, questionIndex, field, value) => {
    dispatch({ type: 'UPDATE_QUESTION', payload: { sectionIndex, questionIndex, field, value } });
  };
  
  if (!jobId) return <div>Loading...</div>

  return (
    <div className="builder-page">
      <div className="builder-panel">
        <h1>Assessment Builder</h1>
        <input
          type="text"
          className="assessment-title-input"
          value={assessmentState.title}
          onChange={(e) => dispatch({ type: 'UPDATE_TITLE', payload: e.target.value })}
        />
        {assessmentState.sections.map((section, sIdx) => (
          <div key={section.id} className="section-builder">
            <input
              className="section-title-input"
              value={section.title}
              onChange={(e) => dispatch({type: 'UPDATE_SECTION_TITLE', payload: {sectionIndex: sIdx, title: e.target.value}})}
            />
            {section.questions.map((q, qIdx) => (
              <div key={q.id} className="question-editor">
                <textarea
                  placeholder="Question Text"
                  value={q.text}
                  onChange={(e) => handleQuestionChange(sIdx, qIdx, 'text', e.target.value)}
                />
                <select value={q.type} onChange={(e) => handleQuestionChange(sIdx, qIdx, 'type', e.target.value)}>
                  <option value="short-text">Short Text</option>
                  <option value="long-text">Long Text</option>
                  <option value="single-choice">Single Choice</option>
                  <option value="multi-choice">Multi-Choice</option>
                </select>
                 <button onClick={() => dispatch({type: 'DELETE_QUESTION', payload: {sectionIndex: sIdx, questionIndex: qIdx}})} className="delete-btn">Delete</button>
                {/* Add more fields here for options, validation, conditional logic etc. */}
              </div>
            ))}
            <button onClick={() => dispatch({ type: 'ADD_QUESTION', payload: { sectionIndex: sIdx } })}>+ Add Question</button>
          </div>
        ))}
        <button onClick={() => dispatch({ type: 'ADD_SECTION' })}>+ Add Section</button>
      </div>
      <div className="preview-panel">
        <h2>Live Preview</h2>
        <AssessmentForm assessmentStructure={assessmentState} />
      </div>
    </div>
  );
};

export default AssessmentBuilderPage;