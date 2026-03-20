// src/components/LinkedAccounts/LinkedAccountsList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function LinkedAccountsList({ limit }) {
  const [accounts, setAccounts] = useState([]);  
  const userEmail = localStorage.getItem('userId');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/linkedaccounts/user/${userEmail}`);
        setAccounts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <div className="preview-list">
      {accounts.length === 0 ? <p>No linked accounts yet</p> :
        <ul>
          {accounts.slice(0, limit || 5).map(acc => (
            <li key={acc.id}>
              {acc.serviceName} — {acc.accountEmail} — {acc.lastUsedDate}
            </li>
          ))}
          {accounts.length > (limit || 5) && <li>...</li>}
        </ul>
      }
    </div>
  );
}

export default LinkedAccountsList;
