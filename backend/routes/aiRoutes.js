const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddlewareNew');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Mock AI models (in production, these would be actual trained models)
const mockDiseaseDetectionModel = {
  predict: async (imageBuffer, plantType) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock disease detection results
    const possibleDiseases = [
      { disease: 'leaf_spot', confidence: 0.85, severity: 'moderate' },
      { disease: 'powdery_mildew', confidence: 0.72, severity: 'low' },
      { disease: 'root_rot', confidence: 0.91, severity: 'high' },
      { disease: 'aphids', confidence: 0.78, severity: 'low' },
      { disease: 'spider_mites', confidence: 0.83, severity: 'moderate' }
    ];
    
    // Randomly select 1-2 diseases for demo
    const numDiseases = Math.floor(Math.random() * 2) + 1;
    const selectedDiseases = [];
    
    for (let i = 0; i < numDiseases; i++) {
      const disease = possibleDiseases[Math.floor(Math.random() * possibleDiseases.length)];
      if (!selectedDiseases.find(d => d.disease === disease.disease)) {
        selectedDiseases.push(disease);
      }
    }
    
    return {
      detections: selectedDiseases,
      plantType: plantType || 'unknown',
      analysis: {
        imageQuality: 'good',
        lighting: 'adequate',
        focus: 'clear'
      }
    };
  }
};

const mockCareAssistantModel = {
  generateResponse: async (message, context) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock responses based on keywords
    const responses = {
      watering: "Based on your plant's needs, I recommend watering when the top 2 inches of soil feel dry. For most indoor plants, this means watering every 7-10 days, but always check the soil moisture first.",
      sunlight: "Your plant prefers bright, indirect sunlight. Place it near a window that gets morning or afternoon sun, but avoid direct midday sun which can scorch the leaves.",
      fertilizer: "During the growing season (spring and summer), fertilize your plant every 2-4 weeks with a balanced, water-soluble fertilizer. Reduce feeding in fall and winter.",
      repotting: "Your plant likely needs repotting if you see roots growing out of the drainage holes or if the soil dries out very quickly. Choose a pot that's 1-2 inches larger in diameter.",
      disease: "I can help you identify plant diseases. Please upload a clear photo of the affected area, and I'll analyze it for common plant health issues.",
      default: "I'm here to help with your plant care questions! You can ask me about watering, sunlight, fertilizing, repotting, or any other plant care topics. For disease identification, please upload a photo."
    };
    
    const lowerMessage = message.toLowerCase();
    let response = responses.default;
    
    if (lowerMessage.includes('water') || lowerMessage.includes('watering')) {
      response = responses.watering;
    } else if (lowerMessage.includes('sun') || lowerMessage.includes('light')) {
      response = responses.sunlight;
    } else if (lowerMessage.includes('fertiliz') || lowerMessage.includes('feed')) {
      response = responses.fertilizer;
    } else if (lowerMessage.includes('repot') || lowerMessage.includes('pot')) {
      response = responses.repotting;
    } else if (lowerMessage.includes('disease') || lowerMessage.includes('sick') || lowerMessage.includes('problem')) {
      response = responses.disease;
    }
    
    return {
      response,
      confidence: 0.85,
      recommendations: [
        "Monitor your plant's response to care changes",
        "Keep a care log to track what works best",
        "Consider environmental factors like humidity and temperature"
      ],
      follow_up_questions: [
        "How long have you had this plant?",
        "What's your current watering schedule?",
        "How much light does your plant receive?"
      ]
    };
  },
  
  generateCarePlan: async (plantId, userEnvironment) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      care_plan: {
        watering: {
          frequency: "Every 7-10 days",
          method: "Water thoroughly until water drains from bottom",
          signs: "Water when top 2 inches of soil are dry"
        },
        light: {
          type: "Bright indirect light",
          duration: "6-8 hours per day",
          location: "Near east or west-facing window"
        },
        humidity: {
          level: "40-60%",
          methods: ["Use a humidifier", "Group with other plants", "Mist leaves occasionally"]
        },
        temperature: {
          range: "65-75°F (18-24°C)",
          avoid: "Drafts and extreme temperature changes"
        },
        fertilizing: {
          frequency: "Every 2-4 weeks during growing season",
          type: "Balanced water-soluble fertilizer",
          amount: "Half strength recommended"
        }
      },
      schedule: {
        daily: ["Check soil moisture", "Monitor for pests"],
        weekly: ["Water if needed", "Rotate plant for even growth"],
        monthly: ["Fertilize during growing season", "Clean leaves"],
        quarterly: ["Check for repotting needs", "Prune if necessary"]
      },
      reminders: [
        { type: "watering", frequency: "weekly", message: "Check if your plant needs water" },
        { type: "fertilizing", frequency: "monthly", message: "Time to fertilize your plant" },
        { type: "cleaning", frequency: "monthly", message: "Clean your plant's leaves" }
      ],
      tips: [
        "Always use room temperature water",
        "Avoid overwatering - it's better to underwater than overwater",
        "Rotate your plant regularly for even growth",
        "Keep an eye out for pests and treat early"
      ]
    };
  }
};

