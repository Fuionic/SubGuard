import { useState } from 'react';
import apiClient from '../../api/apiClient';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/auth/signup', form);
      if (res.data !== "Email already registered") {
        const userId = parseInt(res.data, 10);
        if (isNaN(userId)) {
          setMessage("Backend returned: " + res.data + " (Did you recompile Java?)");
          return;
        }
        const username = form.name;
        localStorage.setItem('userId', userId); // store identifier
        localStorage.setItem('username', username); // store username
        navigate('/dashboard');
      } else {
        setMessage(res.data);
      }
    } catch (err) {
      setMessage('Error signing up');
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <div className="auth-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="auth-input-group">
            <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          </div>
          <div className="auth-input-group">
            <input type="password" name="password" placeholder="Create Password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit">Sign Up Free</button>
          {message && <p className="auth-message">{message}</p>}
        </form>
      </div>
      <p className="auth-footer">Already have an account? <a href="/login" className="auth-link">Log in</a></p>
    </div>
  );
}

export default Signup;
