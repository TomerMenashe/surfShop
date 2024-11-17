import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { getDocs, collection } from 'firebase/firestore';
import '../../styles/AuthPages.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Fetch all users from Firestore and find the one with the matching username
      const querySnapshot = await getDocs(collection(db, 'users'));
      const user = querySnapshot.docs.find(doc => doc.data().username === username);

      if (user) {
        // Log in using Firebase with the email from Firestore
        await signInWithEmailAndPassword(auth, user.data().email, password);

        // Set cookie expiration based on "Remember Me" checkbox
        const cookieExpirationDays = rememberMe ? 10 : 0.0208; // 10 days if remember me, otherwise ~30 minutes
        setCookie('username', user.data().username, cookieExpirationDays);

        navigate('/'); // Redirect to home page after successful login
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rememberMe">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
        </div>
        <button type="submit" className="auth-btn">Login</button>
        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;