const mockVoiceRecognitionModel = {
  processCommand: async (transcript, vocabulary) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const lowerTranscript = transcript.toLowerCase();
    
    // Extract intent and entities
    let intent = 'general_question';
    let entities = [];
    
    if (lowerTranscript.includes('water') || lowerTranscript.includes('watering')) {
      intent = 'watering_question';
      entities.push({ type: 'action', value: 'watering' });
    } else if (lowerTranscript.includes('light') || lowerTranscript.includes('sun')) {
      intent = 'lighting_question';
      entities.push({ type: 'factor', value: 'lighting' });
    } else if (lowerTranscript.includes('fertiliz') || lowerTranscript.includes('feed')) {
      intent = 'fertilizing_question';
      entities.push({ type: 'action', value: 'fertilizing' });
    } else if (lowerTranscript.includes('disease') || lowerTranscript.includes('sick')) {
      intent = 'disease_question';
      entities.push({ type: 'concern', value: 'disease' });
    }
    
    // Extract plant names
    const plantNames = ['monstera', 'snake plant', 'peace lily', 'ficus', 'philodendron'];
    plantNames.forEach(plant => {
      if (lowerTranscript.includes(plant)) {
        entities.push({ type: 'plant', value: plant });
      }
    });
    
    return {
      processed_command: transcript,
      intent,
      entities,
      confidence: 0.88
    };
  }
};

