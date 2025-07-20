import { plantService } from '../services/plantService';

// Define keywords for matching
const LIGHT_KEYWORDS = {
  low: ['low light', 'dark', 'shade', 'shady', 'dim', 'shadow', 'indirect', 'north', 'indoor', 'office'],
  medium: ['medium light', 'partial sun', 'filtered', 'moderate', 'east', 'west'],
  bright: ['bright', 'sunny', 'full sun', 'direct', 'window', 'south', 'balcony', 'patio', 'outdoor']
};

const EXPERIENCE_KEYWORDS = {
  beginner: ['beginner', 'new', 'easy', 'simple', 'first', 'starter', 'novice', 'basic', 'low maintenance'],
  intermediate: ['intermediate', 'moderate', 'some experience', 'regular care'],
  expert: ['expert', 'advanced', 'difficult', 'challenging', 'experienced', 'rare', 'exotic']
};

const SIZE_KEYWORDS = {
  small: ['small', 'tiny', 'desk', 'desktop', 'tabletop', 'windowsill', 'compact', 'mini'],
  medium: ['medium', 'shelf', 'bookshelf', 'nightstand', 'table'],
  large: ['large', 'big', 'floor', 'corner', 'statement', 'tall', 'huge']
};

const PURPOSE_KEYWORDS = {
  airPurifying: ['air', 'purify', 'clean', 'oxygen', 'air quality', 'fresh', 'breathing'],
  petFriendly: ['pet', 'dog', 'cat', 'animal', 'safe', 'non-toxic'],
  flowering: ['flower', 'bloom', 'colorful', 'color', 'blossom'],
  foliage: ['foliage', 'leaves', 'greenery', 'lush', 'bushy', 'tropical'],
  lowWater: ['drought', 'dry', 'infrequent', 'forget', 'busy', 'travel', 'vacation', 'neglect']
};

// More specific plant categories
const PLANT_CATEGORIES = {
  succulents: ['succulent', 'cactus', 'aloe', 'echeveria', 'haworthia', 'sedum', 'drought', 'desert'],
  tropicals: ['tropical', 'monstera', 'philodendron', 'pothos', 'humid', 'exotic', 'palm', 'rainforest'],
  ferns: ['fern', 'boston fern', 'bird nest', 'maidenhair', 'humid', 'shade'],
  flowering: ['flower', 'bloom', 'blossom', 'flowering', 'orchid', 'rose', 'lily', 'colorful'],
  herbs: ['herb', 'kitchen', 'cooking', 'edible', 'mint', 'basil', 'rosemary', 'thyme', 'culinary'],
  trees: ['tree', 'fiddle leaf', 'fig', 'money tree', 'rubber tree', 'palm tree', 'tall']
};

// Helper function to identify preferences from query text
function identifyPreferences(queryText) {
  const text = queryText.toLowerCase();
  
  // Default preferences
  const preferences = {
    light: null,
    experience: null,
    size: null,
    purposes: [],
    categories: []
  };
  
  // Identify light preference
  for (const [level, keywords] of Object.entries(LIGHT_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      preferences.light = level;
      break;
    }
  }
  
  // Identify experience level
  for (const [level, keywords] of Object.entries(EXPERIENCE_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      preferences.experience = level;
      break;
    }
  }
  
  // Identify size preference
  for (const [size, keywords] of Object.entries(SIZE_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      preferences.size = size;
      break;
    }
  }
  
  // Identify purposes (multiple can apply)
  for (const [purpose, keywords] of Object.entries(PURPOSE_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      preferences.purposes.push(purpose);
    }
  }
  
  // Identify plant categories (multiple can apply)
  for (const [category, keywords] of Object.entries(PLANT_CATEGORIES)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      preferences.categories.push(category);
    }
  }
  
  // Set reasonable defaults if not specified
  if (!preferences.light) preferences.light = 'medium';
  if (!preferences.experience) preferences.experience = 'beginner';
  if (!preferences.size) preferences.size = 'medium';
  
  return preferences;
}

