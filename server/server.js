//** Main server file that initializes and configures the Express application **//

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { readData, writeData } = require('./utils/persist');
const fs = require('fs').promises;

//** Load environment variables from .env file **//
dotenv.config();

//** Create Express app instance **//
const app = express();
app.set('trust proxy', 1);


//** Define the port the server will run on **//
const PORT = process.env.PORT || 5002;

//** Define paths to data directory and files **//
const DATA_DIR = path.join(__dirname, 'data');
const FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  carts: path.join(DATA_DIR, 'carts.json'),
  purchases: path.join(DATA_DIR, 'purchases.json'),
  activity: path.join(DATA_DIR, 'activity.json'),
  surfboards: path.join(DATA_DIR, 'surfboards.json'),
};

//** Parse JSON request bodies **//
app.use(express.json());

//** Parse cookies **//
app.use(cookieParser());

//** Apply rate limiting middleware (max 100 requests per 15 minutes from one IP) **//
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

//** Ensure the data directory exists, or create it if it doesn't **//
(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('[ERROR] Creating data directory:', error.message);
    process.exit(1);
  }
})();

//** In-memory data caches **//
let users = {};
let carts = {};
let activity = {};
let surfboards = {};

//** Load data from JSON files into memory **//
const loadData = async () => {
  try {
    users = await readData(FILES.users);
    carts = await readData(FILES.carts);
    purchases = await readData(FILES.purchases);
    activity = await readData(FILES.activity);
    surfboards = await readData(FILES.surfboards);
  } catch (error) {
    console.error('[ERROR] Loading data:', error.message);
    //** Fall back to empty objects if loading fails **//
    users = carts = purchases = activity = surfboards = {};
  }
};

//** Helper function to save updated data to the appropriate JSON file **//
const saveData = async (type, data) => {
  const filePath = FILES[type];
  if (!filePath) {
    console.error(`[ERROR] Invalid type '${type}' provided to saveData.`);
    return;
  }
  try {
    await writeData(filePath, data);
  } catch (error) {
    console.error(`[ERROR] Saving ${type} data:`, error.message);
  }
};

//** Initialize the server: load data, then set up routes and start listening **//
(async () => {
  await loadData();

  //** Set up routes for different modules **//
  app.use('/api/auth', require('./routes/authRoutes')(users, activity, saveData));
  app.use('/api/cart', require('./routes/cartRoutes')(carts, saveData, surfboards));
  app.use('/api/purchases', require('./routes/purchaseRoutes'));
  app.use('/api/activity', require('./routes/activityRoutes'));
  app.use('/api/surfboards', require('./routes/surfboardRoutes'));
  app.use('/api/reviews', require('./routes/reviewRoutes'));
  app.use('/api/weather', require('./routes/weatherRoutes'));
  app.use('/api/cameras', require('./routes/liveCameraRoutes'));
  app.use('/api/location', require('./routes/locationRoutes'));
  app.use('/api/ai', require('./routes/aiRoutes'));

  //** Root endpoint to show that the API is running **//
  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  //** Handle 404 errors (route not found) **//
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  //** Global error handler **//
  app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`);
    res.status(500).json({ message: 'Server Error' });
  });

  //** Start the server **//
  app.listen(PORT, () => {
    console.log(`[INFO] Server running on port ${PORT}`);
  });
})();
