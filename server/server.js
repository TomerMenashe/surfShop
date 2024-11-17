const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // For parsing cookies
const surfboardRoutes = require('./routes/surfboardRoutes'); // Surfboard routes
const cartRoutes = require('./routes/cartRoutes'); // Cart routes
const userActivityRoutes = require('./routes/userActivityRoutes'); // User activity routes (Firebase)

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Enable cookie parsing

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if DB connection fails
  });

// CORS Middleware (if needed for frontend-backend communication)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Route Logging Middleware for Debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health Check Endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
app.use('/api/surfboards', surfboardRoutes); // Surfboard routes
app.use('/api/cart', cartRoutes); // Cart routes
app.use('/api/admin/activities', userActivityRoutes); // Adjusted to match the frontend expectation

// 404 Not Found Handler
app.use((req, res) => {
  console.error(`[404] Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`[500] Internal Server Error: ${err.stack}`);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
