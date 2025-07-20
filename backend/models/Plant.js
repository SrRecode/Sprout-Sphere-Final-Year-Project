const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a plant name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  scientificName: {
    type: String,
    trim: true,
    maxlength: [100, 'Scientific name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Indoor', 'Outdoor', 'Succulent', 'Tropical', 'Flowering', 'Foliage', 'Hanging', 'Bonsai', 'Herb', 'Fern']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  salePrice: {
    type: Number,
    default: null
  },
  careLevel: {
    type: String,
    required: true,
    enum: ['Easy', 'Moderate', 'Expert']
  },
  lightRequirement: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'Bright Indirect', 'Direct Sunlight']
  },
  wateringFrequency: {
    type: String,
    required: true,
    enum: ['Rarely', 'Every 2-3 Weeks', 'Weekly', 'Bi-Weekly', 'Daily']
  },
  humidity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Any'],
    default: 'Medium'
  },
  petFriendly: {
    type: Boolean,
    default: false
  },
  purifyingAir: {
    type: Boolean,
    default: false
  },
  heightCm: {
    type: Number,
    default: 0
  },
  potSize: {
    type: String,
    enum: ['Small', 'Medium', 'Large', 'Extra Large'],
    default: 'Medium'
  },
  image: {
    type: String, // URL to the image
    default: 'no-photo.jpg' // Or a placeholder URL
  },
  additionalImages: {
    type: [String], // Array of image URLs
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  careInstructions: {
    type: String,
    default: ''
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 10
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  // Add other fields if needed, e.g., size, light requirements, watering frequency
});

module.exports = mongoose.model('Plant', PlantSchema); 