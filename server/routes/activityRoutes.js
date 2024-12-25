/**
 * Router to handle user activity logging and retrieval.
 */

const express = require('express');
const { readData, writeData } = require('../utils/persist');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//** Path to the JSON file that stores activity data **// 
const ACTIVITY_FILE = path.join(__dirname, '../data/activity.json');

/**
 * POST /log
 * Logs a user activity.
 * Expects { username, action } in the request body.
 */
router.post('/log', async (req, res) => {
  const { username, action } = req.body;

  //** Validate request body **//
  if (!username || !action) {
    return res.status(400).json({ message: 'Invalid data. Username and action are required.' });
  }

  try {
    const activities = await readData(ACTIVITY_FILE);

    //** If no activity array exists for the user, create one **//
    if (!activities[username]) {
      activities[username] = [];
    }

    //** Push the new action with a timestamp **//
    activities[username].push({
      action,
      timestamp: new Date().toISOString(),
    });

    //** Persist updated activities **//
    await writeData(ACTIVITY_FILE, activities);
    res.status(200).json({ message: 'Activity logged successfully.' });
  } catch (error) {
    console.error('[ERROR] Logging activity failed:', error.message);
    res.status(500).json({ message: 'Server error while logging activity.' });
  }
});

/**
 * GET /
 * Retrieves the list of activities for the currently authenticated user.
 * Uses authMiddleware to ensure the user is authenticated.
 */
router.get('/', authMiddleware, async (req, res) => {
  const username = req.user?.username;

  //** Ensure user is logged in **//
  if (!username) {
    return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
  }

  try {
    const activities = await readData(ACTIVITY_FILE);
    res.status(200).json(activities[username] || []);
  } catch (error) {
    console.error('[ERROR] Fetching activities failed:', error.message);
    res.status(500).json({ message: 'Server error while fetching activities.' });
  }
});

/**
 * GET /export-activities
 * Exports all users' activities in JSON format.
 */
router.get('/export-activities', async (req, res) => {
  try {
    const activities = await readData(ACTIVITY_FILE);
    res.status(200).json(activities);
  } catch (error) {
    console.error('[ERROR] Failed to fetch activities:', error.message);
    res.status(500).json({ message: 'Failed to fetch activities from the file.' });
  }
});

module.exports = router;
