//** Router for managing surfboard reviews **//

const express = require('express');
const { readData, writeData } = require('../utils/persist');
const path = require('path');

const router = express.Router();

//** Path to the JSON file that holds review data **//
const REVIEWS_FILE_PATH = path.join(__dirname, '../data/reviews.json');

//** Helper function to load all reviews from the JSON file **//
const loadReviews = async () => {
  try {
    const reviews = await readData(REVIEWS_FILE_PATH);
    return reviews;
  } catch (error) {
    console.error('[ERROR] Loading reviews failed:', error.message);
    return [];
  }
};

/**
 * GET /:sku
 * Retrieves all reviews for a specific surfboard based on its SKU.
 */
router.get('/:sku', async (req, res) => {
  const { sku } = req.params;

  try {
    //** Load the entire list of reviews **//
    const reviews = await loadReviews();

    //** Filter reviews that match the given SKU **//
    const surfboardReviews = reviews.filter((review) => review.sku === sku);

    res.status(200).json(surfboardReviews);
  } catch (error) {
    console.error('[ERROR] Fetching reviews failed:', error.message);
    res.status(500).json({ message: 'Failed to fetch reviews.' });
  }
});

/**
 * POST /add
 * Adds a new review for a surfboard.
 * Expects { sku, username, rating, comment } in the request body.
 */
router.post('/add', async (req, res) => {
  const { sku, username, rating, comment } = req.body;

  //** Validate required fields **//
  if (!sku || !username || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    //** Load existing reviews **//
    const reviews = await loadReviews();

    //** Construct a new review object **//
    const newReview = {
      id: Date.now(),
      sku,
      username,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    //** Add the new review to the list **//
    reviews.push(newReview);

    //** Persist the updated list back to the file **//
    await writeData(REVIEWS_FILE_PATH, reviews);

    res.status(201).json({ message: 'Review added successfully.', review: newReview });
  } catch (error) {
    console.error('[ERROR] Adding review failed:', error.message);
    res.status(500).json({ message: 'Failed to add review.' });
  }
});

module.exports = router;
