// src/components/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <NavLink to="/">TALENTFLOW</NavLink>
        </div>
        <nav className="main-nav">
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/candidates">Candidates</NavLink>
        </nav>
        <div className="header-actions">
          <label className="theme-switcher">
            <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
            <span className="slider">
              <span className="icon sun">☀️</span>
              <span className="icon moon">🌙</span>
            </span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Header;