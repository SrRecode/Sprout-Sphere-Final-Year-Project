const asyncHandler = require('express-async-handler');
const Plant = require('../models/Plant');

// Helper function to parse query and build MongoDB filter
const buildMongoQuery = (query) => {
    const filter = {};
    const lowerQuery = query.toLowerCase();
    const orConditions = [];

    // Parse for multiple conditions
    
    // Care Level Keywords
    if (/easy|beginner|low maintenance|hardy|neglect|novice|starter|simple/i.test(lowerQuery)) {
        orConditions.push({ careLevel: 'Easy' });
    }
    if (/moderate|intermediate|some experience|average|normal care/i.test(lowerQuery)) {
        orConditions.push({ careLevel: 'Moderate' });
    }
    if (/expert|difficult|finicky|advanced|challenging/i.test(lowerQuery)) {
        orConditions.push({ careLevel: 'Expert' });
    }

    // Light Requirement Keywords
    if (/low light|shade|dark|no sun|north facing|little light|dim/i.test(lowerQuery)) {
        orConditions.push({ lightRequirement: 'Low' });
    }
    if (/medium light|indirect light|partial sun|east facing|west facing/i.test(lowerQuery)) {
        orConditions.push({ lightRequirement: 'Medium' });
    }
    if (/bright indirect|lots of light|bright spot|bright room/i.test(lowerQuery)) {
        orConditions.push({ lightRequirement: 'Bright Indirect' });
    }
    if (/full sun|direct sunlight|south facing|sunniest/i.test(lowerQuery)) {
        orConditions.push({ lightRequirement: 'Direct Sunlight' });
    }

    // Location/Type Keywords
    if (/indoor|inside|home|apartment|office|desk/i.test(lowerQuery)) {
        orConditions.push({ category: 'Indoor' });
    }
    if (/outdoor|outside|garden|patio|balcony|yard/i.test(lowerQuery)) {
        orConditions.push({ category: 'Outdoor' });
    }
    if (/succulent|cactus|aloe|jade|echeveria/i.test(lowerQuery)) {
        orConditions.push({ category: 'Succulent' });
    }
    if (/tropical|monstera|philodendron|palm|exotic/i.test(lowerQuery)) {
        orConditions.push({ category: 'Tropical' });
    }
    if (/flower|bloom|colorful|blossom|flowering/i.test(lowerQuery)) {
        orConditions.push({ category: 'Flowering' });
    }
    if (/foliage|leaves|greenery|leafy/i.test(lowerQuery)) {
        orConditions.push({ category: 'Foliage' });
    }
    if (/hanging|trailing|vine|cascading|draping/i.test(lowerQuery)) {
        orConditions.push({ category: 'Hanging' });
    }
    if (/bonsai|miniature|japanese|tiny tree/i.test(lowerQuery)) {
        orConditions.push({ category: 'Bonsai' });
    }
    if (/herb|cooking|edible|kitchen|culinary/i.test(lowerQuery)) {
        orConditions.push({ category: 'Herb' });
    }
    if (/fern|woodland|forest|shade loving/i.test(lowerQuery)) {
        orConditions.push({ category: 'Fern' });
    }

    // Watering Frequency
    if (/rarely water|forget|drought tolerant|neglect|dry/i.test(lowerQuery)) {
        orConditions.push({ wateringFrequency: 'Rarely' });
    }
    if (/every few weeks|infrequent|occasionally|bi-weekly/i.test(lowerQuery)) {
        orConditions.push({ wateringFrequency: 'Every 2-3 Weeks' });
    }
    if (/weekly|regular/i.test(lowerQuery)) {
        orConditions.push({ wateringFrequency: 'Weekly' });
    }
    if (/twice a week|frequent|moist|damp/i.test(lowerQuery)) {
        orConditions.push({ wateringFrequency: 'Bi-Weekly' });
    }
    if (/daily|constant|wet|water loving/i.test(lowerQuery)) {
        orConditions.push({ wateringFrequency: 'Daily' });
    }

    // Humidity
    if (/dry air|low humidity|arid/i.test(lowerQuery)) {
        orConditions.push({ humidity: 'Low' });
    }
    if (/normal humidity|average moisture/i.test(lowerQuery)) {
        orConditions.push({ humidity: 'Medium' });
    }
    if (/humid|moist air|bathroom|kitchen|terrarium|jungle/i.test(lowerQuery)) {
        orConditions.push({ humidity: 'High' });
    }

    // Special Features
    if (/pet friendly|cat safe|dog safe|non-toxic|child friendly|safe/i.test(lowerQuery)) {
        orConditions.push({ petFriendly: true });
    }
    if (/air purify|clean air|air quality|nasa/i.test(lowerQuery)) {
        orConditions.push({ purifyingAir: true });
    }

    // Size
    if (/small|tiny|desktop|miniature/i.test(lowerQuery)) {
        orConditions.push({ heightCm: { $lt: 30 } });
        orConditions.push({ potSize: 'Small' });
    }
    if (/medium size|average height/i.test(lowerQuery)) {
        orConditions.push({ heightCm: { $gte: 30, $lt: 100 } });
        orConditions.push({ potSize: 'Medium' });
    }
    if (/large|tall|big|statement/i.test(lowerQuery)) {
        orConditions.push({ heightCm: { $gte: 100 } });
        orConditions.push({ potSize: { $in: ['Large', 'Extra Large'] } });
    }

    // Specific conditions for bedroom, bathroom, etc.
    if (/bedroom|sleep|calming|relaxing/i.test(lowerQuery)) {
        orConditions.push({ 
            $or: [
                { purifyingAir: true },
                { category: 'Foliage' },
                { tags: { $in: ['calming', 'bedroom', 'air purifying'] } }
            ]
        });
    }
    if (/bathroom|shower|humid room/i.test(lowerQuery)) {
        orConditions.push({ 
            $or: [
                { humidity: 'High' },
                { category: { $in: ['Tropical', 'Fern'] } },
                { tags: { $in: ['bathroom', 'humidity loving'] } }
            ]
        });
    }
    if (/kitchen|cooking|herbs/i.test(lowerQuery)) {
        orConditions.push({ 
            $or: [
                { category: 'Herb' },
                { tags: { $in: ['kitchen', 'edible', 'herbs'] } }
            ]
        });
    }
    if (/office|desk|work/i.test(lowerQuery)) {
        orConditions.push({ 
            $or: [
                { lightRequirement: { $in: ['Low', 'Medium'] } },
                { heightCm: { $lt: 50 } },
                { tags: { $in: ['office', 'desk', 'focus', 'productivity'] } }
            ]
        });
    }

    // Description keywords (more generic)
    if (/trendy|popular|instagram/i.test(lowerQuery)) {
        orConditions.push({ 
            $or: [
                { tags: { $in: ['trending', 'popular', 'instagram worthy'] } },
                { bestSeller: true }
            ]
        });
    }
    
    // Add description search as a fallback for anything not matched
    if (orConditions.length === 0) {
        // If no specific criteria matched, search by description/name using keywords
        const keywords = lowerQuery.split(/\s+/).filter(word => word.length > 3);
        
        if (keywords.length > 0) {
            const keywordQueries = keywords.map(keyword => ({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                    { tags: { $regex: keyword, $options: 'i' } }
                ]
            }));
            orConditions.push(...keywordQueries);
        }
    }

    // Filter by stock by default
    filter.inStock = true;
    
    // Add all OR conditions
    if (orConditions.length > 0) {
        filter.$or = orConditions;
    }

    console.log('Constructed Mongo Query:', JSON.stringify(filter, null, 2));
    return filter;
};

