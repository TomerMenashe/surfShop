//** Login page allowing users to authenticate with username and password **//

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AuthPages.css';

//** Define and export the LoginPage component **//
const LoginPage = () => {
  //** State variables for user input **//
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  //** React Router hook to navigate between pages **//
  const navigate = useNavigate();

  //** Access login function from AuthContext **//
  const { login } = useAuth();

  //** Handle form submission to log in user **//
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password, rememberMe); 
      navigate('/');  //** Redirect to homepage on successful login **//
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  //** Render the login form **//
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
        </div>
        
        <button type="submit" className="auth-btn">Login</button>
        
        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register" className="register-link">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
