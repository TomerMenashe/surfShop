const express = require('express');
const firestore = require('../firebaseAdmin'); // Ensure Firebase Admin is properly initialized
const router = express.Router();

// Fetch user activity logs
router.get('/', async (req, res) => {
  try {
    const activityRef = firestore.collection('userActivity');
    const snapshot = await activityRef.get();
    const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(activities); // Send activities to the client
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ message: 'Failed to fetch user activities' });
  }
});

module.exports = router;
