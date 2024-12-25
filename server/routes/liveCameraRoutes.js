/**
 * Router for surfing video feeds.
 */

const express = require('express');
const router = express.Router();

/**
 * GET /feeds
 * Returns a list of surfing video feeds with location and URL.
 */
router.get('/feeds', (req, res) => {
  const feeds = [
    { location: 'Huntington Beach Pier', url: 'https://www.youtube.com/watch?v=mhQjsLBfOoY' },
    { location: 'Strand Beach', url: 'https://www.youtube.com/watch?v=k19xR19WKCk' },
    { location: 'Manhattan Beach', url: 'https://www.youtube.com/watch?v=CoUJnz0Ude0' },
    { location: 'Santa Monica', url: 'https://www.youtube.com/watch?v=qmE7U1YZPQA' },
    { location: 'Head Beach', url: 'https://www.youtube.com/watch?v=V3yWSeZBlaI' },
    { location: 'Jacksonville Beach', url: 'https://www.youtube.com/watch?v=Iu2_v4M8n6Q' },
  ];

  //** Filter out any feeds missing location or URL **//
  const validatedFeeds = feeds.filter(feed => feed.location && feed.url);

  if (validatedFeeds.length === 0) {
    return res.status(404).json({ message: 'No valid feeds available' });
  }

  res.status(200).json(validatedFeeds);
});

module.exports = router;