const mockPlantIdentificationModel = {
  identify: async (imageBuffer) => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const possiblePlants = [
      { 
        name: 'Monstera Deliciosa', 
        scientificName: 'Monstera deliciosa', 
        confidence: 0.92,
        careTips: {
          watering: 'Water when top 2-3 inches of soil feel dry',
          light: 'Bright indirect light, avoid direct sun',
          humidity: 'High humidity (60-80%)',
          temperature: '65-85°F (18-29°C)',
          fertilizing: 'Every 2-4 weeks during growing season',
          repotting: 'Every 2-3 years when rootbound'
        }
      },
      { 
        name: 'Snake Plant', 
        scientificName: 'Sansevieria trifasciata', 
        confidence: 0.89,
        careTips: {
          watering: 'Water sparingly, let soil dry completely between waterings',
          light: 'Low to bright indirect light',
          humidity: 'Low humidity tolerant',
          temperature: '60-85°F (16-29°C)',
          fertilizing: 'Every 2-3 months during growing season',
          repotting: 'Every 3-5 years'
        }
      },
      { 
        name: 'Peace Lily', 
        scientificName: 'Spathiphyllum wallisii', 
        confidence: 0.87,
        careTips: {
          watering: 'Keep soil consistently moist, not soggy',
          light: 'Medium to low indirect light',
          humidity: 'High humidity (50-70%)',
          temperature: '65-80°F (18-27°C)',
          fertilizing: 'Every 6-8 weeks during growing season',
          repotting: 'Every 1-2 years'
        }
      },
      { 
        name: 'Fiddle Leaf Fig', 
        scientificName: 'Ficus lyrata', 
        confidence: 0.85,
        careTips: {
          watering: 'Water when top 2-3 inches of soil are dry',
          light: 'Bright indirect light, some direct morning sun',
          humidity: 'Medium to high humidity (40-60%)',
          temperature: '60-75°F (16-24°C)',
          fertilizing: 'Every 2-4 weeks during growing season',
          repotting: 'Every 2-3 years'
        }
      },
      { 
        name: 'ZZ Plant', 
        scientificName: 'Zamioculcas zamiifolia', 
        confidence: 0.83,
        careTips: {
          watering: 'Water sparingly, drought tolerant',
          light: 'Low to bright indirect light',
          humidity: 'Low humidity tolerant',
          temperature: '65-75°F (18-24°C)',
          fertilizing: 'Every 2-3 months during growing season',
          repotting: 'Every 2-3 years'
        }
      },
      { 
        name: 'Pothos', 
        scientificName: 'Epipremnum aureum', 
        confidence: 0.81,
        careTips: {
          watering: 'Water when top 2 inches of soil feel dry',
          light: 'Low to bright indirect light',
          humidity: 'Medium humidity (40-60%)',
          temperature: '65-85°F (18-29°C)',
          fertilizing: 'Every 2-4 weeks during growing season',
          repotting: 'Every 1-2 years'
        }
      },
      { 
        name: 'Philodendron', 
        scientificName: 'Philodendron hederaceum', 
        confidence: 0.79,
        careTips: {
          watering: 'Water when top 2-3 inches of soil feel dry',
          light: 'Medium to bright indirect light',
          humidity: 'Medium to high humidity (50-70%)',
          temperature: '65-80°F (18-27°C)',
          fertilizing: 'Every 2-4 weeks during growing season',
          repotting: 'Every 2-3 years'
        }
      }
    ];
    
    // Randomly select 3-5 plants for demo
    const numPlants = Math.floor(Math.random() * 3) + 3;
    const selectedPlants = [];
    
    for (let i = 0; i < numPlants; i++) {
      const plant = possiblePlants[Math.floor(Math.random() * possiblePlants.length)];
      if (!selectedPlants.find(p => p.name === plant.name)) {
        selectedPlants.push(plant);
      }
    }
    
    // Sort by confidence
    selectedPlants.sort((a, b) => b.confidence - a.confidence);
    
    return {
      identifications: selectedPlants,
      analysis: {
        imageQuality: 'excellent',
        lighting: 'optimal',
        focus: 'sharp',
        angle: 'good'
      },
      careTips: selectedPlants[0]?.careTips || null
    };
  }
};

// Disease Detection Routes
router.post('/disease-detection/initialize', protect, async (req, res) => {
  try {
    // In production, this would load the actual trained model
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({
      success: true,
      message: 'Disease detection model initialized',
      model: 'sproutsphere-plant-disease-v1',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initialize disease detection model',
      error: error.message
    });
  }
});

router.post('/disease-detection', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const plantType = req.body.plant_type || null;
    
    // Process image with AI model
    const result = await mockDiseaseDetectionModel.predict(req.file.buffer, plantType);
    
    res.json({
      success: true,
      detections: result.detections,
      plantType: result.plantType,
      analysis: result.analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Disease detection failed',
      error: error.message
    });
  }
});

// Care Assistant Routes
router.post('/care-assistant/initialize', protect, async (req, res) => {
  try {
    const { user_preferences, model_config } = req.body;
    
    // In production, this would initialize the fine-tuned model with user preferences
    await new Promise(resolve => setTimeout(resolve, 800));
    
    res.json({
      success: true,
      message: 'Care assistant initialized',
      model: 'sproutsphere-care-gpt-v2',
      user_preferences: user_preferences || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initialize care assistant',
      error: error.message
    });
  }
});

router.post('/care-assistant', protect, async (req, res) => {
  try {
    const { message, context, model_config } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    // Generate response using AI model
    const result = await mockCareAssistantModel.generateResponse(message, context);
    
    res.json({
      success: true,
      response: result.response,
      recommendations: result.recommendations,
      confidence: result.confidence,
      follow_up_questions: result.follow_up_questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate care advice',
      error: error.message
    });
  }
});