// Generate custom reasons for recommendations based on query and plant attributes
const generateRecommendationReason = (plant, query) => {
    const queryLower = query.toLowerCase();
    const reasons = [];

    // Check for light conditions
    if (/low light|shade|dark|dim/i.test(queryLower) && plant.lightRequirement === 'Low') {
        reasons.push("thrives in low light conditions");
    } else if (/bright|sunny|window/i.test(queryLower) && plant.lightRequirement === 'Bright Indirect') {
        reasons.push("perfect for your bright space");
    }

    // Check for care level
    if (/beginner|easy|low maintenance/i.test(queryLower) && plant.careLevel === 'Easy') {
        reasons.push("very easy to care for, perfect for beginners");
    } else if (/expert|advanced/i.test(queryLower) && plant.careLevel === 'Expert') {
        reasons.push("provides a rewarding challenge for experienced plant parents");
    }

    // Check for special features
    if (/pet|cat|dog/i.test(queryLower) && plant.petFriendly) {
        reasons.push("safe for pets");
    }
    if (/air|purify|clean/i.test(queryLower) && plant.purifyingAir) {
        reasons.push("excellent at purifying air");
    }

    // Check for specific locations
    if (/bedroom|sleep/i.test(queryLower)) {
        reasons.push("ideal for bedrooms with its calming presence");
    } else if (/bathroom|shower/i.test(queryLower) && plant.humidity === 'High') {
        reasons.push("thrives in bathroom humidity");
    } else if (/office|desk/i.test(queryLower) && plant.heightCm < 50) {
        reasons.push("compact size makes it perfect for desks and offices");
    }

    // If no specific reasons found, generate a generic one
    if (reasons.length === 0) {
        if (plant.bestSeller) {
            reasons.push("one of our most popular choices");
        } else if (plant.newArrival) {
            reasons.push("a beautiful new addition to our collection");
        } else {
            reasons.push(`a ${plant.careLevel.toLowerCase()}-care ${plant.category.toLowerCase()} plant`);
        }
    }

    return `This ${plant.name} is ${reasons.join(" and ")}.`;
};

