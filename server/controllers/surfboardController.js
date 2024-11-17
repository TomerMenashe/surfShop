const SurfBoard = require('../models/SurfBoard');

// Get all surfboards
const getAllSurfboards = async () => {
  try {
    return await SurfBoard.find();
  } catch (error) {
    console.error('Error fetching surfboards:', error);
    throw new Error('Error fetching surfboards');
  }
};

// Get a surfboard by SKU
const getSurfboardBySku = async (sku) => {
  try {
    const surfboard = await SurfBoard.findOne({ sku });
    if (!surfboard) {
      throw new Error('Surfboard not found');
    }
    return surfboard;
  } catch (error) {
    console.error(`Error fetching surfboard with SKU ${sku}:`, error);
    throw new Error('Error fetching surfboard');
  }
};

// Add a new surfboard
const addSurfboard = async (data) => {
    try {
      console.log('Received data for adding surfboard:', data); // Log incoming request data
  
      // Ensure dateAdded is set to current date if not provided
      const surfboardData = {
        ...data,
        dateAdded: data.dateAdded || new Date(),
      };
  
      console.log('Processed surfboard data to save:', surfboardData); // Log processed data
  
      const newSurfboard = new SurfBoard(surfboardData);
      const savedSurfboard = await newSurfboard.save();
      console.log('Surfboard saved successfully:', savedSurfboard); // Log success
      return savedSurfboard;
    } catch (error) {
      console.error('Error occurred while adding surfboard:');
      console.error('Error message:', error.message); // Log error message
      console.error('Error stack:', error.stack); // Log error stack for detailed trace
  
      if (error.code === 11000) {
        throw new Error('Surfboard with this SKU already exists'); // Duplicate SKU error
      }
      if (error.name === 'ValidationError') {
        throw new Error(`Validation error: ${error.message}`); // Validation error
      }
      throw new Error('Unexpected error while adding surfboard');
    }
  };
  

// Update an existing surfboard
const updateSurfboard = async (sku, updatedData) => {
  try {
    const updatedSurfboard = await SurfBoard.findOneAndUpdate(
      { sku },
      updatedData,
      { new: true, runValidators: true } // Ensure validation and return updated document
    );
    if (!updatedSurfboard) {
      throw new Error('Surfboard not found');
    }
    return updatedSurfboard;
  } catch (error) {
    console.error(`Error updating surfboard with SKU ${sku}:`, error);
    throw new Error('Error updating surfboard');
  }
};

// Delete a surfboard
const deleteSurfboard = async (sku) => {
  try {
    const deletedSurfboard = await SurfBoard.findOneAndDelete({ sku });
    if (!deletedSurfboard) {
      throw new Error('Surfboard not found');
    }
    return true;
  } catch (error) {
    console.error(`Error deleting surfboard with SKU ${sku}:`, error);
    throw new Error('Error deleting surfboard');
  }
};

module.exports = {
  getAllSurfboards,
  getSurfboardBySku,
  addSurfboard,
  updateSurfboard,
  deleteSurfboard,
};
