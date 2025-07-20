// AI Plant Care Service - Custom-trained models for advanced plant care support
import axios from 'axios';
import { API_URL, getAuthHeaders, handleApiError } from '../config/api';

// Base AI Service Class
class BaseAIService {
  constructor() {
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  async ensureInitialized() {
    if (this.isInitialized) {
      return true;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initialize();
    try {
      await this.initializationPromise;
      this.isInitialized = true;
      return true;
    } catch (error) {
      this.initializationPromise = null;
      throw error;
    }
  }

  async initialize() {
    // Base initialization - can be overridden
    return true;
  }
}

// Plant Disease Detection Service
export class PlantDiseaseDetector extends BaseAIService {
  constructor() {
    super();
    this.modelName = 'sproutsphere-plant-disease-v1';
  }

  async initialize() {
    try {
      console.log('Initializing disease detection model...');
      const response = await axios.post(`${API_URL}/ai/disease-detection/initialize`, {}, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        console.log('Disease detection model initialized successfully');
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to initialize disease detection model');
      }
    } catch (error) {
      console.error('Disease detection initialization failed:', error);
      throw new Error(`Failed to initialize disease detection: ${error.message}`);
    }
  }

  async detectDisease(imageFile, plantType = null) {
    await this.ensureInitialized();
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      if (plantType) {
        formData.append('plant_type', plantType);
      }

      const response = await axios.post(`${API_URL}/ai/disease-detection`, formData, {
        headers: {
          ...getAuthHeaders(true), // true for multipart
        }
      });

      if (response.data.success) {
        return {
          success: true,
          detections: response.data.detections,
          plantType: response.data.plantType,
          analysis: response.data.analysis
        };
      } else {
        throw new Error(response.data.message || 'Disease detection failed');
      }
    } catch (error) {
      console.error('Disease detection error:', error);
      return handleApiError(error, 'Failed to detect plant diseases');
    }
  }

  generateDiseaseRecommendations(detections) {
    const recommendations = [];
    
    detections.forEach(detection => {
      const { disease, severity, confidence } = detection;
      
      let recommendation = {
        disease,
        severity,
        confidence,
        actions: [],
        prevention: []
      };

      switch (disease) {
        case 'leaf_spot':
          recommendation.actions = [
            'Remove affected leaves',
            'Improve air circulation',
            'Avoid overhead watering',
            'Apply fungicide if necessary'
          ];
          recommendation.prevention = [
            'Water at the base of the plant',
            'Ensure proper spacing between plants',
            'Maintain good air circulation'
          ];
          break;
        case 'powdery_mildew':
          recommendation.actions = [
            'Remove infected plant parts',
            'Apply neem oil or fungicide',
            'Improve air circulation',
            'Reduce humidity'
          ];
          recommendation.prevention = [
            'Avoid overcrowding plants',
            'Maintain proper spacing',
            'Water early in the day'
          ];
          break;
        case 'root_rot':
          recommendation.actions = [
            'Remove plant from pot',
            'Trim away rotten roots',
            'Repot in fresh, well-draining soil',
            'Reduce watering frequency'
          ];
          recommendation.prevention = [
            'Use well-draining soil',
            'Ensure pots have drainage holes',
            'Avoid overwatering',
            'Check soil moisture before watering'
          ];
          break;
        default:
          recommendation.actions = [
            'Isolate the affected plant',
            'Monitor for spread',
            'Consider consulting a plant expert'
          ];
          recommendation.prevention = [
            'Maintain good plant hygiene',
            'Regular inspection for early detection',
            'Proper watering and care practices'
          ];
      }
      
      recommendations.push(recommendation);
    });
    
    return recommendations;
  }
}

// Plant Care Assistant Service
export class PlantCareAssistant extends BaseAIService {
  constructor() {
    super();
    this.modelName = 'sproutsphere-care-gpt-v2';
    this.userPreferences = {};
  }

  async initialize(userPreferences = {}) {
    try {
      console.log('Initializing care assistant...');
      this.userPreferences = userPreferences;
      
      const response = await axios.post(`${API_URL}/ai/care-assistant/initialize`, {
        user_preferences: userPreferences
      }, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        console.log('Care assistant initialized successfully');
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to initialize care assistant');
      }
    } catch (error) {
      console.error('Care assistant initialization failed:', error);
      throw new Error(`Failed to initialize care assistant: ${error.message}`);
    }
  }

  async getCareAdvice(message, context = {}) {
    await this.ensureInitialized();
    
    try {
      const response = await axios.post(`${API_URL}/ai/care-assistant`, {
        message,
        context: {
          ...context,
          user_preferences: this.userPreferences
        }
      }, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        return {
          success: true,
          response: response.data.response,
          recommendations: response.data.recommendations,
          confidence: response.data.confidence,
          follow_up_questions: response.data.follow_up_questions
        };
      } else {
        throw new Error(response.data.message || 'Failed to get care advice');
      }
    } catch (error) {
      console.error('Care advice error:', error);
      return handleApiError(error, 'Failed to get care advice');
    }
  }

