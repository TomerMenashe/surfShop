/**
 * Router for retrieving weather information via SerpAPI.
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

//** SerpAPI key for authentication **//
const SERPAPI_KEY = '1f60ac8501ebbd859aa349b1105d93eaf7a14e3fa08d7140599b3b3cbdaffc7a';

//** POST / (main endpoint to get weather based on location) **//
router.post('/', async (req, res) => {
  //** Extract location from request body **//
  const { location } = req.body;

  //** Validate request body **//
  if (!location) {
    console.error('[ERROR] Location is required in request body');
    return res.status(400).json({ message: 'Location is required' });
  }

  try {
    //** Call SerpAPI with location + "weather" query **//
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google',
        q: `${location} weather`,
        api_key: SERPAPI_KEY,
      },
    });

    //** Extract weather data from SerpAPI response **//
    const weatherData = response.data.answer_box;

    //** Check if the data returned is indeed weather data **//
    if (!weatherData || weatherData.type !== 'weather_result') {
      return res.status(404).json({ message: 'Weather data not found' });
    }

    //** Structure the data to return **//
    res.status(200).json({
      current: {
        location: weatherData.location,
        temperature: `${weatherData.temperature} ${weatherData.unit}`,
        description: weatherData.weather,
        thumbnail: weatherData.thumbnail,
        precipitation: weatherData.precipitation,
        humidity: weatherData.humidity,
        wind: weatherData.wind,
      },
      forecast: weatherData.forecast.map((day) => ({
        day: day.day,
        high: day.temperature.high,
        low: day.temperature.low,
        description: day.weather,
        thumbnail: day.thumbnail,
        humidity: day.humidity,
        precipitation: day.precipitation,
        wind: day.wind,
      })),
    });
  } catch (error) {
    //** Handle errors from SerpAPI or network issues **//
    console.error('[ERROR] Fetching weather from SerpAPI failed:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

module.exports = router;
