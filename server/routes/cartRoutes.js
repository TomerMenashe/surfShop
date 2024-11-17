const express = require('express');
const router = express.Router();
const { addItemToCart, removeItemFromCart, getCart, checkoutCart } = require('../controllers/cartController');

// Add item to cart (uses cookies for guest, or DB for logged-in users)
router.post('/add', addItemToCart);

// Remove item from cart
router.post('/remove', removeItemFromCart);

// Get current cart
router.get('/', getCart);

// Checkout (this can process payments or finalize the order)
router.post('/checkout', checkoutCart);

module.exports = router;