router.post('/care-assistant/care-plan', protect, async (req, res) => {
  try {
    const { plant_id, user_environment, user_preferences } = req.body;
    
    if (!plant_id) {
      return res.status(400).json({
        success: false,
        message: 'Plant ID is required'
      });
    }
    
    // Generate personalized care plan
    const result = await mockCareAssistantModel.generateCarePlan(plant_id, user_environment);
    
    res.json({
      success: true,
      care_plan: result.care_plan,
      schedule: result.schedule,
      reminders: result.reminders,
      tips: result.tips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate care plan',
      error: error.message
    });
  }
});

// Voice Recognition Routes
router.get('/voice-recognition/vocabulary', protect, async (req, res) => {
  try {
    // Return custom plant care vocabulary
    const vocabulary = {
      words: [
        'water', 'fertilize', 'prune', 'repot', 'sunlight', 'humidity',
        'temperature', 'disease', 'pest', 'nutrient', 'soil', 'drainage',
        'monstera', 'snake plant', 'peace lily', 'ficus', 'philodendron',
        'pothos', 'zz plant', 'fiddle leaf fig', 'aloe vera', 'succulent',
        'cactus', 'orchid', 'fern', 'palm', 'bonsai', 'herb', 'flowering',
        'indoor', 'outdoor', 'garden', 'pot', 'planter', 'soil', 'fertilizer',
        'pesticide', 'fungicide', 'neem oil', 'root rot', 'leaf spot',
        'powdery mildew', 'aphids', 'spider mites', 'scale', 'mealybugs'
      ]
    };
    
    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load vocabulary',
      error: error.message
    });
  }
});

router.post('/voice-recognition', protect, async (req, res) => {
  try {
    const { transcript, vocabulary, context } = req.body;
    
    if (!transcript) {
      return res.status(400).json({
        success: false,
        message: 'Transcript is required'
      });
    }
    
    // Process voice command with AI model
    const result = await mockVoiceRecognitionModel.processCommand(transcript, vocabulary);
    
    res.json({
      success: true,
      processed_command: result.processed_command,
      intent: result.intent,
      entities: result.entities,
      confidence: result.confidence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process voice command',
      error: error.message
    });
  }
});

// Plant Identification Routes
router.post('/plant-identification/initialize', protect, async (req, res) => {
  try {
    // In production, this would load the actual trained model
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    res.json({
      success: true,
      message: 'Plant identification model initialized',
      model: 'sproutsphere-plant-id-v1',
      catalog_size: 5000
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initialize plant identification model',
      error: error.message
    });
  }
});

router.post('/plant-identification', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    // Process image with AI model
    const result = await mockPlantIdentificationModel.identify(req.file.buffer);
    
    res.json({
      success: true,
      identifications: result.identifications,
      analysis: result.analysis,
      careTips: result.careTips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Plant identification failed',
      error: error.message
    });
  }
});

// Health Check Route (Public - no auth required)
router.get('/health', async (req, res) => {
  try {
    res.json({
      success: true,
      status: 'healthy',
      services: {
        disease_detection: 'operational',
        care_assistant: 'operational',
        voice_recognition: 'operational',
        plant_identification: 'operational'
      },
      models: {
        'sproutsphere-plant-disease-v1': 'loaded',
        'sproutsphere-care-gpt-v2': 'loaded',
        'sproutsphere-voice-v1': 'loaded',
        'sproutsphere-plant-id-v1': 'loaded'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Test initialization endpoint (Public - no auth required)
router.post('/test-initialize', async (req, res) => {
  try {
    // Simulate AI model loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({
      success: true,
      message: 'AI services test initialization successful',
      timestamp: new Date().toISOString(),
      services: ['disease_detection', 'care_assistant', 'voice_recognition', 'plant_identification']
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI services test initialization failed',
      error: error.message
    });
  }
});

module.exports = router; 