// Function to evaluate a plant based on preferences
function scorePlant(plant, preferences) {
  // Ensure plant object is valid
  if (!plant) return { score: 0, reasons: [] };
  
  let score = 0;
  const reasons = [];
  
  // Light score
  const lightScoreMap = {
    'low': { 'Easy': 5, 'Moderate': 2, 'Expert': 0 },
    'medium': { 'Easy': 4, 'Moderate': 5, 'Expert': 3 },
    'bright': { 'Easy': 3, 'Moderate': 4, 'Expert': 5 }
  };
  
  // Base score on care level and light preference match
  if (preferences.light && lightScoreMap[preferences.light] && plant.careLevel) {
    const lightScore = lightScoreMap[preferences.light][plant.careLevel] || 0;
    score += lightScore;
    
    if (lightScore >= 4) {
      reasons.push(`perfect for ${preferences.light} light conditions`);
    }
  }
  
  // Experience level match
  const expScoreMap = {
    'beginner': { 'Easy': 5, 'Moderate': 2, 'Expert': 0 },
    'intermediate': { 'Easy': 3, 'Moderate': 5, 'Expert': 2 },
    'expert': { 'Easy': 1, 'Moderate': 3, 'Expert': 5 }
  };
  
  if (preferences.experience && expScoreMap[preferences.experience] && plant.careLevel) {
    const expScore = expScoreMap[preferences.experience][plant.careLevel] || 0;
    score += expScore;
    
    if (plant.careLevel === 'Easy' && preferences.experience === 'beginner') {
      reasons.push("perfect for beginners");
    } else if (plant.careLevel === 'Moderate' && preferences.experience === 'intermediate') {
      reasons.push("great for gardeners with some experience");
    } else if (plant.careLevel === 'Expert' && preferences.experience === 'expert') {
      reasons.push("provides a rewarding challenge for experienced plant enthusiasts");
    }
  }
  
  // Size preference matching
  // This would need plant data to include size information
  // For now, we'll use a simple match based on plant name and description
  const smallPlants = ['succulent', 'cactus', 'bonsai', 'air plant', 'fern', 'mini', 'small'];
  const largePlants = ['monstera', 'fiddle', 'palm', 'bird of paradise', 'rubber tree', 'tree', 'large'];
  
  const plantNameLower = (plant.name || '').toLowerCase();
  const plantDescLower = (plant.description || '').toLowerCase();
  
  let isSmall = smallPlants.some(term => plantNameLower.includes(term) || plantDescLower.includes(term));
  let isLarge = largePlants.some(term => plantNameLower.includes(term) || plantDescLower.includes(term));
  
  if ((preferences.size === 'small' && isSmall) || 
      (preferences.size === 'large' && isLarge) || 
      (preferences.size === 'medium' && !isSmall && !isLarge)) {
    score += 3;
    reasons.push(`works well in ${preferences.size} spaces`);
  }
  
  // Purpose matching
  if (preferences.purposes && preferences.purposes.includes('airPurifying') && 
      plantDescLower && (plantDescLower.includes('air') || plantDescLower.includes('purif') || plantDescLower.includes('oxygen'))) {
    score += 3;
    reasons.push("helps purify the air");
  }
  
  if (preferences.purposes && preferences.purposes.includes('petFriendly') && 
      plantDescLower && (plantDescLower.includes('pet friendly') || plantDescLower.includes('non-toxic'))) {
    score += 3;
    reasons.push("safe for pets");
  }
  
  if (preferences.purposes && preferences.purposes.includes('flowering') && 
      ((plantDescLower && (plantDescLower.includes('flower') || plantDescLower.includes('bloom'))) || 
       (plantNameLower && plantNameLower.includes('flower')))) {
    score += 3;
    reasons.push("produces beautiful flowers");
  }
  
  if (preferences.purposes && preferences.purposes.includes('lowWater') && 
      ((plantDescLower && (plantDescLower.includes('drought') || plantDescLower.includes('infrequent water') || 
       plantDescLower.includes('dry'))) || plant.careLevel === 'Easy')) {
    score += 3;
    reasons.push("requires minimal watering");
  }
  
  // Category matching (new)
  if (preferences.categories && Array.isArray(preferences.categories)) {
    for (const category of preferences.categories) {
      // Skip if category doesn't exist in our definitions
      if (!category || !PLANT_CATEGORIES[category]) continue;
      
      const categoryKeywords = PLANT_CATEGORIES[category] || [];
      const matches = categoryKeywords.some(keyword => 
        (plantNameLower && plantNameLower.includes(keyword)) || 
        (plantDescLower && plantDescLower.includes(keyword))
      );
      
      if (matches) {
        score += 4; // Strong bonus for category match
        if (category === 'succulents') {
          reasons.push("is a drought-tolerant succulent");
        } else if (category === 'tropicals') {
          reasons.push("has lush tropical foliage");
        } else if (category === 'ferns') {
          reasons.push("has beautiful feathery fronds");
        } else if (category === 'flowering') {
          reasons.push("produces beautiful blooms");
        } else if (category === 'herbs') {
          reasons.push("can be used in cooking");
        } else if (category === 'trees') {
          reasons.push("makes a striking statement piece");
        }
      }
    }
  }
  
  // Analyze name and description for more specific matches
  if (preferences.userQuery && typeof preferences.userQuery === 'string') {
    const queryWords = new Set(preferences.userQuery.toLowerCase().split(/\s+/).filter(Boolean));
    let nameMatches = 0;
    
    if (queryWords.size > 0 && plantNameLower) {
      // Check for direct name matches
      for (const word of queryWords) {
        if (word && word.length > 3 && plantNameLower.includes(word)) {
          nameMatches++;
        }
      }
      
      // Strong bonus for direct name matches
      if (nameMatches > 0) {
        score += nameMatches * 3;
        reasons.push("matches your specific request");
      }
    }
  }
  
  // Indoor/Outdoor preference matching
  if (preferences.userQuery && typeof preferences.userQuery === 'string') {
    const lowerQuery = preferences.userQuery.toLowerCase();
    if (lowerQuery.includes('outdoor') && plant.category === 'Outdoor') {
      score += 3;
      reasons.push("thrives in outdoor settings");
    } else if (lowerQuery.includes('indoor') && plant.category === 'Indoor') {
      score += 3;
      reasons.push("perfect for indoor spaces");
    }
  }
  
  // Additional boost for available plants
  if (plant.inStock) {
    score += 2;
  }

  // Apply a small random factor to create variety in recommendations (±1 point)
  score += (Math.random() * 2 - 1);
  
  return {
    score,
    reasons: reasons.slice(0, 3) // Limit to top 3 reasons
  };
}

