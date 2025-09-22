import React, { useEffect } from 'react';
import { runSeed } from './seedDB';
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { JobsProvider } from './context/JobsContext';
import { CandidatesProvider } from './context/CandidatesContext';

// Components and Pages
import Navbar from "./components/Navbar";
import DashboardPage from './pages/DashboardPage';
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetails";
import CandidatesPage from './pages/CandidatePage';
import CandidateDetailsPage from './pages/CandidateDetailsPage';
import AssessmentBuilderPage from './pages/AssessmentBuilderPage';
import AssessmentPage from "./pages/AssessmentPage";

import "react-toastify/dist/ReactToastify.css";
import './App.css';

// A Layout component to apply the Navbar to every page
const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ padding: "0 1rem" }}>
        {/* Child routes will render here */}
        <Outlet /> 
      </main>
    </>
  );
};

function App() {
  useEffect(() => {
    runSeed();
  }, []);

  return (
    // All providers are now cleanly organized here
    <ThemeProvider>
      <JobsProvider>
        <CandidatesProvider>
          <Router>
            <Routes>
              {/* All pages that should have a navbar are children of the Layout route */}
              <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
                <Route path="/jobs/:jobId/assessment" element={<AssessmentBuilderPage />} />
                <Route path="/assessments" element={<AssessmentPage />} />
                <Route path="/candidates" element={<CandidatesPage />} />
                <Route path="/candidates/:id" element={<CandidateDetailsPage />} />
              </Route>
            </Routes>
          </Router>
        </CandidatesProvider>
      </JobsProvider>
    </ThemeProvider>
  );
}

export default App;