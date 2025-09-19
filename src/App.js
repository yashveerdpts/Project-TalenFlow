import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Pages
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetails"; // Corrected the import name for clarity
import CandidatesPage from './pages/CandidatePage';
import CandidateDetailsPage from './pages/CandidateDetailsPage';
import AssessmentBuilderPage from './pages/AssessmentBuilderPage';

// Context Providers
import { JobsProvider } from './context/JobsContext';
import { CandidatesProvider } from './context/CandidatesContext';

// Styles
import "react-toastify/dist/ReactToastify.css";
import './App.css'; // Optional: for better nav styling

function App() {
  return (
    <JobsProvider>
      <CandidatesProvider>
        <Router>
          <nav style={{ padding: "1rem", background: "#f0f0f0", marginBottom: "1.5rem", borderBottom: "1px solid #ddd" }}>
            <Link to="/jobs" style={{ marginRight: "1rem", textDecoration: "none", color: "#333", fontWeight: "bold" }}>Jobs</Link>
            <Link to="/candidates" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Candidates</Link>
          

          </nav>
          
          <main style={{ padding: "0 1rem" }}>
            <Routes>
              {/* Job Routes */}
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:jobId" element={<JobDetailsPage />} />

              {/* Candidate Routes */}
              <Route path="/candidates" element={<CandidatesPage />} />
              <Route path="/candidates/:id" element={<CandidateDetailsPage />} />

              {/* Assessment Routes */}
              <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
              <Route path="/jobs/:jobId/assessment" element={<AssessmentBuilderPage />} />
              {/* Optional: Redirect root to jobs page */}
              <Route path="/" element={<JobsPage />} />
            </Routes>
          </main>
        </Router>
      </CandidatesProvider>
    </JobsProvider>
  );
}
export default App;