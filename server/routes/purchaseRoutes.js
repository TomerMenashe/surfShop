/**
 * Router for managing purchase history.
 */

const express = require('express');
const { readData, writeData } = require('../utils/persist');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /add
 * Adds a new purchase record for the authenticated user.
 * Expects { purchases: Array } in the request body.
 */
router.post('/add', authMiddleware, async (req, res) => {
  const { purchases } = req.body; 
  const username = req.user?.username; 

  //** Validate request body **//
  if (!purchases || !Array.isArray(purchases) || purchases.length === 0) {
    return res.status(400).json({ message: 'No valid purchase items provided.' });
  }

  try {
    //** Read existing purchases from file **//
    const allPurchases = await readData('./data/Purchases.json');

    //** Initialize array for this user if none exists **// 
    if (!allPurchases[username]) {
      allPurchases[username] = [];
    }

    //** Create a new purchase record with current timestamp **//
    const newPurchase = {
      date: new Date().toISOString(),
      items: purchases,
    };

    //** Append new purchase record to user's purchase history **//
    allPurchases[username].push(newPurchase);

    //** Persist updated purchase data **//
    await writeData('./data/Purchases.json', allPurchases);

    res.status(200).json({ message: 'Purchase history saved successfully.' });
  } catch (error) {
    console.error('[ERROR] Failed to save purchase history:', error.message);
    res.status(500).json({ message: 'Server error while saving purchase history.' });
  }
});

module.exports = router;
