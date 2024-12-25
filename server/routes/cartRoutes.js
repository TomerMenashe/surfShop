/**
 * Router to handle cart functionality.
 */

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios');

/**
 * Endpoint for logging user actions. 
 * This will be called to record cart activities like add, remove, or update.
 */
const ACTIVITY_API_URL = `http://localhost:${process.env.PORT || 5002}/api/activity/log`;

module.exports = (carts, saveData, surfboards) => {
  const router = express.Router();

  /**
   * Helper function to enrich cart data by merging items in the cart with 
   * detailed surfboard information (brand, model, description, etc.).
   * @param {string} username - The user's unique identifier.
   * @returns {Array} - Enriched cart items including surfboard details.
   */
  const enrichCart = (username) => {
    const userCart = carts[username] || [];
    const surfboardMap = {};

    //** Create a quick lookup map for surfboards by SKU **//
    surfboards.forEach((board) => {
      surfboardMap[board.sku] = board;
    });

    //** Map each cart item to its corresponding surfboard details **//
    return userCart.map((cartItem) => {
      const surfboard = surfboardMap[cartItem.sku];

      if (surfboard) {
        //** Ensure the size requested is valid; default to the first size if invalid **//
        const isValidSize = surfboard.sizes.includes(cartItem.size);
        const size = isValidSize ? cartItem.size : surfboard.sizes[0];

        return {
          sku: surfboard.sku,
          brand: surfboard.brand,
          model: surfboard.model,
          length: surfboard.length,
          price: surfboard.price,
          image: surfboard.image,
          description: surfboard.description,
          dateAdded: surfboard.dateAdded,
          sizes: surfboard.sizes,
          quantity: cartItem.quantity,
          size,
        };
      } else {
        //** If surfboard data is not found, return a placeholder **//
        return {
          sku: cartItem.sku,
          model: 'Unknown Surfboard',
          price: 0,
          quantity: cartItem.quantity,
          image: 'https://via.placeholder.com/150',
          description: 'No description available.',
          dateAdded: '',
          sizes: [],
          size: cartItem.size || 'N/A',
        };
      }
    });
  };

  /**
   * GET / - Retrieves the enriched cart for the authenticated user.
   */
  router.get('/', authMiddleware, (req, res) => {
    const { username } = req.user;
    const enrichedCart = enrichCart(username);
    return res.status(200).json(enrichedCart);
  });

  /**
   * POST /add - Adds an item to the authenticated user's cart.
   * Expects { sku, size, quantity } in the request body.
   */
  router.post('/add', authMiddleware, async (req, res) => {
    const { username } = req.user;
    const { sku, size, quantity } = req.body;

    if (!sku || !size || !quantity) {
      return res.status(400).json({ message: 'SKU, size, and quantity are required.' });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive number.' });
    }

    try {
      //** Validate surfboard SKU and size **//
      const surfboard = surfboards.find((board) => board.sku === sku);
      if (!surfboard) {
        return res.status(400).json({ message: 'Surfboard not found.' });
      }

      if (!surfboard.sizes.includes(size)) {
        return res.status(400).json({ message: 'Invalid size selected for this surfboard.' });
      }

      //** Initialize user's cart if it doesn't exist **//
      if (!carts[username]) {
        carts[username] = [];
      }

      //** Find existing item in the cart with matching SKU and size **//
      const existingItem = carts[username].find(
        (item) => item.sku === sku && item.size === size
      );

      //** Update quantity if item exists, otherwise add as new **//
      if (existingItem) {
        existingItem.quantity += parsedQuantity;
      } else {
        carts[username].push({ sku, size, quantity: parsedQuantity });
      }

      //** Persist the updated cart **//
      await saveData('carts', carts);

      //** Log the add-to-cart action **//
      await axios.post(ACTIVITY_API_URL, {
        username,
        action: `Added to cart: ${sku}, Size: ${size}, Quantity: ${quantity}`,
      });

      const enrichedCart = enrichCart(username);
      return res.status(200).json(enrichedCart);
    } catch (error) {
      console.error('[ERROR] Adding item to cart:', error.message);
      return res.status(500).json({ message: 'Failed to add item to cart.' });
    }
  });

  /**
   * POST /remove - Removes a specific item from the authenticated user's cart.
   * Expects { sku, size } in the request body.
   */
  router.post('/remove', authMiddleware, async (req, res) => {
    const { username } = req.user;
    const { sku, size } = req.body;

    if (!sku || !size) {
      return res.status(400).json({ message: 'SKU and size are required.' });
    }

    try {
      //** Check if the user's cart exists **//
      if (!carts[username]) {
        return res.status(400).json({ message: 'Cart is empty.' });
      }

      //** Find the index of the item in the cart **//
      const itemIndex = carts[username].findIndex(
        (item) => item.sku === sku && item.size === size
      );

      if (itemIndex === -1) {
        return res.status(400).json({ message: 'Item not found in cart.' });
      }

      //** Remove the item from the cart **//
      carts[username].splice(itemIndex, 1);

      //** Persist the updated cart **//
      await saveData('carts', carts);

      const enrichedCart = enrichCart(username);
      return res.status(200).json(enrichedCart);
    } catch (error) {
      console.error('[ERROR] Removing item from cart:', error.message);
      return res.status(500).json({ message: 'Failed to remove item from cart.' });
    }
  });

  /**
   * POST /update - Updates the quantity of a specific item in the user's cart.
   * Expects { sku, size, quantity } in the request body.
   * Setting quantity to 0 removes the item entirely.
   */
  router.post('/update', authMiddleware, async (req, res) => {
    const { username } = req.user;
    const { sku, size, quantity } = req.body;

    if (!sku || !size || quantity === undefined) {
      return res.status(400).json({ message: 'SKU, size, and quantity are required.' });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({ message: 'Quantity must be a non-negative number.' });
    }

    try {
      if (!carts[username]) {
        return res.status(400).json({ message: 'Cart is empty.' });
      }

      const existingItem = carts[username].find(
        (item) => item.sku === sku && item.size === size
      );

      if (!existingItem) {
        return res.status(400).json({ message: 'Item not found in cart.' });
      }

      //** If quantity is 0, remove the item **//
      if (parsedQuantity === 0) {
        const itemIndex = carts[username].findIndex(
          (item) => item.sku === sku && item.size === size
        );
        carts[username].splice(itemIndex, 1);
      } else {
        existingItem.quantity = parsedQuantity;
      }

      //** Persist the updated cart **//
      await saveData('carts', carts);

      const enrichedCart = enrichCart(username);
      return res.status(200).json(enrichedCart);
    } catch (error) {
      console.error('[ERROR] Updating cart item:', error.message);
      return res.status(500).json({ message: 'Failed to update cart item.' });
    }
  });

  /**
   * POST /remove-multiple - Removes multiple items at once from the user's cart.
   * Expects { items: [{ sku, size }, ...] } in the request body.
   */
  router.post('/remove-multiple', authMiddleware, async (req, res) => {
    const { username } = req.user;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required.' });
    }

    try {
      if (!carts[username]) {
        return res.status(400).json({ message: 'Cart is empty.' });
      }

      //** Remove each specified item from the cart **//
      items.forEach(({ sku, size }) => {
        const itemIndex = carts[username].findIndex(
          (item) => item.sku === sku && item.size === size
        );
        if (itemIndex !== -1) {
          carts[username].splice(itemIndex, 1);
        }
      });

      //** Persist the updated cart **//
      await saveData('carts', carts);

      const enrichedCart = enrichCart(username);
      return res.status(200).json(enrichedCart);
    } catch (error) {
      console.error('[ERROR] Removing multiple items from cart:', error.message);
      return res.status(500).json({ message: 'Failed to remove items from cart.' });
    }
  });

  return router;
};
