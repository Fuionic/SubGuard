import React, { useState } from 'react';
import { FaPlus, FaLink, FaLock } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Overview from './Overview';
import SubscriptionStats from './SubscriptionStats';
import SpendingChart from './SpendingChart';
import RecentActivity from './RecentActivity';
import SubscriptionList from '../Subscriptions/SubscriptionList';
import AddSubscription from '../Subscriptions/AddSubscription';
import LinkedAccountsList from '../LinkedAccounts/LinkedAccountsList';
import AddLinkedAccount from '../LinkedAccounts/AddLinkedAccount';
import PasswordManager from '../passwordManager/PasswordManager';
import Settings from '../Settings/Settings';
import apiClient from '../../api/apiClient';
import './Dashboard.css';



function Dashboard() {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [activeView, setActiveView] = useState('dashboard');
  const [showAddSubscriptionModal, setShowAddSubscriptionModal] = useState(false);
  const [showAddLinkedAccountModal, setShowAddLinkedAccountModal] = useState(false);
  const [showPasswordVault, setShowPasswordVault] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('username') || 'User');
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userId') || 'User';

  React.useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await apiClient.get(`/settings/${userId}`);
        const data = response.data;
        if (data && data.name) {
          setUserName(data.name);
          localStorage.setItem('username', data.name);
        }
      } catch (err) {
        console.error("Error fetching user name:", err);
      }
    };
    if (userId) fetchUserName();
  }, [userId, activeView]); // Re-fetch name when returning from settings

  const renderContent = () => {
    switch (activeView) {
      case 'subscriptions':
        return (
          <section className="view-section">
            <h2>My Subscriptions</h2>
            <SubscriptionList limit={100} />
          </section>
        );
      case 'accounts':
        return (
          <section className="view-section">
            <h2>Linked Accounts</h2>
            <LinkedAccountsList />
          </section>
        );
      case 'settings':
        return <Settings />;
      case 'updates':
        return (
          <section className="view-section">
            <h2>Future Updates</h2>
            <p>Upcoming features and roadmaps...</p>
          </section>
        );
      default:
        return (
          <Overview />
        );
    }
  };

  React.useEffect(() => {
    const handleAddSub = () => setShowAddSubscriptionModal(true);
    const handleAddAcc = () => setShowAddLinkedAccountModal(true);
    
    document.addEventListener('openAddSubscription', handleAddSub);
    document.addEventListener('openAddAccount', handleAddAcc);
    
    return () => {
      document.removeEventListener('openAddSubscription', handleAddSub);
      document.removeEventListener('openAddAccount', handleAddAcc);
    };
  }, []);

  return (
    <div className="dashboard-container" style={{flexDirection: 'row'}}>
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      <div className="dashboard-body" style={{flexDirection: 'column'}}>
        <Topbar userEmail={userEmail} collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="dashboard-main">
          <div className="dashboard-content">
            {/* Context */}
            {activeView === 'dashboard' && (
              <section className="context" style={{display: 'none'}}>
                <h1>Welcome back, {userName} 👋</h1>
                <p>You're managing your digital life with SubGuard</p>
              </section>
            )}

            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddSubscriptionModal && (
        <div className="modal-overlay" onClick={() => setShowAddSubscriptionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddSubscriptionModal(false)}>×</button>
            <h3>Add Subscription</h3>
            <AddSubscription onClose={() => setShowAddSubscriptionModal(false)} />
          </div>
        </div>
      )}

      {showAddLinkedAccountModal && (
        <div className="modal-overlay" onClick={() => setShowAddLinkedAccountModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddLinkedAccountModal(false)}>×</button>
            <h3>Add Linked Account</h3>
            <AddLinkedAccount onClose={() => setShowAddLinkedAccountModal(false)} />
          </div>
        </div>
      )}

      {/* Vault Modal */}
      {showPasswordVault && (
        <div className="modal-overlay" onClick={() => setShowPasswordVault(false)}>
          <div className="modal-content vault-modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '95vw', maxHeight: '95vh', width: '1100px', padding: '0', overflow: 'hidden'}}>
            <button className="modal-close" onClick={() => setShowPasswordVault(false)} style={{zIndex: '100'}}>×</button>
            <PasswordManager />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
