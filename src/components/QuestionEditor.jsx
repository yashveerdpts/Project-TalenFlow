import React from 'react';

const QuestionEditor = ({ question, sectionIndex, questionIndex, allQuestions, dispatch }) => {
  
  const handleFieldChange = (field, value) => {
    dispatch({ type: 'UPDATE_QUESTION_FIELD', payload: { sIdx: sectionIndex, qIdx: questionIndex, field, value } });
  };

  const handleValidationChange = (field, value) => {
    const newValidation = { ...question.validation, [field]: value };
    handleFieldChange('validation', newValidation);
  };

  const handleConditionalChange = (field, value) => {
    const newConditional = { ...question.conditional, [field]: value };
    handleFieldChange('conditional', newConditional);
  };
  
  const handleOptionChange = (optIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = value;
    handleFieldChange('options', newOptions);
  };

  const addOption = () => handleFieldChange('options', [...question.options, '']);
  const removeOption = (optIndex) => handleFieldChange('options', question.options.filter((_, i) => i !== optIndex));

  const availableConditionalQuestions = allQuestions.filter(q => q.id !== question.id);

  return (
    <div className="question-editor">
      <textarea
        placeholder="Question Text"
        value={question.text}
        onChange={(e) => handleFieldChange('text', e.target.value)}
        className="question-text-input" 
     
           
      />
      <div className="question-controls">
        <select value={question.type} onChange={(e) => handleFieldChange('type', e.target.value)}>
          <option value="short-text">Short Text</option>
          <option value="long-text">Long Text</option>
          <option value="single-choice">Single Choice</option>
          <option value="multi-choice">Multi-Choice</option>
          <option value="numeric">Numeric</option>
          <option value="file-upload">File Upload</option>
        </select>
        <button onClick={() => dispatch({ type: 'DELETE_QUESTION', payload: { sectionIndex, questionIndex } })} className="delete-btn">
          Delete
        </button>
      </div>

      {(question.type === 'single-choice' || question.type === 'multi-choice') && (
        <div className="options-editor">
          {question.options.map((opt, i) => (
            <div key={i} className="option-input-group">
              <input type="text" value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} placeholder={`Option ${i + 1}`} />
              <button onClick={() => removeOption(i)} className="btn-remove-option">×</button>
            </div>
          ))}
          <button onClick={addOption} className="btn btn-secondary btn-add-option">+ Add Option</button>
        </div>
      )}

      <div className="validation-rules">
        <h4>Validation</h4>
        <label><input type="checkbox" checked={question.validation.required} onChange={e => handleValidationChange('required', e.target.checked)} /> Required</label>
        {(question.type === 'short-text' || question.type === 'long-text') && (
          <input type="number" placeholder="Max Length" value={question.validation.maxLength || ''} onChange={e => handleValidationChange('maxLength', parseInt(e.target.value, 10))} />
        )}
        {question.type === 'numeric' && (
          <div className="numeric-range">
            <input type="number" placeholder="Min Value" value={question.validation.min || ''} onChange={e => handleValidationChange('min', parseInt(e.target.value, 10))} />
            <input type="number" placeholder="Max Value" value={question.validation.max || ''} onChange={e => handleValidationChange('max', parseInt(e.target.value, 10))} />
          </div>
        )}
      </div>

      <div className="conditional-logic">
        <h4>Conditional Logic</h4>
        <select value={question.conditional.dependsOn || ''} onChange={e => handleConditionalChange('dependsOn', e.target.value || null)}>
          <option value="">Show always</option>
          {availableConditionalQuestions.map(q => <option key={q.id} value={q.id}>{q.text.substring(0, 50)}...</option>)}
        </select>
        {question.conditional.dependsOn && (
          <input type="text" placeholder="Show if value is..." value={question.conditional.showIfValue} onChange={e => handleConditionalChange('showIfValue', e.target.value)} />
        )}
      </div>
    </div>
  );
};

export default QuestionEditor;