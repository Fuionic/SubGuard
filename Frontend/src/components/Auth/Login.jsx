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
      const res = await apiClient.post('/auth/login', form);
      if (res.data !== "Invalid credentials" && res.data !== "Password is required") {
        const userId = parseInt(res.data, 10);
        if (isNaN(userId)) {
          setMessage("Backend returned: " + res.data + " (Did you recompile Java?)");
          return;
        }
        const username = form.email.split('@')[0];
        localStorage.setItem('userId', userId); // store identifier
        localStorage.setItem('username', username); // store username
        navigate('/dashboard');
      } else {
        setMessage(res.data);
      }
    } catch (err) {
      setMessage('Error logging in');
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <div className="auth-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          </div>
          <div className="auth-input-group">
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit">Log in to Dashboard</button>
          {message && <p className="auth-message">{message}</p>}
        </form>
      </div>
      <p className="auth-footer">Don't have an account? <a href="/signup" className="auth-link">Sign up</a></p>
    </div>
  );
}

export default Login;
