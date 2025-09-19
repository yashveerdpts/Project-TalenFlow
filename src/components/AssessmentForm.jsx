// src/components/AssessmentForm.jsx
import React, { useState } from 'react';
import './AssessmentForm.css';

const Question = ({ question, response, onChange }) => {
  const { type, text, options, id } = question;

  const renderQuestion = () => {
    switch (type) {
      case 'short-text':
        return <input type="text" value={response || ''} onChange={e => onChange(id, e.target.value)} />;
      case 'long-text':
        return <textarea value={response || ''} onChange={e => onChange(id, e.target.value)} />;
      case 'single-choice':
        return (
          <div>
            {(options || []).map(opt => (
              <label key={opt.id}>
                <input type="radio" name={id} value={opt.value} checked={response === opt.value} onChange={e => onChange(id, e.target.value)} />
                {opt.label}
              </label>
            ))}
          </div>
        );
      // Add other question types here...
      default:
        return <p>Unsupported question type.</p>;
    }
  };

  return (
    <div className="form-question">
      <label>{text}</label>
      {renderQuestion()}
    </div>
  );
};


const AssessmentForm = ({ assessmentStructure, initialResponses = {}, onResponseChange }) => {
  const [responses, setResponses] = useState(initialResponses);

  const handleResponseChange = (questionId, value) => {
    const newResponses = { ...responses, [questionId]: value };
    setResponses(newResponses);
    if (onResponseChange) {
      onResponseChange(newResponses);
    }
  };

  if (!assessmentStructure) return null;

  return (
    <form className="assessment-form">
      <h3>{assessmentStructure.title}</h3>
      {assessmentStructure.sections.map(section => (
        <fieldset key={section.id} className="form-section">
          <legend>{section.title}</legend>
          {section.questions.map(q => {
            // ** Example of Conditional Logic **
            // if (q.condition && responses[q.condition.questionId] !== q.condition.value) {
            //   return null; // Don't render if condition not met
            // }
            return (
              <Question
                key={q.id}
                question={q}
                response={responses[q.id]}
                onChange={handleResponseChange}
              />
            );
          })}
        </fieldset>
      ))}
    </form>
  );
};

export default AssessmentForm;