// Main recommendation function
export const getPlantRecommendations = async (userQuery) => {
  try {
    // Validate input
    if (!userQuery) {
      console.warn('Empty query provided to recommendation engine');
      return [];
    }
    
    // Get user preferences from query
    const preferences = identifyPreferences(userQuery);
    preferences.userQuery = userQuery; // Store the original query
    console.log('Identified preferences:', preferences);
    
    // Fetch all plants from the database
    const response = await plantService.getAllPlants();
    if (!response || !response.success) {
      console.error('Failed to fetch plants:', response);
      return []; // Return empty array instead of throwing
    }
    
    // Ensure plants is an array
    const plants = Array.isArray(response.data) ? response.data : [];
    if (plants.length === 0) {
      console.log('No plants found in database');
      return [];
    }
    
    // Score each plant
    const scoredPlants = plants.map(plant => {
      const { score, reasons } = scorePlant(plant, preferences);
      return {
        ...plant,
        score,
        reason: reasons.length > 0 
          ? `This plant is ${reasons.join(' and ')}.`
          : 'This plant matches your criteria.'
      };
    });
    
    // Filter for minimum match and sort by score
    let recommendations = scoredPlants
      .filter(plant => plant.score >= 5) // Minimum threshold
      .sort((a, b) => b.score - a.score); // Sort by best matches
    
    // Ensure diversity by selecting top plants from different categories
    // if there are many results
    if (recommendations.length > 10) {
      // Get the top 3 plants regardless
      const topPicks = recommendations.slice(0, 3);
      
      // Then select plants with different names to ensure variety
      const remainingPlants = recommendations.slice(3);
      const diversePicks = [];
      
      // Safely extract name parts to avoid forEach on undefined
      const selectedNames = new Set();
      topPicks.forEach(plant => {
        if (plant && plant.name) {
          const nameParts = plant.name.split(' ');
          const baseName = nameParts.length > 1 ? nameParts[1] : plant.name;
          selectedNames.add(baseName);
        }
      });
      
      for (const plant of remainingPlants) {
        // Skip plants with no name
        if (!plant || !plant.name) continue;
        
        const nameParts = plant.name.split(' ');
        const baseName = nameParts.length > 1 ? nameParts[1] : plant.name;
        
        if (!selectedNames.has(baseName) && diversePicks.length < 7) {
          diversePicks.push(plant);
          selectedNames.add(baseName);
        }
      }
      
      recommendations = [...topPicks, ...diversePicks].slice(0, 8);
    } else {
      recommendations = recommendations.slice(0, 8); // Top 8 recommendations
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error generating plant recommendations:', error);
    return []; // Return empty array on any error
  }
}; 