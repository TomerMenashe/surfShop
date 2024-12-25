/**
 * Router for managing surfboards.
 */

const express = require('express');
const fs = require('fs').promises;
const { readData, writeData } = require('../utils/persist');
const path = require('path');

const router = express.Router();
const SURFBOARDS_FILE = '/Users/tomi/Desktop/programing projects/surfShop/server/data/surfboards.json';

/**
 * GET /search
 * Searches surfboards by brand, model, or description using the query parameter "q".
 */
router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({ message: 'Query parameter "q" is required.' });
  }

  const prefix = q.trim().toLowerCase();

  try {
    //** Read surfboards from file **//
    const data = await fs.readFile(SURFBOARDS_FILE, 'utf8');
    const surfboards = JSON.parse(data);

    //** Filter results by matching brand, model, or description **//
    const results = surfboards.filter((surfboard) => {
      const brandMatch = surfboard.brand.toLowerCase().startsWith(prefix);
      const modelMatch = surfboard.model.toLowerCase().startsWith(prefix);
      const descriptionMatch = surfboard.description.toLowerCase().includes(prefix);
      return brandMatch || modelMatch || descriptionMatch;
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('[ERROR] Searching surfboards:', error.message);
    res.status(500).json({ message: 'Failed to search surfboards.' });
  }
});

/**
 * GET /
 * Returns the entire list of surfboards.
 */
router.get('/', async (req, res) => {
  try {
    //** Read all surfboards **//
    const data = await fs.readFile(SURFBOARDS_FILE, 'utf8');
    const surfboards = JSON.parse(data);
    res.status(200).json(surfboards);
  } catch (error) {
    console.error('[ERROR] Loading surfboards:', error.message);
    res.status(500).json({ message: 'Failed to load surfboards.' });
  }
});

/**
 * GET /:sku
 * Retrieves a specific surfboard by its SKU.
 */
router.get('/:sku', async (req, res) => {
  const { sku } = req.params;

  try {
    //** Read all surfboards and find the one with matching SKU **//
    const data = await fs.readFile(SURFBOARDS_FILE, 'utf8');
    const surfboards = JSON.parse(data);
    const surfboard = surfboards.find((board) => board.sku === sku);

    if (!surfboard) {
      return res.status(404).json({ message: 'Surfboard not found.' });
    }

    res.status(200).json(surfboard);
  } catch (error) {
    console.error('[ERROR] Loading surfboard details:', error.message);
    res.status(500).json({ message: 'Failed to load surfboard details.' });
  }
});

/**
 * POST /
 * Creates a new surfboard. Expects body: { brand, model, price, image, sku, sizes, description }.
 */
router.post('/', async (req, res) => {
  const { brand, model, price, image, sku, sizes, description } = req.body;

  //** Validate required fields **//
  if (!brand || !model || !price || !image || !sku || !sizes || !description) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    //** Load existing surfboards **//
    const surfboards = await readData(SURFBOARDS_FILE);

    //** Check for duplicate SKU **//
    const existingBoard = surfboards.find((board) => board.sku === sku);
    if (existingBoard) {
      return res.status(400).json({ message: 'Surfboard with this SKU already exists.' });
    }

    //** Create and save the new surfboard **//
    const newSurfboard = {
      id: surfboards.length ? surfboards[surfboards.length - 1].id + 1 : 1,
      brand,
      model,
      price: parseFloat(price),
      image,
      sku,
      sizes: sizes.split(',').map((size) => size.trim()),
      description,
      dateAdded: new Date().toISOString(),
    };

    surfboards.push(newSurfboard);
    await writeData(SURFBOARDS_FILE, surfboards);
    res.status(201).json(newSurfboard);
  } catch (error) {
    console.error('[ERROR] Failed to add surfboard:', error.message);
    res.status(500).json({ message: 'Server error while adding surfboard.' });
  }
});

/**
 * DELETE /:sku
 * Deletes a surfboard by its SKU.
 */
router.delete('/:sku', async (req, res) => {
  const { sku } = req.params;

  try {
    //** Read all surfboards and filter out the one to delete **//
    const surfboards = await readData(SURFBOARDS_FILE);
    const updatedSurfboards = surfboards.filter((board) => board.sku !== sku);

    //** If length didn't change, surfboard wasn't found **//
    if (updatedSurfboards.length === surfboards.length) {
      return res.status(404).json({ message: 'Surfboard not found.' });
    }

    //** Save updated list **//
    await writeData(SURFBOARDS_FILE, updatedSurfboards);
    res.status(200).json({ message: 'Surfboard deleted successfully.' });
  } catch (error) {
    console.error('[ERROR] Failed to delete surfboard:', error.message);
    res.status(500).json({ message: 'Failed to delete surfboard.' });
  }
});

module.exports = router;
