import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Mic, 
  MicOff, 
  Upload, 
  Search, 
  MessageCircle, 
  Leaf, 
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
  Bot,
  User,
  Volume2,
  VolumeX,
  Settings,
  HelpCircle,
  Image,
  FileText,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { aiPlantCareService } from '../services/aiPlantCareService';

const AIPlantCareHub = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  
  // Disease detection state
  const [selectedImage, setSelectedImage] = useState(null);
  const [diseaseResults, setDiseaseResults] = useState(null);
  const [plantType, setPlantType] = useState('');
  
  // Plant identification state
  const [identificationImage, setIdentificationImage] = useState(null);
  const [identificationResults, setIdentificationResults] = useState(null);
  
  // Voice state
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [lastVoiceCommand, setLastVoiceCommand] = useState('');
  
  // Health analysis state
  const [healthAnalysis, setHealthAnalysis] = useState(null);
  
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const voiceButtonRef = useRef(null);

  useEffect(() => {
    initializeAIService();
    scrollToBottom();
  }, [messages]);

  const initializeAIService = async () => {
    try {
      setIsLoading(true);
      const result = await aiPlantCareService.initialize({
        experience_level: 'intermediate',
        preferred_language: 'en',
        notification_preferences: {
          email: true,
          push: true,
          voice: true
        }
      });
      
      if (result.success) {
        setIsInitialized(true);
        toast.success('AI Plant Care Service initialized successfully!');
        
        // Add welcome message
        setMessages([{
          id: Date.now(),
          type: 'bot',
          content: "Hello! I'm your AI Plant Care Assistant. I can help you with:\n\n🌱 Plant disease detection\n🔍 Plant identification\n💬 Care advice and tips\n🎤 Voice commands\n📊 Health analysis\n\nHow can I help you today?",
          timestamp: new Date().toISOString()
        }]);
      } else {
        toast.error('Failed to initialize AI service');
      }
    } catch (error) {
      console.error('Initialization error:', error);
      toast.error('Error initializing AI service');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiPlantCareService.getCareAdvice(inputMessage, {
        current_tab: activeTab,
        user_context: 'plant_care_hub'
      });

      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.response,
          recommendations: response.recommendations,
          followUpQuestions: response.follow_up_questions,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, botMessage]);

        // Speak response if voice is enabled
        if (voiceEnabled && isSpeaking) {
          aiPlantCareService.speakResponse(response.response);
        }
      } else {
        toast.error('Failed to get response');
      }
    } catch (error) {
      console.error('Error getting care advice:', error);
      toast.error('Error getting response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event, type = 'disease') => {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'disease') {
      setSelectedImage(file);
      setDiseaseResults(null);
    } else {
      setIdentificationImage(file);
      setIdentificationResults(null);
    }
  };

  const handleDiseaseDetection = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiPlantCareService.detectPlantDisease(selectedImage, plantType);
      
      if (result.success) {
        setDiseaseResults(result);
        toast.success('Disease detection completed!');
      } else {
        toast.error('Disease detection failed');
      }
    } catch (error) {
      console.error('Disease detection error:', error);
      toast.error('Error detecting diseases');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlantIdentification = async () => {
    if (!identificationImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiPlantCareService.identifyPlant(identificationImage);
      
      if (result.success) {
        setIdentificationResults(result);
        toast.success('Plant identification completed!');
      } else {
        toast.error('Plant identification failed');
      }
    } catch (error) {
      console.error('Plant identification error:', error);
      toast.error('Error identifying plant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHealthAnalysis = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiPlantCareService.analyzePlantHealth(selectedImage, plantType);
      
      if (result.success) {
        setHealthAnalysis(result);
        toast.success('Health analysis completed!');
      } else {
        toast.error('Health analysis failed');
      }
    } catch (error) {
      console.error('Health analysis error:', error);
      toast.error('Error analyzing plant health');
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if (!voiceEnabled) {
      toast.error('Voice recognition is disabled');
      return;
    }

    const success = aiPlantCareService.startVoiceRecognition((result) => {
      setIsListening(false);
      
      if (result.success) {
        setLastVoiceCommand(result.original);
        setInputMessage(result.processed);
        
        // Auto-send the processed command
        setTimeout(() => {
          handleSendMessage({ preventDefault: () => {} });
        }, 500);
      } else {
        toast.error('Voice recognition failed');
      }
    });

    if (success) {
      setIsListening(true);
    }
  };

  const stopVoiceRecognition = () => {
    aiPlantCareService.stopVoiceRecognition();
    setIsListening(false);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) {
      setIsSpeaking(false);
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'disease', label: 'Disease Detection', icon: AlertTriangle },
    { id: 'identify', label: 'Plant ID', icon: Search },
    { id: 'health', label: 'Health Analysis', icon: TrendingUp },
    { id: 'voice', label: 'Voice Commands', icon: Mic }
  ];

  if (!isInitialized && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Initializing AI Plant Care Service
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Loading custom-trained models...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 bg-dark-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-primary-gradient dark:text-white mb-4">
              AI Plant Care Hub
            </h1>
            <p className="text-lg text-primary-gradient dark:text-gray-400 max-w-2xl mx-auto">
              Advanced AI-powered plant care with custom-trained models for disease detection, 
              voice interactions, and personalized care recommendations.
            </p>
          </motion.div>
        </div>

        {/* Status Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  AI Service: {isInitialized ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${voiceEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Voice: {voiceEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-lg transition-colors ${
                  voiceEnabled 
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button
                onClick={toggleSpeaking}
                className={`p-2 rounded-lg transition-colors ${
                  isSpeaking 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <Bot className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* AI Chat Tab */}
            {activeTab === 'chat' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-96 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {message.type === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                          <span className="text-xs opacity-75">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        
                        {message.recommendations && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <p className="text-xs font-medium mb-2">Recommendations:</p>
                            <ul className="text-xs space-y-1">
                              {message.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask about plant care, diseases, or care tips..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                      className={`p-2 rounded-lg transition-colors ${
                        isListening
                          ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                          : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400'
                      }`}
                      disabled={!voiceEnabled || isLoading}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Disease Detection Tab */}
            {activeTab === 'disease' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Plant Disease Detection
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Upload Plant Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        {selectedImage ? (
                          <div>
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt="Selected"
                              className="max-w-full h-48 object-cover rounded-lg mx-auto mb-4"
                            />
                            <button
                              onClick={() => setSelectedImage(null)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Remove Image
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              Choose Image
                            </button>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'disease')}
                          className="hidden"
                        />
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Plant Type (Optional)
                        </label>
                        <input
                          type="text"
                          value={plantType}
                          onChange={(e) => setPlantType(e.target.value)}
                          placeholder="e.g., Monstera, Snake Plant..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <button
                        onClick={handleDiseaseDetection}
                        disabled={!selectedImage || isLoading}
                        className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Analyzing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Detect Diseases</span>
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Results */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                        Analysis Results
                      </h4>
                      
                      {diseaseResults ? (
                        <div className="space-y-4">
                          {diseaseResults.detections.length > 0 ? (
                            diseaseResults.detections.map((detection, index) => (
                              <div
                                key={index}
                                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-gray-900 dark:text-white capitalize">
                                    {detection.disease.replace('_', ' ')}
                                  </h5>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(detection.severity)}`}>
                                    {detection.severity}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Confidence: {(detection.confidence * 100).toFixed(1)}%
                                </p>
                                
                                {diseaseResults.recommendations[index] && (
                                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                      Treatment:
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      {diseaseResults.recommendations[index].treatment}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                      Prevention:
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {diseaseResults.recommendations[index].prevention}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                              <p className="text-gray-600 dark:text-gray-400">
                                No diseases detected! Your plant appears healthy.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          Upload an image and click "Detect Diseases" to analyze your plant
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Plant Identification Tab */}
            {activeTab === 'identify' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Plant Identification
                  </h3>
                  <Link
                    to="/plant-identifier"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    Open Full Identifier
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Plant Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      {identificationImage ? (
                        <div>
                          <img
                            src={URL.createObjectURL(identificationImage)}
                            alt="Selected"
                            className="max-w-full h-48 object-cover rounded-lg mx-auto mb-4"
                          />
                          <button
                            onClick={() => setIdentificationImage(null)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Choose Image
                          </button>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'identify')}
                        className="hidden"
                      />
                    </div>
                    
                    <button
                      onClick={handlePlantIdentification}
                      disabled={!identificationImage || isLoading}
                      className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Identifying...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Search className="h-4 w-4" />
                          <span>Identify Plant</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Results */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Identification Results
                    </h4>
                    
                    {identificationResults ? (
                      <div className="space-y-4">
                        {identificationResults.identifications.map((plant, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 ${
                              index === 0 
                                ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-700' 
                                : 'border-gray-200 dark:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {plant.name}
                              </h5>
                              {index === 0 && (
                                <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded-full">
                                  Top Match
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {plant.scientificName}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Confidence: {(plant.confidence * 100).toFixed(1)}%
                              </span>
                              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full"
                                  style={{ width: `${plant.confidence * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Upload an image and click "Identify Plant" to get results
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Health Analysis Tab */}
            {activeTab === 'health' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Comprehensive Health Analysis
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Plant Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      {selectedImage ? (
                        <div>
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Selected"
                            className="max-w-full h-48 object-cover rounded-lg mx-auto mb-4"
                          />
                          <button
                            onClick={() => setSelectedImage(null)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div>
                          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Choose Image
                          </button>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'disease')}
                        className="hidden"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Plant Type (Optional)
                      </label>
                      <input
                        type="text"
                        value={plantType}
                        onChange={(e) => setPlantType(e.target.value)}
                        placeholder="e.g., Monstera, Snake Plant..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <button
                      onClick={handleHealthAnalysis}
                      disabled={!selectedImage || isLoading}
                      className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>Analyze Health</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Results */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Health Analysis Results
                    </h4>
                    
                    {healthAnalysis ? (
                      <div className="space-y-4">
                        {/* Overall Health Score */}
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            Overall Health Score
                          </h5>
                          <div className="text-center">
                            <div className={`text-3xl font-bold ${getHealthScoreColor(healthAnalysis.overallHealth)}`}>
                              {healthAnalysis.overallHealth}/100
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
                              <div
                                className={`h-3 rounded-full ${
                                  healthAnalysis.overallHealth >= 80 ? 'bg-green-500' :
                                  healthAnalysis.overallHealth >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${healthAnalysis.overallHealth}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Disease Detection */}
                        {healthAnalysis.disease.success && healthAnalysis.disease.detections.length > 0 && (
                          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                              Detected Issues
                            </h5>
                            {healthAnalysis.disease.detections.map((detection, index) => (
                              <div key={index} className="flex items-center justify-between mb-2">
                                <span className="text-sm capitalize">
                                  {detection.disease.replace('_', ' ')}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(detection.severity)}`}>
                                  {detection.severity}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Plant Identification */}
                        {healthAnalysis.identification.success && healthAnalysis.identification.topMatch && (
                          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                              Identified Plant
                            </h5>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {healthAnalysis.identification.topMatch.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {healthAnalysis.identification.topMatch.scientificName}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Upload an image and click "Analyze Health" to get comprehensive results
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Voice Commands Tab */}
            {activeTab === 'voice' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Voice Commands
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Voice Controls */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Voice Recognition
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <button
                          ref={voiceButtonRef}
                          onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                          disabled={!voiceEnabled}
                          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                            isListening
                              ? 'bg-red-500 text-white animate-pulse'
                              : voiceEnabled
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {isListening ? (
                            <MicOff className="h-8 w-8" />
                          ) : (
                            <Mic className="h-8 w-8" />
                          )}
                        </button>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {isListening ? 'Listening...' : voiceEnabled ? 'Click to speak' : 'Voice disabled'}
                        </p>
                      </div>
                      
                      {lastVoiceCommand && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            Last Command
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            "{lastVoiceCommand}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Voice Commands Guide */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Voice Command Examples
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          Plant Care Questions
                        </h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• "How often should I water my monstera?"</li>
                          <li>• "What's wrong with my snake plant?"</li>
                          <li>• "When should I fertilize my plants?"</li>
                          <li>• "How much sunlight does my peace lily need?"</li>
                        </ul>
                      </div>
                      
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          Disease & Health
                        </h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• "My plant has yellow leaves"</li>
                          <li>• "I think my plant has root rot"</li>
                          <li>• "There are bugs on my plant"</li>
                          <li>• "My plant is wilting"</li>
                        </ul>
                      </div>
                      
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          General Care
                        </h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• "When should I repot my plant?"</li>
                          <li>• "How do I propagate my plant?"</li>
                          <li>• "What soil should I use?"</li>
                          <li>• "How do I prune my plant?"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIPlantCareHub; 