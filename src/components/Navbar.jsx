import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import the new hook
import './Navbar.css';

// A simple component for the theme icon
const ThemeIcon = ({ isDarkMode }) => (
  <span style={{ fontSize: '24px', verticalAlign: 'middle', cursor: 'pointer' }}>
    {isDarkMode ? '🌙' : '☀️'}
  </span>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">TalentFlow</NavLink>
      </div>
      <div className="navbar-links">
        <NavLink to="/jobs">JOBS</NavLink>
        <NavLink to="/candidates">CANDIDATES</NavLink>
        <NavLink to="/assessments">ASSESSMENTS</NavLink>
      </div>
      <div className="navbar-actions">
        {/* Add the theme toggle button */}
        <button onClick={toggleTheme} className="theme-toggle-btn">
          <ThemeIcon isDarkMode={theme === 'dark'} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;