// @desc    Get plant recommendations based on user query
// @route   POST /api/recommendations
// @access  Private (Requires Login)
const getRecommendation = asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401);
      throw new Error('User not authorized');
    }
    
    const { userQuery } = req.body;

    if (!userQuery) {
        res.status(400);
        throw new Error('Please provide a query for recommendations');
    }

    // Build the filter based on the user query
    const queryFilter = buildMongoQuery(userQuery);

    // Find matching plants in the database with sorting
    let matchedPlants = await Plant.find(queryFilter)
        .sort({ rating: -1, bestSeller: -1 }) // Sort by rating and bestseller status
        .limit(8); // Increased limit for more diversity

    // If no plants found, try a broader search
    if (matchedPlants.length === 0) {
        console.log('No matching plants found, trying broader search...');
        
        // Try a broader search by removing specific filters and keeping just text search
        const broadFilter = {
            inStock: true,
            $text: { $search: userQuery }
        };
        
        // First check if we have a text index
        const textIndexExists = await Plant.collection.indexExists('name_text_description_text_tags_text');
        
        if (textIndexExists) {
            matchedPlants = await Plant.find(broadFilter)
                .sort({ score: { $meta: "textScore" } })
                .limit(8);
        } else {
            // Fallback to a simple regex search if no text index
            matchedPlants = await Plant.find({ 
                inStock: true,
                $or: [
                    { name: { $regex: userQuery, $options: 'i' } },
                    { description: { $regex: userQuery, $options: 'i' } }
                ]
            }).limit(8);
        }
    }
    
    // Add diversity if we have many similar plants
    if (matchedPlants.length > 3) {
        // Try to ensure diverse categories
        const categoryCounts = {};
        matchedPlants.forEach(plant => {
            categoryCounts[plant.category] = (categoryCounts[plant.category] || 0) + 1;
        });
        
        // If any category has more than 2 plants, try to add plants from underrepresented categories
        const overrepresentedCategories = Object.keys(categoryCounts).filter(cat => categoryCounts[cat] > 2);
        
        if (overrepresentedCategories.length > 0) {
            // Get additional plants from other categories
            const diversePlants = await Plant.find({
                inStock: true,
                category: { $nin: overrepresentedCategories }
            }).limit(3);
            
            // Replace some of the overrepresented plants with diverse ones
            if (diversePlants.length > 0) {
                let replacementCount = 0;
                const finalPlants = [];
                
                // Keep first 5 matched plants
                for (let i = 0; i < Math.min(5, matchedPlants.length); i++) {
                    finalPlants.push(matchedPlants[i]);
                }
                
                // Add up to 3 diverse plants
                for (let i = 0; i < diversePlants.length && finalPlants.length < 8; i++) {
                    finalPlants.push(diversePlants[i]);
                }
                
                matchedPlants = finalPlants;
            }
        }
    }

    // Format the response with personalized reasons
    const recommendations = matchedPlants.map(plant => ({
        name: plant.name,
        scientificName: plant.scientificName,
        reason: generateRecommendationReason(plant, userQuery),
        careTip: `Water ${plant.wateringFrequency.toLowerCase()} and provide ${plant.lightRequirement.toLowerCase()} light.`,
        image: plant.image,
        price: plant.price,
        salePrice: plant.salePrice,
        rating: plant.rating,
        tags: plant.tags,
        category: plant.category,
        petFriendly: plant.petFriendly,
        purifyingAir: plant.purifyingAir,
        _id: plant._id 
    }));

    if (recommendations.length === 0) {
        console.log('No plants found even with broad search for query:', userQuery);
    }

    res.status(200).json({ success: true, data: recommendations });
});

module.exports = {
    getRecommendation
}; 