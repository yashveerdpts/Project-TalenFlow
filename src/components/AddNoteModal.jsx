import React, { useState } from 'react';
import './AddNoteModal.css';

const AddNoteModal = ({ isOpen, onClose, onSave, candidateName, newStage }) => {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Move {candidateName}</h2>
        <p>Add an optional note for moving this candidate to the **{newStage}** stage.</p>
        
        <div className="form-group">
          <label htmlFor="note-input">Note (Optional)</label>
          <textarea 
            id="note-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Followed up with a phone call..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;