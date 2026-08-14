import { useState } from 'react';
import apiClient from '../../api/apiClient';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Simple password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length > 5) strength += 1;
    if (pass.length > 8) strength += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        username: form.email.split('@')[0],
        email: form.email,
        password: form.password,
        confirmPassword: form.password
      };
      
      const res = await apiClient.request({
        method: 'POST',
        url: '/auth/signup',
        data: payload
      });
      
      if (res.data && res.data.token) {
        const userId = parseInt(res.data.userId, 10);
        if (isNaN(userId)) {
          setMessage("Backend returned invalid userId.");
          return;
        }
        const username = form.name;
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      } else {
        setMessage(res.data.message || "Email already registered");
      }
    } catch (err) {
      setMessage('Error signing up. Please try again.');
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
          <h1>Take control of your subscriptions.</h1>
          <p>Join thousands of users who are saving money and protecting their digital privacy with SubGuard.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-wrapper">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Get started with a free account today.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>

            <div className="auth-input-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            
            <div className="auth-input-group">
              <label htmlFor="password">Create Password</label>
              <input id="password" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
              
              <div className="password-strength">
                <div className={`strength-bar ${strength >= 1 ? 'active-weak' : ''}`}></div>
                <div className={`strength-bar ${strength >= 2 ? 'active-medium' : ''}`}></div>
                <div className={`strength-bar ${strength >= 3 ? 'active-strong' : ''}`}></div>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">Sign Up Free</button>
            {message && <div className="auth-message">{message}</div>}
          </form>

          <div className="auth-footer">
            Already have an account? <a href="/login" className="auth-link">Log in</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