  async getPersonalizedCarePlan(plantId, userEnvironment) {
    await this.ensureInitialized();
    
    try {
      const response = await axios.post(`${API_URL}/ai/care-assistant/care-plan`, {
        plant_id: plantId,
        user_environment: userEnvironment,
        user_preferences: this.userPreferences
      }, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        return {
          success: true,
          care_plan: response.data.care_plan,
          schedule: response.data.schedule,
          reminders: response.data.reminders,
          tips: response.data.tips
        };
      } else {
        throw new Error(response.data.message || 'Failed to generate care plan');
      }
    } catch (error) {
      console.error('Care plan error:', error);
      return handleApiError(error, 'Failed to generate care plan');
    }
  }
}

// Plant Voice Assistant Service
export class PlantVoiceAssistant extends BaseAIService {
  constructor() {
    super();
    this.modelName = 'sproutsphere-voice-v1';
    this.recognition = null;
    this.synthesis = null;
    this.isListening = false;
    this.vocabulary = [];
  }

  async initialize() {
    try {
      console.log('Initializing voice assistant...');
      
      // Load vocabulary
      const vocabResponse = await axios.get(`${API_URL}/ai/voice-recognition/vocabulary`, {
        headers: getAuthHeaders()
      });
      
      if (vocabResponse.data.words) {
        this.vocabulary = vocabResponse.data.words;
      }
      
      // Initialize Web Speech API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }
      
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
      
      console.log('Voice assistant initialized successfully');
      return true;
    } catch (error) {
      console.error('Voice assistant initialization failed:', error);
      throw new Error(`Failed to initialize voice assistant: ${error.message}`);
    }
  }

  async loadPlantVocabulary() {
    try {
      const response = await axios.get(`${API_URL}/ai/voice-recognition/vocabulary`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.words) {
        this.vocabulary = response.data.words;
        return this.vocabulary;
      } else {
        throw new Error('Failed to load vocabulary');
      }
    } catch (error) {
      console.error('Vocabulary loading error:', error);
      return [];
    }
  }

  startListening(onResult) {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      return false;
    }

    if (this.isListening) {
      console.log('Already listening...');
      return false;
    }

    this.isListening = true;
    
    this.recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    this.recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice input:', transcript);
      
      try {
        const response = await axios.post(`${API_URL}/ai/voice-recognition`, {
          transcript,
          vocabulary: this.vocabulary,
          context: 'plant_care'
        }, {
          headers: getAuthHeaders()
        });

        if (response.data.success) {
          onResult({
            success: true,
            transcript,
            processed: response.data.processed_command,
            intent: response.data.intent,
            entities: response.data.entities,
            confidence: response.data.confidence
          });
        } else {
          onResult({
            success: false,
            transcript,
            error: response.data.message
          });
        }
      } catch (error) {
        console.error('Voice processing error:', error);
        onResult({
          success: false,
          transcript,
          error: 'Failed to process voice command'
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      this.isListening = false;
      onResult({
        success: false,
        error: `Voice recognition error: ${event.error}`
      });
    };

    this.recognition.onend = () => {
      console.log('Voice recognition ended');
      this.isListening = false;
    };

    this.recognition.start();
    return true;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async processVoiceCommand(transcript) {
    try {
      const response = await axios.post(`${API_URL}/ai/voice-recognition`, {
        transcript,
        vocabulary: this.vocabulary,
        context: 'plant_care'
      }, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        return {
          success: true,
          processed_command: response.data.processed_command,
          intent: response.data.intent,
          entities: response.data.entities,
          confidence: response.data.confidence
        };
      } else {
        throw new Error(response.data.message || 'Failed to process voice command');
      }
    } catch (error) {
      console.error('Voice command processing error:', error);
      return handleApiError(error, 'Failed to process voice command');
    }
  }

  speakResponse(text) {
    if (this.synthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      this.synthesis.speak(utterance);
    }
  }
}

// Plant Identification Service
export class PlantIdentifier extends BaseAIService {
  constructor() {
    super();
    this.modelName = 'sproutsphere-plant-id-v1';
  }

  async initialize() {
    try {
      console.log('Initializing plant identification model...');
      const response = await axios.post(`${API_URL}/ai/plant-identification/initialize`, {}, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        console.log('Plant identification model initialized successfully');
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to initialize plant identification model');
      }
    } catch (error) {
      console.error('Plant identification initialization failed:', error);
      throw new Error(`Failed to initialize plant identification: ${error.message}`);
    }
  }

  async identifyPlant(imageFile) {
    await this.ensureInitialized();
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(`${API_URL}/ai/plant-identification`, formData, {
        headers: {
          ...getAuthHeaders(true), // true for multipart
        }
      });

      if (response.data.success) {
        return {
          success: true,
          identifications: response.data.identifications,
          analysis: response.data.analysis,
          careTips: response.data.careTips
        };
      } else {
        throw new Error(response.data.message || 'Plant identification failed');
      }
    } catch (error) {
      console.error('Plant identification error:', error);
      return handleApiError(error, 'Failed to identify plant');
    }
  }
}

// Main AI Plant Care Service (Facade)
export class AIPlantCareService {
  constructor() {
    this.diseaseDetector = new PlantDiseaseDetector();
    this.careAssistant = new PlantCareAssistant();
    this.voiceAssistant = new PlantVoiceAssistant();
    this.plantIdentifier = new PlantIdentifier();
    this.isInitialized = false;
  }

