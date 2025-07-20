const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors'); // For colorful console output (optional)
const plants = require('./utils/samplePlantData');
const Plant = require('./models/Plant');
const connectDB = require('./config/db'); // Assuming your DB connection logic is here

// Load env vars
dotenv.config(); // Assuming .env is in backend directory

// Connect to DB
connectDB();

// Import data into DB
const importData = async () => {
  try {
    // Clear existing plants (optional, careful!)
    await Plant.deleteMany();
    console.log('Existing plants cleared (if any).'.yellow);

    // Insert sample plants
    await Plant.insertMany(plants);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Plant.deleteMany();
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Check command-line arguments
if (process.argv[2] === '-d') {
  // If argument is '-d', delete data
  deleteData();
} else {
  // Otherwise, import data
  importData();
} 