const express = require('express');
const router = express.Router();
const {
  getAllSurfboards,
  addSurfboard,
  updateSurfboard,
  deleteSurfboard,
  getSurfboardBySku,
} = require('../controllers/surfboardController');

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  console.log('Request body:', req.body);
  next();
});

// Validation middleware for surfboard data
const validateSurfboardData = (req, res, next) => {
  const { brand, model, length, price, image, description, sku } = req.body;
  if (!brand || !model || !length || !price || !image || !description || !sku) {
    return res.status(400).json({
      message: 'Missing required fields. Ensure all fields are filled: brand, model, length, price, image, description, sku.',
    });
  }
  next();
};

// Get all surfboards
router.get('/', async (req, res) => {
  try {
    const surfboards = await getAllSurfboards();
    res.status(200).json(surfboards);
  } catch (error) {
    console.error('Error fetching surfboards:', error);
    res.status(500).json({ message: 'Error fetching surfboards' });
  }
});

// Get a specific surfboard by SKU
router.get('/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    const surfboard = await getSurfboardBySku(sku);
    if (!surfboard) {
      return res.status(404).json({ message: 'Surfboard not found' });
    }
    res.status(200).json(surfboard);
  } catch (error) {
    console.error('Error fetching surfboard:', error);
    res.status(500).json({ message: 'Error fetching surfboard' });
  }
});

// Add a new surfboard
router.post('/', validateSurfboardData, async (req, res) => {
  try {
    const newSurfboard = { ...req.body, dateAdded: req.body.dateAdded || new Date() }; // Add dateAdded if missing
    console.log('Adding new surfboard:', newSurfboard); // Log data to be added
    const addedSurfboard = await addSurfboard(newSurfboard);
    res.status(201).json(addedSurfboard);
  } catch (error) {
    console.error('Error adding surfboard:', error.message);
    res.status(500).json({ message: error.message || 'Error adding surfboard' });
  }
});

// Update an existing surfboard
router.put('/:sku', validateSurfboardData, async (req, res) => {
  try {
    const { sku } = req.params;
    const updatedData = req.body;
    console.log(`Updating surfboard with SKU ${sku}:`, updatedData); // Log update data
    const updatedSurfboard = await updateSurfboard(sku, updatedData);
    if (!updatedSurfboard) {
      return res.status(404).json({ message: 'Surfboard not found' });
    }
    res.status(200).json(updatedSurfboard);
  } catch (error) {
    console.error('Error updating surfboard:', error);
    res.status(500).json({ message: error.message || 'Error updating surfboard' });
  }
});

// Delete a surfboard by SKU
router.delete('/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    console.log(`Deleting surfboard with SKU: ${sku}`); // Log deletion attempt
    const deleted = await deleteSurfboard(sku);
    if (!deleted) {
      return res.status(404).json({ message: 'Surfboard not found' });
    }
    res.status(200).json({ message: 'Surfboard deleted successfully' });
  } catch (error) {
    console.error('Error deleting surfboard:', error);
    res.status(500).json({ message: error.message || 'Error deleting surfboard' });
  }
});

module.exports = router;