  async initialize(userPreferences = {}) {
    try {
      console.log('Initializing AI Plant Care Service...');
      
      // Initialize all services in parallel
      await Promise.all([
        this.diseaseDetector.initialize(),
        this.careAssistant.initialize(userPreferences),
        this.voiceAssistant.initialize(),
        this.plantIdentifier.initialize()
      ]);
      
      this.isInitialized = true;
      console.log('AI Plant Care Service initialized successfully');
      return true;
    } catch (error) {
      console.error('AI Plant Care Service initialization failed:', error);
      throw error;
    }
  }

  async detectPlantDisease(imageFile, plantType = null) {
    return await this.diseaseDetector.detectDisease(imageFile, plantType);
  }

  async getCareAdvice(message, context = {}) {
    return await this.careAssistant.getCareAdvice(message, context);
  }

  async getPersonalizedCarePlan(plantId, userEnvironment) {
    return await this.careAssistant.getPersonalizedCarePlan(plantId, userEnvironment);
  }

  startVoiceRecognition(onResult) {
    return this.voiceAssistant.startListening(onResult);
  }

  stopVoiceRecognition() {
    this.voiceAssistant.stopListening();
  }

  speakResponse(text) {
    this.voiceAssistant.speakResponse(text);
  }

  async identifyPlant(imageFile) {
    return await this.plantIdentifier.identifyPlant(imageFile);
  }

  async analyzePlantHealth(imageFile, plantType = null) {
    try {
      // Perform both disease detection and plant identification
      const [diseaseResult, identificationResult] = await Promise.all([
        this.detectPlantDisease(imageFile, plantType),
        this.identifyPlant(imageFile)
      ]);

      // Calculate overall health score
      const healthScore = this.calculateHealthScore(diseaseResult, identificationResult);

      return {
        success: true,
        healthScore,
        diseaseAnalysis: diseaseResult,
        plantIdentification: identificationResult,
        recommendations: this.generateHealthRecommendations(diseaseResult, identificationResult)
      };
    } catch (error) {
      console.error('Plant health analysis error:', error);
      return handleApiError(error, 'Failed to analyze plant health');
    }
  }

  calculateHealthScore(diseaseResult, identificationResult) {
    let score = 100; // Start with perfect health

    // Deduct points for diseases
    if (diseaseResult.success && diseaseResult.detections) {
      diseaseResult.detections.forEach(detection => {
        const severityMultiplier = {
          'low': 5,
          'moderate': 15,
          'high': 30
        };
        score -= severityMultiplier[detection.severity] || 10;
      });
    }

    // Bonus points for good identification confidence
    if (identificationResult.success && identificationResult.identifications) {
      const topIdentification = identificationResult.identifications[0];
      if (topIdentification && topIdentification.confidence > 0.9) {
        score += 5;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  generateHealthRecommendations(diseaseResult, identificationResult) {
    const recommendations = [];

    // Disease-based recommendations
    if (diseaseResult.success && diseaseResult.detections) {
      diseaseResult.detections.forEach(detection => {
        recommendations.push({
          type: 'disease',
          priority: detection.severity === 'high' ? 'urgent' : 'normal',
          message: `Treat ${detection.disease} (${detection.severity} severity)`,
          actions: this.getDiseaseActions(detection.disease)
        });
      });
    }

    // Care recommendations based on plant identification
    if (identificationResult.success && identificationResult.careTips) {
      recommendations.push({
        type: 'care',
        priority: 'normal',
        message: 'Follow specific care guidelines for this plant',
        actions: Object.entries(identificationResult.careTips).map(([key, value]) => ({
          category: key,
          instruction: value
        }))
      });
    }

    return recommendations;
  }

  getDiseaseActions(disease) {
    const actions = {
      'leaf_spot': [
        'Remove affected leaves',
        'Improve air circulation',
        'Apply fungicide if necessary'
      ],
      'powdery_mildew': [
        'Remove infected parts',
        'Apply neem oil',
        'Reduce humidity'
      ],
      'root_rot': [
        'Remove from pot',
        'Trim rotten roots',
        'Repot in fresh soil',
        'Reduce watering'
      ]
    };

    return actions[disease] || ['Monitor closely', 'Consider consulting an expert'];
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      services: {
        diseaseDetector: this.diseaseDetector.isInitialized,
        careAssistant: this.careAssistant.isInitialized,
        voiceAssistant: this.voiceAssistant.isInitialized,
        plantIdentifier: this.plantIdentifier.isInitialized
      }
    };
  }
}

// Export singleton instance
export const aiPlantCareService = new AIPlantCareService();

// Export individual services for specific use cases

