
import React, { useEffect } from 'react';
import { runSeed } from './seedDB';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';

// Pages
import DashboardPage from './pages/DashboardPage';
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetails"; // Corrected the import name for clarity
import CandidatesPage from './pages/CandidatePage';
import CandidateDetailsPage from './pages/CandidateDetailsPage';
import AssessmentBuilderPage from './pages/AssessmentBuilderPage';
import Navbar from "./components/Navbar";
// Context Providers
import { JobsProvider } from './context/JobsContext';
import { CandidatesProvider } from './context/CandidatesContext';
import AssessmentPage from "./pages/AssessmentPage";
import "react-toastify/dist/ReactToastify.css";
import './App.css'; // Optional: for better nav styling

function App() {

   useEffect(() => {
    runSeed();
  }, []);

  return (
    <ThemeProvider>
    <JobsProvider>
      <CandidatesProvider>
        <Router>
          <Navbar />
          
          <main style={{ padding: "0 1rem" }}>
            <Routes>
              {/* Job Routes */} 
               <Route path="/" element={<DashboardPage />} /> 
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:jobId" element={<JobDetailsPage />} /> 
              <Route path="/assessments" element={<AssessmentPage />} />
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
    </ThemeProvider>
  );
}
export default App;