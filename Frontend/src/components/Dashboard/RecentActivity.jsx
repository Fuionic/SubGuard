import React, { useState, useEffect } from 'react';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // In a real app, fetch from API
    // For now, using placeholder data
    setActivities([
      '✅ Netflix renewed for ₹649',
      '🔗 Linked Spotify account',
      '⚙️ Updated payment method',
      '🧾 Added new Disney+ subscription'
    ]);
  }, []);

  return (
    <div className="recent-activity">
      <h3>Recent Activities</h3>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
