import { useState } from 'react';
import apiClient from '../../api/apiClient';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/auth/login', { username: form.email, password: form.password });
      if (res.data && res.data.token) {
        const userId = parseInt(res.data.userId, 10);
        if (isNaN(userId)) {
          setMessage("Backend returned invalid userId.");
          return;
        }
        const username = form.email.split('@')[0];
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      } else {
        setMessage(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setMessage('Error logging in. Please check your credentials.');
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Branding Panel */}
      <div className="auth-branding-panel">
        <div className="brand-orb brand-orb-1"></div>
        <div className="brand-orb brand-orb-2"></div>
        <div className="branding-content">
          <div className="branding-logo">
            <div className="branding-logo-icon"></div>
            SubGuard.
          </div>
          <h1>Welcome back to your digital command center.</h1>
          <p>Log in to access your subscriptions, privacy vault, and smart alerts in one secure dashboard.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-wrapper">
          <div className="auth-header">
            <h2>Sign In</h2>
            <p>Enter your details to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            
            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="auth-submit-btn">Log in to Dashboard</button>
            {message && <div className="auth-message">{message}</div>}
          </form>

          <div className="auth-footer">
            Don't have an account? <a href="/signup" className="auth-link">Sign up free</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
