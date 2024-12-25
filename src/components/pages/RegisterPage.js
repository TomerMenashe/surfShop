//** Registration page allowing new users to create an account **//

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AuthPages.css';

const RegisterPage = () => {
  //** State variables for user input **//
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //** React Router hook to navigate between pages **//
  const navigate = useNavigate();

  //** Access register function from AuthContext **//
  const { register } = useAuth(); 

  //** Handle form submission to register user **//
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      //** Attempt to register using context-provided register function **//
      const message = await register(username, password);
      alert(message);
      navigate('/login'); //** Redirect to login page after successful registration **//
    } catch (err) {
      console.error('[ERROR] Registration failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  //** Render the registration form **//
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            required
          />
        </div>
        
        <button type="submit" className="auth-btn">Register</button>
        
        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="register-link">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
