// src/components/Subscriptions/AddSubscription.jsx
import { useState } from 'react';
import apiClient from '../../api/apiClient';

function AddSubscription({ onClose }) {
  const [form, setForm] = useState({
    name: '', price: '', renewalDate: '', isFreeTrial: false, trialEndDate: '', frequency: 'MONTHLY'
  });
  const userId = parseInt(localStorage.getItem('userId'), 10) || 1;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await apiClient.post(`/subscriptions/user/${userId}`, form);
      alert('Subscription added');
      setForm({ name: '', price: '', renewalDate: '', isFreeTrial: false, trialEndDate: '', frequency: 'MONTHLY' });
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert('Error adding subscription');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="premium-form">
      <div className="form-group">
        <label>Service Name</label>
        <input className="form-input" name="name" placeholder="e.g. Netflix, Spotify" value={form.name} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Price (₹)</label>
          <input className="form-input" name="price" type="number" placeholder="299" value={form.price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Billing Cycle</label>
          <select className="form-input" name="frequency" value={form.frequency} onChange={handleChange}>
            <option value="MONTHLY">Monthly</option>
            <option value="ANNUAL">Annual</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Next Renewal Date</label>
        <input className="form-input" name="renewalDate" type="date" value={form.renewalDate} onChange={handleChange} />
      </div>

      <div className="form-checkbox">
        <label className="toggle-switch">
          <input name="isFreeTrial" type="checkbox" checked={form.isFreeTrial} onChange={handleChange} />
          <span className="slider round"></span>
        </label>
        <span className="checkbox-label">This is a Free Trial</span>
      </div>

      {form.isFreeTrial && (
        <div className="form-group slide-down">
          <label>Trial Ends On</label>
          <input className="form-input" name="trialEndDate" type="date" value={form.trialEndDate} onChange={handleChange} />
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary">Add Subscription</button>
      </div>
    </form>
  );
}

export default AddSubscription;
