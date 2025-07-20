const axios = require('axios');

// Function to generate plant care responses using DeepSeek API with fallback
const generatePlantResponse = async (userMessage) => {
  try {
    console.log('Received user message:', userMessage);
    
    // Improved detection for plant recommendation requests
    const userMessageLower = userMessage.toLowerCase();
    const isRecommendationRequest = 
      userMessageLower.includes('recommend') || 
      userMessageLower.includes('suggest') || 
      userMessageLower.includes('what plant') ||
      userMessageLower.includes('looking for') ||
      userMessageLower.includes('want plant') ||
      userMessageLower.includes('need plant') ||
      userMessageLower.includes('i want') ||
      userMessageLower.includes('best plant') ||
      userMessageLower.includes('good plant') ||
      (userMessageLower.includes('plant') && 
        (userMessageLower.includes('low light') || 
         userMessageLower.includes('indoor') || 
         userMessageLower.includes('outdoor') || 
         userMessageLower.includes('beginner') || 
         userMessageLower.includes('easy') ||
         userMessageLower.includes('bathroom') ||
         userMessageLower.includes('bedroom') ||
         userMessageLower.includes('kitchen')));
    
    console.log(`Is recommendation request: ${isRecommendationRequest}`);

    // Create the system prompt based on the type of request
    const systemPrompt = isRecommendationRequest
      ? `You are a plant care expert. Based on the user's input, provide 3 plant names suitable for their specific needs or environment (e.g., indoor, low light, beginner-friendly) with a care tip for each. Show the name, scientific name, reason, and care tip clearly. Format your response as JSON with the following structure:
      {
        "message": "A friendly introduction addressing their specific plant needs",
        "recommendations": [
          {
            "name": "Plant Name",
            "scientificName": "Scientific Name",
            "reason": "Why this plant is suitable for their specific request",
            "careTip": "A specific care tip for this plant"
          }
        ]
      }`
      : `You are a plant care expert. Answer questions clearly and concisely. Format your response as JSON with the following structure:
      {
        "message": "Your helpful response to the user's question"
      }`;

    try {
      console.log('Attempting to use DeepSeek API...');
      // Call DeepSeek API
      const response = await axios.post(
        'https://api.deepseek.ai/v1/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
          }
        }
      );

      console.log('DeepSeek API response received');
      // Extract the response content
      const content = response.data.choices[0].message.content;
      console.log('Raw response:', content.substring(0, 200) + '...');
      
      // Parse the JSON response
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Error parsing DeepSeek response:', parseError);
        console.log('Raw response content:', content);
        // If we can't parse the JSON, return a formatted response
        return isRecommendationRequest 
          ? {
              message: "I couldn't format plant recommendations properly, but I can suggest plants for your needs.",
              recommendations: [
                {
                  name: userMessageLower.includes('low light') ? "Snake Plant" : "Spider Plant",
                  scientificName: userMessageLower.includes('low light') ? "Sansevieria trifasciata" : "Chlorophytum comosum",
                  reason: userMessageLower.includes('low light') 
                    ? "Thrives in low light conditions and is very low maintenance" 
                    : "Adaptable to various light conditions and easy to care for",
                  careTip: userMessageLower.includes('low light')
                    ? "Water only when soil is completely dry, typically every 2-3 weeks"
                    : "Water when the top inch of soil is dry, usually once a week"
                },
                {
                  name: userMessageLower.includes('low light') ? "ZZ Plant" : "Pothos",
                  scientificName: userMessageLower.includes('low light') ? "Zamioculcas zamiifolia" : "Epipremnum aureum",
                  reason: userMessageLower.includes('low light')
                    ? "Extremely tolerant of low light conditions"
                    : "Very adaptable and grows well in various environments",
                  careTip: userMessageLower.includes('low light')
                    ? "Water sparingly, only when soil is completely dry"
                    : "Allow soil to dry out between waterings"
                },
                {
                  name: userMessageLower.includes('low light') ? "Peace Lily" : "Aloe Vera",
                  scientificName: userMessageLower.includes('low light') ? "Spathiphyllum" : "Aloe barbadensis miller",
                  reason: userMessageLower.includes('low light')
                    ? "Can thrive in low light and helps purify the air"
                    : "Easy to care for succulent with medicinal properties",
                  careTip: userMessageLower.includes('low light')
                    ? "Keep soil consistently moist but not soggy, and mist leaves occasionally"
                    : "Water deeply but infrequently, allowing soil to dry completely between waterings"
                }
              ]
            }
          : {
              message: content,
              recommendations: []
            };
      }
    } catch (apiError) {
      console.error('DeepSeek API error:', apiError.response ? apiError.response.data : apiError.message);
      console.log('Falling back to mock responses...');
      
      // Fallback to mock responses with better context awareness
      if (isRecommendationRequest) {
        // Customize mock response based on user query
        const lowLightRequest = userMessageLower.includes('low light');
        const beginnerRequest = userMessageLower.includes('beginner') || userMessageLower.includes('easy');
        
        let responseMessage = "Based on your request, ";
        if (lowLightRequest) {
          responseMessage += "here are three excellent plants for low light conditions:";
        } else if (beginnerRequest) {
          responseMessage += "here are three beginner-friendly plants that are easy to care for:";
        } else {
          responseMessage += "here are three plant recommendations that might work well for you:";
        }
        
        return {
          message: responseMessage,
          recommendations: lowLightRequest ? [
            {
              name: "Snake Plant",
              scientificName: "Sansevieria trifasciata",
              reason: "Extremely tolerant of low light conditions and neglect",
              careTip: "Water only when soil is completely dry, typically every 2-3 weeks"
            },
            {
              name: "ZZ Plant",
              scientificName: "Zamioculcas zamiifolia",
              reason: "Thrives in low light and requires minimal care",
              careTip: "Water sparingly, only when soil is completely dry - overwatering is its main enemy"
            },
            {
              name: "Pothos",
              scientificName: "Epipremnum aureum",
              reason: "Adaptable to low light conditions and very forgiving",
              careTip: "Allow soil to dry out between waterings and trim occasionally to promote bushier growth"
            }
          ] : beginnerRequest ? [
            {
              name: "Spider Plant",
              scientificName: "Chlorophytum comosum",
              reason: "Nearly indestructible and perfect for beginners",
              careTip: "Water when the top inch of soil is dry, and place in indirect light"
            },
            {
              name: "Pothos",
              scientificName: "Epipremnum aureum",
              reason: "Very forgiving and can tolerate a range of conditions",
              careTip: "Allow soil to dry out between waterings and trim occasionally to promote bushier growth"
            },
            {
              name: "Aloe Vera",
              scientificName: "Aloe barbadensis miller",
              reason: "Easy succulent that's hard to kill and has medicinal uses",
              careTip: "Water deeply but infrequently, allowing soil to dry completely between waterings"
            }
          ] : [
            {
              name: "Snake Plant",
              scientificName: "Sansevieria trifasciata",
              reason: "Low maintenance and thrives in almost any light condition",
              careTip: "Water only when soil is completely dry, typically every 2-3 weeks"
            },
            {
              name: "Pothos",
              scientificName: "Epipremnum aureum",
              reason: "Very adaptable and grows well in various environments",
              careTip: "Allow soil to dry out between waterings and trim occasionally to promote bushier growth"
            },
            {
              name: "ZZ Plant",
              scientificName: "Zamioculcas zamiifolia",
              reason: "Extremely drought-tolerant and does well in low light",
              careTip: "Water sparingly, only when soil is completely dry - overwatering is its main enemy"
            }
          ]
        };
      } else {
        return {
          message: `Thank you for your question about "${userMessage}". Plants generally need adequate light, proper watering (not too much or too little), well-draining soil, and occasional fertilization. Make sure to research your specific plant's needs as they can vary greatly between species.`,
          recommendations: []
        };
      }
    }
  } catch (error) {
    console.error('Error in generatePlantResponse:', error);
    throw new Error('Failed to generate response. Please try again later.');
  }
};

module.exports = {
  generatePlantResponse
}; 