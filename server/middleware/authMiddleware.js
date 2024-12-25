/**
 * Middleware to handle user authentication and session verification.
 */

const { readData } = require('../utils/persist');
const path = require('path');

const USERS_FILE = path.resolve(__dirname, '../data/users.json');

const authMiddleware = async (req, res, next) => {
  try {
    const username = req.cookies?.username;

    //** If no username found in cookies, user is not authenticated **//
    if (!username) {
      return res.status(401).json({ message: 'Unauthorized: No active session.' });
    }


    //** Load user data from the JSON file **// 
    const users = await readData(USERS_FILE);

    //** Confirm user exists in the data **// 
    const user = users[username];
    if (!user) {
      console.error('[ERROR] User not found:', username);
      return res.status(401).json({ message: 'Unauthorized: User not found.' });
    }

    //** Attach user data to the request for downstream usage **//
    req.user = { username, isAdmin: user.isAdmin };

    next();
  } catch (error) {
    console.error('[ERROR] Authentication failed:', error.message);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

module.exports = authMiddleware;
