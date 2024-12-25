//** Provides helper functions to read and write data from/to JSON files **//

const fs = require('fs').promises;
const path = require('path');

//** Read data from a JSON file. If the file does not exist, initializes it with an empty object **//
const readData = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    //** Return parsed JSON or an empty object if the file is empty **//
    return data.trim() ? JSON.parse(data) : {};
  } catch (error) {
    //** If file not found, create a new one with empty object **//
    if (error.code === 'ENOENT') {
      console.warn(`[WARN] File not found: ${filePath}. Initializing with empty object.`);
      await fs.writeFile(filePath, '{}');
      return {};
    }
    //** Log any other read errors **//
    console.error(`[ERROR] Reading file ${filePath}:`, error.message);
    throw error;
  }
};

//** Write data to a JSON file, replacing its contents **//
const writeData = async (filePath, data) => {
  try {
    //** Convert data to JSON string with pretty-print formatting **//
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    //** Log any write errors **//
    console.error(`[ERROR] Writing file ${filePath}:`, error.message);
    throw error;
  }
};

module.exports = {
  readData,
  writeData,
};
