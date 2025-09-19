import React, { useState } from "react";
import Modal from "react-modal";
import { createJob, useJobsDispatch } from "../context/JobsContext";

Modal.setAppElement("#root");

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export default function JobFormModal({ isOpen, onClose }) {
  const dispatch = useJobsDispatch();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const slug = slugify(title);
    const newJob = { title, slug, status: "active", tags: [] };
    const res = await createJob(dispatch, newJob);

    if (res.success) {
      onClose();
      setTitle("");
    } else {
      setError(res.error || "Failed to create job");
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Job Form">
      <h2>Create Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title*</label><br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ marginTop: 12 }}>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}