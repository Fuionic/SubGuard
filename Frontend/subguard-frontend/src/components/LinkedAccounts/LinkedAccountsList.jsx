// src/components/LinkedAccounts/LinkedAccountsList.jsx
import { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';

function LinkedAccountsList({ limit }) {
  const [accounts, setAccounts] = useState([]);
  const userId = parseInt(localStorage.getItem('userId'), 10) || 1;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await apiClient.get(`/accounts/user/${userId}`);
        setAccounts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccounts();
  }, [userId]);

  return (
    <div className="preview-list">
      {accounts.length === 0 ? <p>No linked accounts yet</p> :
        <ul>
          {accounts.slice(0, limit || 999).map(acc => (
            <li key={acc.id}>
              <strong>{acc.serviceName}</strong> — {acc.accountEmail} — Last used: {acc.lastUsedDate}
            </li>
          ))}
        </ul>
      }
    </div>
  );
}

export default LinkedAccountsList;
