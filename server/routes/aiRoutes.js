/**
 * Router to handle surfing recommendation endpoints.
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * POST /recommend-surf-spot
 * Generates a surfing spot recommendation based on user's experience and location.
 */
router.post('/recommend-surf-spot', async (req, res) => {
  const { experience, location } = req.body;

  if (!experience || !location) {
    console.error('[ERROR] Missing experience or location in the request body.');
    return res.status(400).json({ message: 'Experience and location are required' });
  }

  try {
    const apiKey = 'you api key';

    const messages = [
      {
        role: 'system',
        content: 'You are a surfing expert who provides tailored recommendations for surfing spots.',
      },
      {
        role: 'user',
        content: `I have ${experience} years of surfing experience and I am located in ${location}. Suggest the best place to start surfing, considering my skill level and location. Provide details about the surfing spot and why it's a good choice.`,
      },
    ];

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    res.status(200).json({ recommendation: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error('[ERROR] Surfing recommendation failed:', error.message);

    if (error.response) {
      console.error('[ERROR] OpenAI API error details:', error.response.data);
    }

    res.status(500).json({ message: 'Failed to generate surfing recommendation' });
  }
});

module.exports = router;
