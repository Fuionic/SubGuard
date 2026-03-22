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
import './Dashboard.css';



function Dashboard() {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [showAddSubscriptionModal, setShowAddSubscriptionModal] = useState(false);
  const [showAddLinkedAccountModal, setShowAddLinkedAccountModal] = useState(false);
  const [showPasswordVault, setShowPasswordVault] = useState(false);
  const userEmail = localStorage.getItem('userId') || 'User';

  return (

    <div className="dashboard-container">
      <Topbar userEmail={userEmail} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="dashboard-body">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="dashboard-main">
          <div className="dashboard-content">
            {/* Quick Actions Bar - 3 buttons */}
            <div className="primary-actions-bar">
              <button className="btn-primary" onClick={() => setShowAddSubscriptionModal(true)}>
                <FaPlus className="icon" />
                Add Subscription
              </button>
              <button className="btn-primary" onClick={() => setShowAddLinkedAccountModal(true)}>
                <FaLink className="icon" />
                Add Linked Account
              </button>
              <button className="btn-primary" onClick={() => setShowPasswordVault(true)}>
                <FaLock className="icon" />
                Open Vault
              </button>
            </div>

            {/* Context */}
            <section className="context">
              <h1>Welcome back, User 👋</h1>
              <p>You're managing 6 subscriptions and 3 linked accounts</p>
            </section>

            <Overview />
            <SpendingChart />

            <SubscriptionStats />

            {/* Alert */}
            <section className="alert">
              <span className="alert-icon">⚠️</span>
              <span className="alert-text">2 subscriptions expiring in 5 days</span>
              <a href="#subscriptions" className="alert-link">View Details</a>
            </section>

            <RecentActivity />

            {/* Preview sections removed as requested */}
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
