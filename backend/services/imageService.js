const axios = require('axios');

// Function to get a plant image using Perenual API
const getPlantImage = async (plantName) => {
  const apiKey = process.env.PERENUAL_API_KEY;
  if (!apiKey) {
    console.warn('Missing Perenual API key, using default image');
    return getDefaultPlantImage(plantName); // Fallback to old default function
  }

  try {
    console.log(`Fetching data for: ${plantName} using Perenual`);
    const searchQuery = encodeURIComponent(plantName);
    
    // Perenual API endpoint for species list (use this to find the plant and its image)
    // We search for the plant name and take the first result
    const response = await axios.get(
      `https://perenual.com/api/species-list?key=${apiKey}&q=${searchQuery}`,
      {
        timeout: 7000 // 7 second timeout
      }
    );

    // Check if data exists and has at least one result
    if (response.data && response.data.data && response.data.data.length > 0) {
      const plantData = response.data.data[0];
      // Check if the first result has a default image object and a regular URL
      if (plantData.default_image && plantData.default_image.regular_url) {
        console.log(`Successfully retrieved image for ${plantName} from Perenual`);
        return plantData.default_image.regular_url;
      } else {
         console.log(`Perenual data for ${plantName} found, but no regular_url image.`);
      }
    } 

    console.log(`No suitable image found for ${plantName} via Perenual, using default.`);
    return getDefaultPlantImage(plantName);

  } catch (error) {
    if (error.response) {
      // Perenual might give specific error messages
      console.error(`Error fetching image from Perenual for ${plantName}: Status ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error(`Error fetching image from Perenual for ${plantName}: No response received`, error.message);
    } else {
      console.error(`Error fetching image from Perenual for ${plantName}:`, error.message);
    }
    return getDefaultPlantImage(plantName);
  }
};

// Function to get a default image based on plant type
const getDefaultPlantImage = (plantName) => {
  // Common plants and their default images
  const defaultImages = {
    'snake plant': 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'pothos': 'https://images.unsplash.com/photo-1600411192015-22a3b9e5ae39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'zz plant': 'https://images.unsplash.com/photo-1632378591514-5c5be04f4f0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'monstera': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'fiddle leaf fig': 'https://images.unsplash.com/photo-1597901089092-6329f7a7595f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'aloe vera': 'https://images.unsplash.com/photo-1596547609652-9cf9d149a39e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'peace lily': 'https://images.unsplash.com/photo-1593482892290-f54927ae2be2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'spider plant': 'https://images.unsplash.com/photo-1572688985715-2f0779a3439a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'rubber plant': 'https://images.unsplash.com/photo-1605484485981-12ef168086ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  };
  
  // Check if we have a default image for this plant type
  const lowerPlantName = plantName.toLowerCase();
  for (const [key, url] of Object.entries(defaultImages)) {
    if (lowerPlantName.includes(key)) {
      return url;
    }
  }
  
  // General default image for plants
  return 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
};

module.exports = {
  getPlantImage
}; 