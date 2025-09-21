import React, { useState } from 'react';

const AssessmentForm = ({ assessmentStructure, onResponseChange, responses }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (questionId, value) => {
    onResponseChange(prev => ({ ...prev, [questionId]: value }));
  };
  
  const validateAndSubmit = () => {
    const newErrors = {};
    assessmentStructure.sections.forEach(section => {
      section.questions.forEach(q => {
        const answer = responses[q.id];
        const rules = q.validation;
        
        if(rules.required && !answer) {
          newErrors[q.id] = 'This field is required.';
        }
        if(q.type === 'numeric' && answer) {
          if(rules.min !== null && answer < rules.min) newErrors[q.id] = `Must be at least ${rules.min}.`;
          if(rules.max !== null && answer > rules.max) newErrors[q.id] = `Must be no more than ${rules.max}.`;
        }
        if(['short-text', 'long-text'].includes(q.type) && answer) {
          if(rules.maxLength && answer.length > rules.maxLength) newErrors[q.id] = `Cannot exceed ${rules.maxLength} characters.`;
        }
      });
    });
    setErrors(newErrors);
    if(Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
      console.log('Candidate Responses:', responses);
    }
  };

  const renderQuestion = (q) => {
    // Conditional Logic Check
    if (q.conditional?.dependsOn) {
      const parentAnswer = responses[q.conditional.dependsOn];
      if (parentAnswer !== q.conditional.showIfValue) {
        return null;
      }
    }

    const value = responses[q.id] || '';
    const error = errors[q.id];

    return (
      <div key={q.id} className="form-question">
        <label>{q.text} {q.validation.required && '*'}</label>
        
        {q.type === 'short-text' && <input type="text" value={value} onChange={e => handleChange(q.id, e.target.value)} />}
        {q.type === 'long-text' && <textarea value={value} onChange={e => handleChange(q.id, e.target.value)} />}
        {q.type === 'numeric' && <input type="number" value={value} onChange={e => handleChange(q.id, e.target.value)} />}
        {q.type === 'file-upload' && <input type="file" />}
        
        {q.type === 'single-choice' && q.options.map(opt => (
          <div key={opt}><label><input type="radio" name={q.id} value={opt} checked={value === opt} onChange={e => handleChange(q.id, e.target.value)} /> {opt}</label></div>
        ))}

        {q.type === 'multi-choice' && q.options.map(opt => {
          const currentValues = value || [];
          const isChecked = currentValues.includes(opt);
          const handleMultiChange = () => {
              const newValues = isChecked ? currentValues.filter(item => item !== opt) : [...currentValues, opt];
              handleChange(q.id, newValues);
          };
          return <div key={opt}><label><input type="checkbox" value={opt} checked={isChecked} onChange={handleMultiChange} /> {opt}</label></div>
        })}
        
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  };
  
  if (!assessmentStructure) return null;

  return (
    <div className="assessment-form-preview">
      <h3>{assessmentStructure.title}</h3>
      {assessmentStructure.sections.map(section => (
        <div key={section.id} className="form-section">
          <h4>{section.title}</h4>
          {section.questions.map(renderQuestion)}
        </div>
      ))}
      <button className="btn btn-primary" onClick={validateAndSubmit}>Submit Assessment</button>
    </div>
  );
};

export default AssessmentForm;