import React, { useState, useEffect } from 'react';
import './Overview.css';
import apiClient from '../../api/apiClient';
import { getEntries } from '../passwordManager/vaultDB';

const Overview = () => {
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    renewingSoon: 0,
    unusedAccounts: 0,
    passwordsStored: 0,
    weakPasswords: 0,
    totalMonthlyCost: 0,
    topSubscriptions: [],
    upcomingSubscriptions: []
  });

  const userId = localStorage.getItem('userId') || 1;

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        // Fetch subscriptions
        const subRes = await apiClient.get(`/subscriptions/user/${userId}`);
        const subscriptions = subRes.data || [];
        
        // Fetch linked accounts
        const accRes = await apiClient.get(`/accounts/user/${userId}`);
        const accounts = accRes.data || [];
        
        // Fetch vault passwords
        const vaultEntries = await getEntries(userId) || [];

        // Calculate stats
        const activeSubscriptions = subscriptions.length;
        const totalMonthlyCost = subscriptions.reduce((sum, sub) => sum + (sub.price || 0), 0);
        
        // Mock logic for renewing soon (e.g. less than 7 days) 
        // Assuming real app parses sub.renewalDate, we'll just say 0 for now unless we calculate it.
        // Let's just say renewing soon is subscriptions <= 7 days away.
        const renewingSoon = subscriptions.filter(s => {
          if(!s.renewalDate) return false;
          const diff = new Date(s.renewalDate).getTime() - new Date().getTime();
          return diff > 0 && diff <= (7 * 24 * 60 * 60 * 1000);
        }).length;

        // Mock logic for unused accounts
        const unusedAccounts = accounts.length; // You can add logic for 'lastUsedDate' here

        // Passwords
        const passwordsStored = vaultEntries.length;
        const weakPasswords = vaultEntries.filter(e => e.password && e.password.length < 8).length; // Naive weak check

        // Get top 4 subscriptions by price for the chart
        const topSubscriptions = [...subscriptions].sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 4);

        // Get upcoming subscriptions for the list
        const upcomingSubscriptions = [...subscriptions]
          .filter(s => s.renewalDate)
          .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
          .slice(0, 1); // Mockup only shows 1

        setStats({
          activeSubscriptions,
          renewingSoon,
          unusedAccounts,
          passwordsStored,
          weakPasswords,
          totalMonthlyCost,
          topSubscriptions,
          upcomingSubscriptions
        });
        
      } catch (err) {
        console.error('Error fetching overview data:', err);
      }
    };

    fetchOverviewData();
  }, [userId]);

  const maxPrice = Math.max(...stats.topSubscriptions.map(s => s.price || 0), 1); // Avoid div by 0

  return (
    <div className="overview-container">
      {/* Alert Banner */}
      <div className="overview-alert">
        <div className="alert-content">
          <span className="dot dot-orange"></span>
          <span>{stats.renewingSoon} subscriptions renewing in the next 7 days — and you have {stats.unusedAccounts} accounts unused recently</span>
        </div>
        <button className="btn-review">Review</button>
      </div>

      <div className="overview-grid">
        {/* Left Column: Stats */}
        <div className="stats-column">
          <h3 className="section-title">THIS MONTH</h3>
          <ul className="stats-list">
            <li>
              <span>Active subscriptions</span>
              <span className="stat-value text-green">{stats.activeSubscriptions}</span>
            </li>
            <li>
              <span>Renewing soon</span>
              <span className="stat-value text-orange">{stats.renewingSoon}</span>
            </li>
            <li>
              <span>Unused accounts</span>
              <span className="stat-value text-orange">{stats.unusedAccounts}</span>
            </li>
            <li>
              <span>Passwords stored</span>
              <span className="stat-value text-white">{stats.passwordsStored}</span>
            </li>
            <li>
              <span>Weak passwords</span>
              <span className="stat-value text-orange">{stats.weakPasswords}</span>
            </li>
          </ul>
        </div>

        {/* Right Column: Spending */}
        <div className="spending-column">
          <h3 className="section-title">MONTHLY SPEND</h3>
          <div className="spending-total">
            <span className="currency">₹</span>
            <span className="amount">{stats.totalMonthlyCost}</span>
          </div>
          <p className="spending-subtitle">per month · ₹{stats.totalMonthlyCost * 12} per year</p>

          <div className="spending-bars">
            {stats.topSubscriptions.map((sub, idx) => (
              <div className="spending-bar-row" key={sub.id || idx}>
                <span className="bar-label" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{sub.name}</span>
                <div className="bar-track">
                  <div 
                    className={`bar-fill ${idx === 0 || idx === 1 || idx === 2 ? 'fill-green' : 'fill-orange'}`} 
                    style={{width: `${Math.max((sub.price / maxPrice) * 100, 5)}%`}}
                  ></div>
                </div>
                <span className="bar-value">₹{sub.price}</span>
              </div>
            ))}
            {stats.topSubscriptions.length === 0 && (
              <div className="spending-bar-row"><span style={{color: 'var(--text-secondary)'}}>No subscriptions added yet.</span></div>
            )}
          </div>
        </div>
      </div>

      {/* Subscriptions Section */}
      <div className="subscriptions-section">
        <h3 className="section-title">SUBSCRIPTIONS</h3>
        {stats.upcomingSubscriptions.length > 0 ? (
          stats.upcomingSubscriptions.map((sub, idx) => {
            const dateStr = sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown';
            return (
              <div className="subscription-item" key={sub.id || idx}>
                <span className="dot dot-orange"></span>
                <div className="sub-details">
                  <div className="sub-name">{sub.name}</div>
                  <div className="sub-meta">Renews {dateStr}</div>
                </div>
                <div className="sub-actions">
                  <span className="pill-warning">Due soon</span>
                  <span className="sub-price">₹{sub.price}/mo</span>
                </div>
              </div>
            )
          })
        ) : (
          <div style={{color: 'var(--text-secondary)'}}>No upcoming subscriptions.</div>
        )}
      </div>
    </div>
  );
};

export default Overview;
