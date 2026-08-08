import React, { useState, useEffect } from 'react';

const Overview = () => {
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    linkedAccounts: 0,
    nextRenewal: 'No upcoming renewals',
    totalMonthlyCost: 0
  });

  useEffect(() => {
    // In a real app, fetch from API
    // For now, using placeholder data
    setStats({
      activeSubscriptions: 6,
      linkedAccounts: 3,
      nextRenewal: 'Netflix — 28 Oct',
      totalMonthlyCost: 1247
    });
  }, []);

  return (
    <div>
      <h2>Overview</h2>
      <div className="overview-cards">
        <div className="card glass">
          <h3>Active Subscriptions</h3>
          <p>{stats.activeSubscriptions}</p>
        </div>
        <div className="card glass">
          <h3>Linked Accounts</h3>
          <p>{stats.linkedAccounts}</p>
        </div>
        <div className="card glass">
          <h3>Next Renewal</h3>
          <p>{stats.nextRenewal}</p>
        </div>
        <div className="card glass highlight">
          <h3>Total Monthly Cost</h3>
          <p>₹{stats.totalMonthlyCost}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
