import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../dexieDB';
import ProfileAvatar from '../components/ProfileAvatar';
import './DashboardPage.css'; // The new CSS for the dashboard

// --- Icon Components ---
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
  </svg>
);

const JobIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
  </svg>
);

const CandidateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M15 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 0 0 .014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 0 0 .022.004zM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  </svg>
);

const AssessmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
  </svg>
);


const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- Data Fetching ---
  const jobs = useLiveQuery(() => db.jobs.toArray(), []);
  const candidates = useLiveQuery(() => db.candidates.toArray(), []);
  const assessments = useLiveQuery(() => db.assessments.toArray(), []);

  // --- Memoized Statistics ---
  const stats = useMemo(() => {
    if (!jobs || !candidates) return { totalJobs: 0, activeJobs: 0, totalCandidates: 0, hired: 0 };
    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(j => j.status === 'active').length,
      totalCandidates: candidates.length,
      hired: candidates.filter(c => c.stage === 'Hired').length,
    };
  }, [jobs, candidates, assessments]);

  const recentCandidates = useMemo(() => {
    if (!candidates) return [];
    // Assuming candidates have an ID that increments, otherwise use a timestamp.
    return [...candidates].sort((a, b) => b.id - a.id).slice(0, 5);
  }, [candidates]);
  
  const activeJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter(j => j.status === 'active').slice(0, 5);
  }, [jobs]);

  if (!jobs || !candidates) {
    return <div>Loading Dashboard...</div>;
  }

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* --- Collapsible Sidebar --- */}
      <aside className="dashboard-sidebar">
        
        <nav className="sidebar-nav">
          <Link to="/jobs"><JobIcon /> <span>Jobs</span></Link>
          <Link to="/candidates"><CandidateIcon /> <span>Candidates</span></Link>
          <Link to="/assessments"><AssessmentIcon /> <span>Assessments</span></Link>
          {/* Add more links here */}
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="sidebar-toggle">
            <MenuIcon />
          </button>
          <h1>Dashboard</h1>
        </header>

        {/* --- Summary Cards --- */}
        <section className="summary-cards">
          <div className="summary-card">
            <h4>Total Jobs</h4>
            <p>{stats.totalJobs}</p>
          </div>
          <div className="summary-card">
            <h4>Active Jobs</h4>
            <p>{stats.activeJobs}</p>
          </div>
          <div className="summary-card">
            <h4>Total Candidates</h4>
            <p>{stats.totalCandidates}</p>
          </div>
          <div className="summary-card">
            <h4>Candidates Hired</h4>
            <p>{stats.hired}</p>
          </div>
        </section>

        {/* --- Two-Column Layout for Lists --- */}
        <section className="dashboard-columns">
          <div className="dashboard-list-card">
            <h3>Recent Candidates</h3>
            <ul className="recent-candidates-list">
              {recentCandidates.map(c => (
                <li key={c.id}>
                  <Link to={`/candidates/${c.id}`}>
                    <ProfileAvatar name={c.name} />
                    <div className="candidate-details">
                      <strong>{c.name}</strong>
                      <span>{c.email}</span>
                    </div>
                    <span className={`status-badge status-${c.stage.toLowerCase()}`}>{c.stage}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-list-card">
            <h3>Active Jobs</h3>
            <ul className="active-jobs-list">
              {activeJobs.map(j => (
                <li key={j.id}>
                  <Link to={`/jobs/${j.id}`}>
                    <div className="job-details">
                      <strong>{j.title}</strong>
                      <span>{j.slug}</span>
                    </div>
                    <span className={`status-badge status-${j.status}`}>{j.status}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;