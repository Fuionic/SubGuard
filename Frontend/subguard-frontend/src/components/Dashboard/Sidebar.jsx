import React from 'react';
import { FaHome, FaCreditCard, FaLink, FaCog, FaSignOutAlt, FaBars, FaRocket } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {/* Logo removed as requested */}
        <FaBars className="toggle-btn" onClick={() => setCollapsed(!collapsed)} />
      </div>

      <ul className="sidebar-menu">
        <li><FaHome /> <span>Dashboard</span></li>
        <li><FaCreditCard /> <span>Subscriptions</span></li>
        <li><FaLink /> <span>Linked Accounts</span></li>
        <li><FaCog /> <span>Settings</span></li>
        <li><FaRocket /> <span>Future Updates</span></li>
        <li className="logout" onClick={handleLogout}><FaSignOutAlt /> <span>Logout</span></li>
      </ul>
    </div>
  );
};

export default Sidebar;
