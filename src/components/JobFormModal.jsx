import React, { useState, useEffect } from "react";
import { useJobsDispatch, createJob, updateJob } from "../context/JobsContext";
import "./JobFormModal.css";

const generateSlug = (text) => 
  text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

function JobFormModal({ isOpen, onClose, jobToEdit }) {
  const dispatch = useJobsDispatch();

  const [formData, setFormData] = useState({ title: "", slug: "", tags: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = Boolean(jobToEdit);

  useEffect(() => {
    const isSlugAuto = formData.slug === generateSlug(formData.title);
    if (!isSlugAuto && formData.slug !== '') {
      return;
    }
    setFormData(prev => ({ ...prev, slug: generateSlug(prev.title) }));
  }, [formData.title]);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          title: jobToEdit.title || "",
          slug: jobToEdit.slug || "",
          tags: Array.isArray(jobToEdit.tags) ? jobToEdit.tags.join(", ") : "",
        });
      } else {
        setFormData({ title: "", slug: "", tags: "" });
      }
      setErrors({});
    }
  }, [isOpen, jobToEdit, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const jobData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    const result = isEditMode
      ? await updateJob(dispatch, jobToEdit.id, jobData)
      : await createJob(dispatch, jobData);

    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrors(result.errors || { general: "Failed to save job. Please try again." });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditMode ? "Edit Job" : "Create New Job"}</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && <p className="error-message">{errors.general}</p>}
          
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              id="title" name="title" type="text"
              value={formData.title} onChange={handleChange}
              placeholder="e.g., Senior Frontend Developer"
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="slug">URL Slug</label>
            <input
              id="slug" name="slug" type="text"
              value={formData.slug} onChange={handleChange}
              className={errors.slug ? 'input-error' : ''}
            />
            <small>Auto-generated from title, but can be edited.</small>
            {errors.slug && <p className="error-message">{errors.slug}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags" name="tags" type="text"
              value={formData.tags} onChange={handleChange}
              placeholder="e.g., react, typescript, remote"
            />
            <small>Comma-separated list of tags.</small>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobFormModal;