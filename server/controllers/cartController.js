const Cart = require('../models/cart');

// Add item to cart
exports.addItemToCart = (req, res) => {
  const { sku, quantity, size } = req.body;
  
  // Handle logged-in user cart or guest cart in cookies
  if (req.user) {
    // Handle logic for logged-in user (save cart in DB)
  } else {
    // Handle guest cart using cookies
    let cart = req.cookies.cart || [];
    cart.push({ sku, quantity, size });
    res.cookie('cart', cart, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ message: 'Item added to cart' });
  }
};

// Remove item from cart
exports.removeItemFromCart = (req, res) => {
  const { sku, size } = req.body;

  if (req.user) {
    // Handle removing from DB for logged-in users
  } else {
    // Handle guest cart removal using cookies
    let cart = req.cookies.cart || [];
    cart = cart.filter(item => !(item.sku === sku && item.size === size));
    res.cookie('cart', cart, { httpOnly: true });
    res.status(200).json({ message: 'Item removed from cart' });
  }
};

// Get current cart contents
exports.getCart = (req, res) => {
  if (req.user) {
    // Return cart from DB for logged-in users
  } else {
    const cart = req.cookies.cart || [];
    res.status(200).json(cart);
  }
};

// Handle checkout logic
exports.checkoutCart = (req, res) => {
  // Payment and order processing logic
  res.status(200).json({ message: 'Checkout completed' });
};
