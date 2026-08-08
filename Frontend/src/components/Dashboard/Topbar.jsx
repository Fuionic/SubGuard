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

  return (
    <div className="topbar">
      <div className="topbar-left">
        <FaBars className="mobile-toggle-btn" onClick={() => setCollapsed(!collapsed)} />
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
        <div className="notification-container" ref={notifRef}>
          <button 
            className="theme-toggle-btn notification-btn" 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) markAllAsRead();
            }}
          >
            <FaBell />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
              </div>
              <div className="dropdown-body">
                {notifications.length === 0 ? (
                  <p className="no-notifications">You're all caught up!</p>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.type}`}>
                      <p>{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="profile">
          <img src={avatarUrl} alt="User Avatar" className="avatar" />
          <span className="username">Hello, {username}</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
