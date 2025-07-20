const express = require('express');
const router = express.Router();

// Import controller functions (we will create these next)
const {
    getPlants,
    getPlant,
    createPlant,
    updatePlant,
    deletePlant
} = require('../controllers/plantController'); 

// Import protection middleware
const { protect, authorize } = require('../middleware/authMiddlewareNew'); // Placeholder - we will create/refine this

// --- Public Routes ---
router.route('/').get(getPlants);
router.route('/:id').get(getPlant);

// --- Admin Only Routes ---
// We'll add protection middleware here later
router.route('/').post(protect, authorize('Admin'), createPlant);
router.route('/:id').put(protect, authorize('Admin'), updatePlant);
router.route('/:id').delete(protect, authorize('Admin'), deletePlant);

module.exports = router; 