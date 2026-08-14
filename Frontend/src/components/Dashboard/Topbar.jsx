import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaMoon, FaSun, FaBars, FaBell } from 'react-icons/fa';
import useNotifications from '../../hooks/useNotifications';

const Topbar = ({ userEmail, collapsed, setCollapsed }) => {
  const username = localStorage.getItem('username') || (userEmail ? userEmail.split('@')[0] : 'User');
  const avatarUrl = `https://ui-avatars.com/api/?name=${username}&background=667eea&color=fff&size=32`;
  const logo = '/logo.png';
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const userId = parseInt(localStorage.getItem('userId'), 10) || 1;
  const { notifications, unreadCount, markAllAsRead } = useNotifications(userId);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const formatDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('en-GB', options);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <FaBars className="mobile-toggle-btn" onClick={() => setCollapsed(!collapsed)} />
        <div className="topbar-date">{formatDate()}</div>
      </div>

      <div className="topbar-right">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        <button className="btn-secondary" onClick={() => document.dispatchEvent(new CustomEvent('openAddSubscription'))}>
          + Add subscription
        </button>
        <button className="btn-secondary" onClick={() => document.dispatchEvent(new CustomEvent('openAddAccount'))}>
          + Add account
        </button>
      </div>
    </div>
  );
};

export default Topbar;
