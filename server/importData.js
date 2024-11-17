const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SurfBoard = require('../models/surfBoard'); // Import your surfboard model

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit with failure if MongoDB connection fails
  }
};

// Function to read JSON file
const readJSONFile = (filePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Read data from ${filePath}`);
    return data;
  } catch (err) {
    console.error(`Error reading the JSON file at ${filePath}:`, err);
    process.exit(1); // Exit with failure if the JSON file cannot be read
  }
};

// Function to delete existing data and import new data to MongoDB
const importData = async (filePath) => {
  try {
    const surfboards = readJSONFile(filePath);

    // Delete all existing surfboards in the collection
    await SurfBoard.deleteMany();
    console.log('Existing data cleared');

    // Insert the new surfboard data from the JSON file
    await SurfBoard.insertMany(surfboards);
    console.log('New data imported successfully');
  } catch (err) {
    console.error('Error importing data:', err);
    process.exit(1); // Exit with failure code
  } finally {
    mongoose.connection.close(); // Close the MongoDB connection
  }
};

// Run the script to import data
const run = async () => {
  const filePath = process.argv[2] || './surfboards.json'; // Accept file path as an argument or default
  await connectDB(); // Ensure the DB connection is established before importing data
  await importData(filePath);
  process.exit(0); // Exit with success code
};

run();
