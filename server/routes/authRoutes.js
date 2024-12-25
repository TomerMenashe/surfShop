/**
 * Router to handle user authentication and session management.
 */

const express = require('express');
const { readData, writeData } = require('../utils/persist');
const path = require('path');
const axios = require('axios');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const ACTIVITY_API_URL = `http://localhost:${process.env.PORT || 5002}/api/activity/log`;

module.exports = () => {
  const router = express.Router();

  //** Helper function to load user data from JSON file **//
  const loadUsers = async () => {
    try {
      return await readData(USERS_FILE);
    } catch (error) {
      console.error('[ERROR] Failed to load users:', error.message);
      return {};
    }
  };

  /**
   * POST /login
   * Authenticates the user and sets a session cookie.
   */
  router.post('/login', async (req, res) => {
    const { username, password, rememberMe } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
  
    try {
      const users = await loadUsers();
      const user = users[username];
  
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }
  
      //** Set cookie expiration based on rememberMe **// 
      const maxAge = rememberMe ? 10 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000; 
  
      // Set session cookie
      res.cookie('username', username, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge,
      });
  
      //** Log the login action **//
      await axios.post(ACTIVITY_API_URL, { username, action: 'Login' });
  
      res.status(200).json({ message: 'Login successful', user: { username, isAdmin: user.isAdmin } });
    } catch (error) {
      console.error('[ERROR] Login failed:', error.message);
      res.status(500).json({ message: 'Server error during login.' });
    }
  });
  
  /**
   * POST /logout
   * Clears the session cookie and logs the logout action.
   */
  router.post('/logout', async (req, res) => {
    const username = req.cookies?.username;

    if (!username) {
      return res.status(400).json({ message: 'No active session found to log out.' });
    }

    try {
      //** Clear the cookie **//
      res.clearCookie('username', { httpOnly: true, sameSite: 'Strict' });
      
      //** Log the logout action **//
      await axios.post(ACTIVITY_API_URL, { username, action: 'Logout' });
      
      res.status(200).json({ message: 'Logout successful.' });
    } catch (error) {
      console.error('[ERROR] Logout failed:', error.message);
      res.status(500).json({ message: 'Server error during logout.' });
    }
  });

  /**
   * GET /session
   * Retrieves the current user session information.
   */
  router.get('/session', async (req, res) => {
    const username = req.cookies?.username;

    if (!username) {
      return res.status(401).json({ message: 'No active session.' });
    }

    try {
      const users = await loadUsers();
      const user = users[username];

      if (!user) {
        return res.status(401).json({ message: 'Session invalid. User not found.' });
      }

      res.status(200).json({ user: { username, isAdmin: user.isAdmin } });
    } catch (error) {
      console.error('[ERROR] Session validation failed:', error.message);
      res.status(500).json({ message: 'Server error during session validation.' });
    }
  });

  /**
   * POST /register
   * Registers a new user with provided username and password.
   */
  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
  
    try {
      const users = await readData(USERS_FILE);
  
      //** Check if user already exists **//
      if (users[username]) {
        return res.status(409).json({ message: 'Username already exists.' });
      }
  
      //** Create new user **//
      users[username] = { password, isAdmin: false };
      await writeData(USERS_FILE, users);
      res.status(201).json({ message: 'Registration successful.' });
    } catch (error) {
      console.error('[ERROR] Registration failed:', error.message);
      res.status(500).json({ message: 'Server error during registration.' });
    }
  });

  return router;
};
