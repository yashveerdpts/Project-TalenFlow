import React, { useEffect, useReducer, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../dexieDB';
import AssessmentForm from '../components/AssessmentForm';
import QuestionEditor from '../components/QuestionEditor';
import './AssessmentBuilderPage.css';
import { nanoid } from 'nanoid';

const assessmentReducer = (state, action) => {
  if (!state && action.type !== 'LOAD_ASSESSMENT') return state;
  const newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case 'LOAD_ASSESSMENT':
      return action.payload || { title: 'New Assessment', sections: [] };
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
        validation: { required: false, min: null, max: null, maxLength: null },
        conditional: { dependsOn: null, showIfValue: '' },
      });
      return newState;
    case 'UPDATE_QUESTION_FIELD': {
      const { sIdx, qIdx, field, value } = action.payload;
      newState.sections[sIdx].questions[qIdx][field] = value;
      return newState;
    }
    case 'DELETE_QUESTION':
      newState.sections[action.payload.sectionIndex].questions.splice(action.payload.questionIndex, 1);
      return newState;
    default:
      return state;
  }
};

const AssessmentBuilderPage = () => {
  const { jobId } = useParams();
  const [assessmentId, setAssessmentId] = useState(null);
  const [assessmentState, dispatch] = useReducer(assessmentReducer, null);
  const [responses, setResponses] = useState({});

  const existingAssessment = useLiveQuery(() => db.assessments.where({ jobId: Number(jobId) }).first(), [jobId]);

  useEffect(() => {
    if (existingAssessment) {
      dispatch({ type: 'LOAD_ASSESSMENT', payload: existingAssessment.structure });
      setAssessmentId(existingAssessment.id);
    } else {
      dispatch({ type: 'LOAD_ASSESSMENT', payload: { title: 'New Assessment', sections: [{ id: nanoid(), title: 'First Section', questions: [] }] } });
      setAssessmentId(null);
    }
  }, [existingAssessment]);

  const saveAssessment = useCallback(async (state) => {
    if (!state) return;
    try {
      const payload = { jobId: Number(jobId), title: state.title, structure: state };
      if (assessmentId) {
        await db.assessments.update(assessmentId, payload);
      } else {
        const newId = await db.assessments.add(payload);
        setAssessmentId(newId);
      }
      console.log("Assessment saved!");
    } catch (error) {
      console.error("Failed to save assessment:", error);
    }
  }, [jobId, assessmentId]);

  useEffect(() => {
    if (assessmentState) {
      const handler = setTimeout(() => saveAssessment(assessmentState), 1500);
      return () => clearTimeout(handler);
    }
  }, [assessmentState, saveAssessment]);

  if (!assessmentState) return <div>Loading Assessment...</div>;

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
              onChange={(e) => dispatch({ type: 'UPDATE_SECTION_TITLE', payload: { sectionIndex: sIdx, title: e.target.value } })}
            />
            {section.questions.map((q, qIdx) => (
              <QuestionEditor
                key={q.id}
                question={q}
                sectionIndex={sIdx}
                questionIndex={qIdx}
                allQuestions={assessmentState.sections.flatMap(s => s.questions)}
                dispatch={dispatch}
              />
            ))}
            <button onClick={() => dispatch({ type: 'ADD_QUESTION', payload: { sectionIndex: sIdx } })} className="btn btn-secondary">
              + Add Question
            </button>
          </div>
        ))}
        <button onClick={() => dispatch({ type: 'ADD_SECTION' })} className="btn btn-primary">+ Add Section</button>
      </div>
      <div className="preview-panel">
        <h2>Live Preview</h2>
        <AssessmentForm
          assessmentStructure={assessmentState}
          onResponseChange={setResponses}
          responses={responses}
        />
      </div>
    </div>
  );
};

export default AssessmentBuilderPage;