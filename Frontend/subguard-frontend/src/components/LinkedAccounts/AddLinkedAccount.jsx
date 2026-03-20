// src/components/LinkedAccounts/AddLinkedAccount.jsx
import { useState } from 'react';
import axios from 'axios';

function AddLinkedAccount({ onClose }) {
  const [form, setForm] = useState({ accountEmail: '', serviceName: '', lastUsedDate: '', notifyAfterMonths: '' });
  const userEmail = localStorage.getItem('userId');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/linkedaccounts/user/${userEmail}`, form);
      alert('Linked account added');
      setForm({ accountEmail: '', serviceName: '', lastUsedDate: '', notifyAfterMonths: '' });
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert('Error adding linked account');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="premium-form">
      <div className="form-group">
        <label>Service Name</label>
        <input className="form-input" name="serviceName" placeholder="e.g. Google, Spotify, AWS" value={form.serviceName} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Account Email</label>
        <input className="form-input" name="accountEmail" type="email" placeholder="user@example.com" value={form.accountEmail} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Last Used Date</label>
          <input className="form-input" name="lastUsedDate" type="date" value={form.lastUsedDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Notify After (Months)</label>
          <input className="form-input" name="notifyAfterMonths" type="number" placeholder="e.g. 6" value={form.notifyAfterMonths} onChange={handleChange} />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary">Add Linked Account</button>
      </div>
    </form>
  );
}

export default AddLinkedAccount;
