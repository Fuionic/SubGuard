import React, { useState, useEffect } from 'react';
import { FaSearch, FaMoon, FaSun } from 'react-icons/fa';

const Topbar = ({ userEmail }) => {
  const username = localStorage.getItem('username') || (userEmail ? userEmail.split('@')[0] : 'User');
  const avatarUrl = `https://ui-avatars.com/api/?name=${username}&background=667eea&color=fff&size=32`;
  const logo = '/logo.png';
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="app-title" role="banner" aria-label="SubGuard application">
          <span className="app-mark" aria-hidden="true">
            <img src={logo} alt="SubGuard" className="app-mark-img" />
          </span>
          <span className="logo">SubGuard</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search subscriptions..." />
        </div>
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        <div className="profile">
          <img src={avatarUrl} alt="User Avatar" className="avatar" />
          <span className="username">Hello, {username}</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
