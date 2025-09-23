import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import the new hook
import { useAuth } from '../context/AuthContext'; 
import { RxDashboard } from "react-icons/rx";
import './Navbar.css';
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

// A simple component for the theme icon
const ThemeIcon = ({ isDarkMode }) => (
  <span style={{ fontSize: '24px', verticalAlign: 'middle', cursor: 'pointer' }}>
    {isDarkMode ? '🌙' : '☀️'}
  </span>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">TᴀʟᴇɴᴛFʟᴏᴡ </NavLink>
      </div>
      <div className="navbar-links">
         <NavLink to="/"><RxDashboard/><span>Dashboard</span></NavLink>
        <NavLink to="/jobs"><JobIcon/><span>JOBS</span></NavLink>
        <NavLink to="/candidates"><CandidateIcon/> <span>CANDIDATES</span></NavLink>
        <NavLink to="/assessments"><AssessmentIcon/> <span>ASSESSMENTS</span></NavLink> 
      </div>
      <div className="navbar-actions">
        {/* Add the theme toggle button */}
        <button onClick={logout} className="btn btn-secondary">Logout</button>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          <ThemeIcon isDarkMode={theme === 'dark'} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;