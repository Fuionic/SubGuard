import React from 'react';
import { FaSignOutAlt, FaBars, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ collapsed, setCollapsed, activeView, setActiveView }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('username') || 'User';
  const avatarUrl = `https://ui-avatars.com/api/?name=${userName}&background=333&color=fff&size=32`;

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
        <div className="sidebar-brand">
          <div className="sidebar-logo-text">SubGuard</div>
          <div className="sidebar-subtitle">Your digital life, organised</div>
        </div>
        <FaBars className="toggle-btn" onClick={() => setCollapsed(!collapsed)} />
      </div>

      <ul className="sidebar-menu">
        <li className={activeView === 'dashboard' ? 'active' : ''} onClick={() => handleItemClick('dashboard')}>
          <span className="dot dot-green"></span> <span>Overview</span>
        </li>
        <li className={activeView === 'subscriptions' ? 'active' : ''} onClick={() => handleItemClick('subscriptions')}>
          <span className="dot dot-green"></span> <span>Subscriptions</span>
        </li>
        <li className={activeView === 'accounts' ? 'active' : ''} onClick={() => handleItemClick('accounts')}>
          <span className="dot dot-orange"></span> <span>Accounts</span>
        </li>
        <li className={activeView === 'vault' ? 'active' : ''} style={{opacity: 0.5, cursor: 'not-allowed'}}>
          <span className="dot dot-blue"></span> <span>Vault (Coming Soon)</span> <FaLock style={{marginLeft: 'auto', fontSize: '0.8rem', color: '#a5a5a5'}} />
        </li>
        <li className={activeView === 'settings' ? 'active' : ''} onClick={() => handleItemClick('settings')}>
          <span className="dot dot-grey"></span> <span>Settings</span>
        </li>
      </ul>
      
      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <img src={avatarUrl} alt="User Avatar" className="sidebar-avatar" />
          <div className="sidebar-user-info">
            <span className="sidebar-username">{userName}</span>
            <span className="sidebar-plan">Free plan</span>
          </div>
        </div>
        <div className="sidebar-logout" onClick={handleLogout} title="Logout">
          <FaSignOutAlt />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
