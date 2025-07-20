import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Search, 
  Leaf, 
  CheckCircle,
  Loader2,
  X,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { aiPlantCareService } from '../services/aiPlantCareService';

const QuickPlantIdentifier = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [identificationResults, setIdentificationResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setSelectedImage(file);
    setIdentificationResults(null);
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
  };

  return (
    <div className="bg-dark-700 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-center mb-6">
        <div className="flex items-center pt-10 justify-center mb-3">
          <Search className="h-8 w-8 text-white mr-2" />
          <h3 className="text-xl  font-bold text-white dark:text-white">
            Quick Plant Identifier
          </h3>
        </div>
        <p className="text-white pt-10 pb-10 dark:text-gray-400">
          Upload a photo and get instant plant identification
        </p>
      </div>

      <div className="space-y-4">
        {/* Image Upload */}
        <div className="border-2 pt-8 pb-8 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          {selectedImage ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected plant"
                  className="max-w-full h-48 object-cover rounded-lg mx-auto"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedImage.name}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                  <Camera className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-white dark:text-white mb-2">
                  Drop your plant photo here
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  Choose Image
                </button>
              </div>
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

        {/* Identify Button */}
        <button
          onClick={handleIdentifyPlant}
          disabled={!selectedImage || isLoading}
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700  disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Identifying...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Identify Plant</span>
            </>
          )}
        </button>

        {/* Results */}
        <AnimatePresence>
          {identificationResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {identificationResults.topMatch && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">
                      {identificationResults.topMatch.name}
                    </h4>
                    <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200 rounded-full">
                      {(identificationResults.topMatch.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
                    {identificationResults.topMatch.scientificName}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">
                        Plant identified successfully!
                      </span>
                    </div>
                    <Link
                      to="/plant-identifier"
                      className="flex items-center space-x-1 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      <span>Get Care Tips</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link to Full Identifier */}
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
          <Link
            to="/plant-identifier"
            className="text-sm text-white hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center justify-center space-x-1"
          >
            <span>Open Full Plant Identifier</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickPlantIdentifier; 