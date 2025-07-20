import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Search, 
  Leaf, 
  Droplets, 
  Sun, 
  Thermometer, 
  Scissors,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Download,
  Share2,
  Heart,
  Info
} from 'lucide-react';
import { toast } from 'react-toastify';
import { aiPlantCareService } from '../services/aiPlantCareService';

const PlantIdentificationWidget = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [identificationResults, setIdentificationResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [careTips, setCareTips] = useState(null);
  const [showCareTips, setShowCareTips] = useState(false);
  
  const fileInputRef = useRef(null);
  const imagePreviewRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setSelectedImage(file);
    setIdentificationResults(null);
    setCareTips(null);
    setShowCareTips(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setIdentificationResults(null);
      setCareTips(null);
      setShowCareTips(false);
    }
  };

  const handleIdentifyPlant = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiPlantCareService.identifyPlant(selectedImage);
      
      if (result.success) {
        setIdentificationResults(result);
        
        // Generate care tips for the identified plant
        if (result.topMatch) {
          const careResponse = await aiPlantCareService.getCareAdvice(
            `Give me detailed care tips for ${result.topMatch.name}`,
            { plant_type: result.topMatch.name }
          );
          
          if (careResponse.success) {
            setCareTips(careResponse);
          }
        }
        
        toast.success('Plant identified successfully!');
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

  const removeImage = () => {
    setSelectedImage(null);
    setIdentificationResults(null);
    setCareTips(null);
    setShowCareTips(false);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.7) return 'High';
    if (confidence >= 0.5) return 'Medium';
    return 'Low';
  };

  const CareTipCard = ({ icon: Icon, title, content, color = 'emerald' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-700 rounded-lg p-4`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-800`}>
          <Icon className={`h-5 w-5 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <div className="flex-1">
          <h4 className={`font-medium text-${color}-900 dark:text-${color}-100 mb-1`}>
            {title}
          </h4>
          <p className={`text-sm text-${color}-700 dark:text-${color}-300`}>
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto my-14 p-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-emerald-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Plant Identifier
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload a photo of any plant and get instant identification with personalized care tips
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload Plant Photo
            </h3>
            
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                selectedImage 
                  ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500'
              }`}
            >
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      ref={imagePreviewRef}
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected plant"
                      className="max-w-full h-64 object-cover rounded-lg mx-auto"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedImage.name}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                      <Camera className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Drop your plant photo here
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      or click to browse files
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Choose Image
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supports JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            
            <button
              onClick={handleIdentifyPlant}
              disabled={!selectedImage || isLoading}
              className="mt-6 w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Identifying Plant...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Identify Plant</span>
                </>
              )}
            </button>
          </div>

          {/* Tips for Better Results */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Tips for Better Identification
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Take a clear, well-lit photo of the entire plant</li>
                  <li>• Include leaves, stems, and flowers if present</li>
                  <li>• Avoid shadows and blurry images</li>
                  <li>• Make sure the plant fills most of the frame</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {identificationResults ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Plant Identification Results */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Identification Results
                  </h3>
                  
                  {identificationResults.topMatch && (
                    <div className="space-y-4">
                      {/* Top Match */}
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                            {identificationResults.topMatch.name}
                          </h4>
                          <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200 rounded-full">
                            Top Match
                          </span>
                        </div>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
                          {identificationResults.topMatch.scientificName}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-emerald-600 dark:text-emerald-400">
                            Confidence: {getConfidenceLabel(identificationResults.topMatch.confidence)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-emerald-200 dark:bg-emerald-700 rounded-full h-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full"
                                style={{ width: `${identificationResults.topMatch.confidence * 100}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${getConfidenceColor(identificationResults.topMatch.confidence)}`}>
                              {(identificationResults.topMatch.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Other Matches */}
                      {identificationResults.identifications.length > 1 && (
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                            Other Possible Matches
                          </h5>
                          <div className="space-y-2">
                            {identificationResults.identifications.slice(1, 4).map((plant, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {plant.name}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {plant.scientificName}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                      <div
                                        className="bg-gray-400 h-2 rounded-full"
                                        style={{ width: `${plant.confidence * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {(plant.confidence * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Image Analysis */}
                      {identificationResults.imageAnalysis && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            Image Analysis
                          </h5>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                Quality: {identificationResults.imageAnalysis.imageQuality}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Sun className="h-4 w-4 text-yellow-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                Lighting: {identificationResults.imageAnalysis.lighting}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Instant Care Tips */}
                {careTips && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Instant Care Tips
                      </h3>
                      <button
                        onClick={() => setShowCareTips(!showCareTips)}
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        {showCareTips ? 'Hide' : 'Show'} Tips
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {showCareTips && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300">
                              {careTips.response}
                            </p>
                          </div>
                          
                          {careTips.recommendations && (
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Key Recommendations:
                              </h4>
                              <ul className="space-y-2">
                                {careTips.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                      {rec}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Quick Care Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <CareTipCard
                              icon={Droplets}
                              title="Watering"
                              content="Water when top 2 inches of soil feel dry"
                              color="blue"
                            />
                            <CareTipCard
                              icon={Sun}
                              title="Light"
                              content="Bright indirect light, avoid direct sun"
                              color="yellow"
                            />
                            <CareTipCard
                              icon={Thermometer}
                              title="Temperature"
                              content="65-75°F (18-24°C), avoid drafts"
                              color="purple"
                            />
                            <CareTipCard
                              icon={Scissors}
                              title="Pruning"
                              content="Remove dead leaves, trim as needed"
                              color="green"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Save to Collection</span>
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Ready to Identify
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload a plant photo to get instant identification and care tips
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantIdentificationWidget; 