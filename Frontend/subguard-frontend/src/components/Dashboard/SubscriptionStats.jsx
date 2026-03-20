import React, { useState, useEffect } from 'react';

const SubscriptionStats = () => {
  const [stats, setStats] = useState({
    mostExpensive: { name: 'Netflix', cost: 649 },
    cheapest: { name: 'Spotify', cost: 119 },
    expiringSoon: { name: 'Disney+', days: 5 }
  });

  useEffect(() => {
    // In a real app, fetch from API
    // For now, using placeholder data
    setStats({
      mostExpensive: { name: 'Netflix', cost: 649 },
      cheapest: { name: 'Spotify', cost: 119 },
      expiringSoon: { name: 'Disney+', days: 5 }
    });
  }, []);

  return (
    <div className="subscription-stats">
      <h3>Subscription Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <h4>Most Expensive</h4>
          <p>{stats.mostExpensive.name} - ₹{stats.mostExpensive.cost}</p>
        </div>
        <div className="stat-item">
          <h4>Cheapest</h4>
          <p>{stats.cheapest.name} - ₹{stats.cheapest.cost}</p>
        </div>
        <div className="stat-item">
          <h4>Expiring Soon</h4>
          <p>{stats.expiringSoon.name} - {stats.expiringSoon.days} days</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStats;
