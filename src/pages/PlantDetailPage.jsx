import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedSection from '../components/AnimatedSection';
import AnimatedCard from '../components/AnimatedCard';
import { plantService } from '../services/plantService';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Sun, 
  Droplets, 
  ThermometerSnowflake, 
  Heart, 
  Share2,
  Truck,
  Info,
  MessageCircle
} from 'lucide-react';

const PlantDetailPage = () => {
  const { id: plantId } = useParams();
  const { addToCart } = useCart();

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchPlant = async () => {
      if (!plantId) {
        setError('No plant ID provided.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await plantService.getPlantById(plantId);
        if (response.success) {
          setPlant(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch plant details');
        }
      } catch (err) {
        const errorMsg = err.message || 'Could not load plant details';
        console.error("Fetch Plant Error:", errorMsg, err);
        setError(errorMsg);
        toast.error(`Error loading plant: ${errorMsg}`);
      }
      setLoading(false);
    };

    fetchPlant();
  }, [plantId]);

  const handleAddToCart = () => {
    if (plant) {
      addToCart(plant);
      toast.success(`${plant.name} added to cart!`);
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success(`${plant?.name} added to favorites!`);
    }
  };
  
  const getCareLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'moderate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'expert':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };
  
  // Create mock images if the plant only has one
  const getPlantImages = () => {
    if (!plant) return [];
    return plant.additionalImages && plant.additionalImages.length > 0
      ? [plant.image, ...plant.additionalImages]
      : [plant.image, plant.image, plant.image]; // duplicate the same image as placeholder
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300 animate-pulse">Loading plant details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <AnimatedSection className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-dark-900 px-4">
        <AnimatedCard 
          variant="outline"
          className="max-w-md w-full p-8 text-center"
        >
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <Info className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error loading plant</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <AnimatedButton 
            as={Link} 
            to="/plant-store" 
            variant="primary"
          >
            Return to Store
          </AnimatedButton>
        </AnimatedCard>
      </AnimatedSection>
    );
  }

  if (!plant) {
    return (
      <AnimatedSection className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-dark-900 px-4">
        <AnimatedCard 
          variant="minimal"
          className="max-w-md w-full p-8 text-center"
        >
          <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <Info className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Plant not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find the plant you're looking for.</p>
          <AnimatedButton 
            as={Link} 
            to="/plant-store" 
            variant="primary"
          >
            Browse Plants
          </AnimatedButton>
        </AnimatedCard>
      </AnimatedSection>
    );
  }

  const plantImages = getPlantImages();

  return (
    <AnimatedSection 
      animation="fade-in"
      className="min-h-screen bg-gradient-to-br from-primary-50/50 via-white to-cyan-50/30 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900/90 py-12 md:py-16 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/plant-store" 
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Plant Store
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery Column */}
          <div className="space-y-4">
            <motion.div 
              className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={plantImages[selectedImage]}
                alt={plant.name}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800';
                }}
              />
              
              {/* Favorite button */}
              <button 
                onClick={toggleFavorite}
                className={`absolute top-4 right-4 p-2 rounded-full ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/70 dark:text-red-400' 
                    : 'bg-white/80 text-gray-600 dark:bg-dark-800/80 dark:text-gray-400'
                } hover:scale-110 transition-all duration-200 backdrop-blur-sm`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </motion.div>
            
            {/* Thumbnail Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-green">
              {plantImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary-500 dark:border-primary-400 scale-105'
                      : 'border-gray-200 dark:border-gray-700 opacity-70'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${plant.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800';
                    }}
                  />
                </button>
              ))}
            </div>
            
            {/* Plant Badges */}
            <div className="flex flex-wrap gap-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCareLevelColor(plant.careLevel)}`}>
                <MessageCircle className="h-4 w-4 mr-1.5"/>
                {plant.careLevel || 'Moderate'} Care
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                <Droplets className="h-4 w-4 mr-1.5"/> 
                {plant.watering || 'Weekly'} Watering
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                <Sun className="h-4 w-4 mr-1.5"/> 
                {plant.lightNeeds || 'Medium'} Light
              </div>
              <div className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                <ThermometerSnowflake className="h-4 w-4 mr-1.5"/> 
                {plant.temperature || '65-80°F'}
              </div>
            </div>
          </div>

          {/* Details Column */}
          <motion.div 
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl font-display">{plant.name}</h1>
            {plant.scientificName && (
              <p className="text-md text-gray-500 dark:text-gray-400 italic mt-1">{plant.scientificName}</p>
            )}
            
            <div className="mt-4 flex items-center">
              <p className="text-3xl text-primary-600 dark:text-primary-400 font-semibold">${plant.price?.toFixed(2)}</p>
              {plant.regularPrice && plant.regularPrice > plant.price && (
                <p className="ml-3 text-gray-500 dark:text-gray-400 line-through">${plant.regularPrice.toFixed(2)}</p>
              )}
              {plant.regularPrice && plant.regularPrice > plant.price && (
                <span className="ml-3 px-2 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">
                  Save {Math.round(((plant.regularPrice - plant.price) / plant.regularPrice) * 100)}%
                </span>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="mt-3 flex items-center">
              <span className={`inline-flex h-3 w-3 rounded-full ${plant.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {plant.inStock ? 'In Stock' : 'Out of Stock'}
                {plant.inStock && plant.stockCount && ` - ${plant.stockCount} available`}
              </span>
            </div>

            {/* Description */}
            <div className="mt-6 text-gray-700 dark:text-gray-300 prose dark:prose-invert prose-sm sm:prose-base">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">About this plant</h3>
              <div dangerouslySetInnerHTML={{ __html: plant.description }} />
            </div>

            {/* Delivery Info */}
            <div className="mt-6 bg-gray-50 dark:bg-dark-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex">
                <Truck className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Free shipping</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Estimated delivery: 3-5 business days</p>
                </div>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <AnimatedButton
                type="button"
                variant={plant.inStock ? "primary" : "secondary"}
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!plant.inStock}
                icon={ShoppingCart}
              >
                {plant.inStock ? 'Add to Cart' : 'Sold Out'}
              </AnimatedButton>
              
              <AnimatedButton 
                variant="outlinePrimary"
                onClick={toggleFavorite}
                icon={Heart}
                className={isFavorite ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
              >
                {isFavorite ? 'Saved' : 'Save'}
              </AnimatedButton>
              
              <AnimatedButton 
                variant="outline"
                icon={Share2}
              >
                Share
              </AnimatedButton>
            </div>
            
            {!plant.inStock && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-3">
                This item is currently out of stock. Sign up for notifications when it becomes available again.
              </p>
            )}
          </motion.div>
        </div>
        
        {/* Related Plants Section */}
        <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-display">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Link to="/plant-store" key={i}>
                <AnimatedCard
                  delay={i * 0.1}
                  className="h-full group"
                >
                  <div className="aspect-square overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={`https://source.unsplash.com/random/300x300/?plant&sig=${i}`} 
                      alt="Related plant"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Related Plant {i + 1}</h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mt-1">${(19.99 + i * 5).toFixed(2)}</p>
                  </div>
                </AnimatedCard>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PlantDetailPage; 