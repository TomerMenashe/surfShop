/**
 * Router for retrieving a user's approximate location based on IP.
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * GET /
 * Fetches the user's approximate location (latitude, longitude, and general city/region/country info)
 * using the IP-API service.
 */
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://ip-api.com/json');
    const { lat, lon, city, regionName, country, status, message } = response.data;

    //** Check if the API call was successful **//
    if (status !== 'success') {
      console.error(`[ERROR] IP-API returned an error: ${message || 'Unknown error'}`);
      return res.status(500).json({ message: 'Failed to retrieve location' });
    }

    //** Return location data **//
    res.status(200).json({
      latitude: lat,
      longitude: lon,
      description: `${city}, ${regionName}, ${country}`,
    });
  } catch (error) {
    console.error('[ERROR] Fetching location from IP-API failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve location',
      error: error.message,
    });
  }
});

module.exports = router;
