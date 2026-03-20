// src/components/Subscriptions/SubscriptionList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function SubscriptionList({ limit }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const userEmail = localStorage.getItem('userId');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/subscriptions/user/${userEmail}`);
        setSubscriptions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <div className="preview-list">
      {subscriptions.length === 0 ? <p>No subscriptions yet</p> :
        <ul>
          {subscriptions.slice(0, limit || 5).map(sub => (
            <li key={sub.id}>
              {sub.name} — ₹{sub.price} — {sub.renewalDate === 'Monthly' ? 'Monthly' : sub.renewalDate}
            </li>
          ))}
          {subscriptions.length > (limit || 5) && <li>...</li>}
        </ul>
      }
    </div>
  );
}

export default SubscriptionList;
