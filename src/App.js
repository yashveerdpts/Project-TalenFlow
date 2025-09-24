import React, { useEffect } from "react";
import { runSeed } from "./seedDB";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { JobsProvider } from "./context/JobsContext";
import { CandidatesProvider } from "./context/CandidatesContext";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetails";
import CandidatesPage from "./pages/CandidatePage";
import CandidateDetailsPage from "./pages/CandidateDetailsPage";
import AssessmentBuilderPage from "./pages/AssessmentBuilderPage";
import AssessmentPage from "./pages/AssessmentPage";
import LoginPage from "./pages/LoginPage";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const Layout = () => (
  <>
    <Navbar />
    <main style={{ padding: "0 1rem" }}>
      <Outlet />
    </main>
  </>
);

function App() {
  useEffect(() => {
    runSeed();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <JobsProvider>
            <CandidatesProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                
                  <Route path="/" element={<DashboardPage />} />

                 
                  <Route element={<Layout />}>
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
                    <Route
                      path="/jobs/:jobId/assessment"
                      element={<AssessmentBuilderPage />}
                    />
                    <Route path="/assessments" element={<AssessmentPage />} />
                    <Route path="/candidates" element={<CandidatesPage />} />
                    <Route
                      path="/candidates/:id"
                      element={<CandidateDetailsPage />}
                    />
                  </Route>
                </Route>
              </Routes>
            </CandidatesProvider>
          </JobsProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
