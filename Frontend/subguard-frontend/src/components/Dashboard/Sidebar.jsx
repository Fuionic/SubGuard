import React from 'react';
import { FaHome, FaCreditCard, FaLink, FaCog, FaSignOutAlt, FaBars, FaRocket } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ collapsed, setCollapsed, activeView, setActiveView }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleItemClick = (view) => {
    setActiveView(view);
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {/* Logo removed as requested */}
        <FaBars className="toggle-btn" onClick={() => setCollapsed(!collapsed)} />
      </div>

      <ul className="sidebar-menu">
        <li className={activeView === 'dashboard' ? 'active' : ''} onClick={() => handleItemClick('dashboard')}>
          <FaHome /> <span>Dashboard</span>
        </li>
        <li className={activeView === 'subscriptions' ? 'active' : ''} onClick={() => handleItemClick('subscriptions')}>
          <FaCreditCard /> <span>Subscriptions</span>
        </li>
        <li className={activeView === 'accounts' ? 'active' : ''} onClick={() => handleItemClick('accounts')}>
          <FaLink /> <span>Linked Accounts</span>
        </li>
        <li className={activeView === 'settings' ? 'active' : ''} onClick={() => handleItemClick('settings')}>
          <FaCog /> <span>Settings</span>
        </li>
        <li className={activeView === 'updates' ? 'active' : ''} onClick={() => handleItemClick('updates')}>
          <FaRocket /> <span>Future Updates</span>
        </li>
        <li className="logout" onClick={handleLogout}><FaSignOutAlt /> <span>Logout</span></li>
      </ul>
    </div>
  );
};

export default Sidebar;
