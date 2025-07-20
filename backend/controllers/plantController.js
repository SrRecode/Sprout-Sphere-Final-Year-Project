const asyncHandler = require('express-async-handler');
const Plant = require('../models/Plant');
const { getPlantImage } = require('../services/imageService'); // Import the image service

// @desc    Get all plants
// @route   GET /api/plants
// @access  Public
const getPlants = asyncHandler(async (req, res) => {
  // Basic fetch - can add filtering, sorting, pagination later
  const plantsFromDb = await Plant.find({}); 

  // Enrich plants with images from Perenual
  const enrichedPlants = await Promise.all(
    plantsFromDb.map(async (plant) => {
      let imageUrl = plant.image; // Start with image from DB (might be default or old)
      try {
        // Fetch image using the service (which now uses Perenual)
        imageUrl = await getPlantImage(plant.name);
      } catch (error) {
        // Log error but don't break the loop, keep the DB image url
        console.error(`Failed to fetch image for ${plant.name}:`, error.message);
      }
      // Return a new object combining DB data and the fetched image URL
      // Use ._doc to get plain JS object from Mongoose doc to avoid issues modifying it
      return { 
          ...plant._doc, // Spread the original plant data
          image: imageUrl // Override the image property
      }; 
    })
  );

  res.status(200).json({ success: true, count: enrichedPlants.length, data: enrichedPlants });
});

// @desc    Get single plant
// @route   GET /api/plants/:id
// @access  Public
const getPlant = asyncHandler(async (req, res) => {
  const plantFromDb = await Plant.findById(req.params.id);

  if (!plantFromDb) {
    res.status(404);
    throw new Error(`Plant not found with id of ${req.params.id}`);
  }

  // Enrich the single plant with an image
  let imageUrl = plantFromDb.image;
  try {
      imageUrl = await getPlantImage(plantFromDb.name);
  } catch (error) {
      console.error(`Failed to fetch image for single plant ${plantFromDb.name}:`, error.message);
  }
  
  const enrichedPlant = { ...plantFromDb._doc, image: imageUrl };

  res.status(200).json({ success: true, data: enrichedPlant });
});

// @desc    Create new plant
// @route   POST /api/plants
// @access  Private/Admin
const createPlant = asyncHandler(async (req, res) => {
  // Add user ID later if needed (e.g., createdBy)
  const plant = await Plant.create(req.body);
  res.status(201).json({ success: true, data: plant });
});

// @desc    Update plant
// @route   PUT /api/plants/:id
// @access  Private/Admin
const updatePlant = asyncHandler(async (req, res) => {
  let plant = await Plant.findById(req.params.id);

  if (!plant) {
    res.status(404);
    throw new Error(`Plant not found with id of ${req.params.id}`);
  }

  // Add authorization check later (e.g., ensure user is admin)

  plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the modified document
    runValidators: true // Run model validators on update
  });

  res.status(200).json({ success: true, data: plant });
});

// @desc    Delete plant
// @route   DELETE /api/plants/:id
// @access  Private/Admin
const deletePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);

  if (!plant) {
    res.status(404);
    throw new Error(`Plant not found with id of ${req.params.id}`);
  }

  // Add authorization check later

  await plant.deleteOne(); // Use deleteOne method on the document

  res.status(200).json({ success: true, data: {} }); // Send back empty object or confirmation message
});

module.exports = {
    getPlants,
    getPlant,
    createPlant,
    updatePlant,
    deletePlant
}; 