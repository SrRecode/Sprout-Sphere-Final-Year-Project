const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const { generatePlantResponse } = require('../services/openaiService');
const { getPlantImage } = require('../services/imageService');

// @desc    Send a message to the plant care chatbot
// @route   POST /api/plant-chat
// @access  Public
const sendMessage = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;
  
  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  try {
    // Generate response using OpenAI/DeepSeek
    const aiResponse = await generatePlantResponse(message);
    
    // First, send the text response without images
    const initialResponse = {
      message: aiResponse.message,
      recommendations: aiResponse.recommendations ? aiResponse.recommendations.map(plant => ({
        ...plant,
        image: '' // No images in initial response
      })) : [],
      pendingImages: aiResponse.recommendations && aiResponse.recommendations.length > 0
    };
    
    // Create or update chat session
    try {
      let chat = await Chat.findOne({ sessionId });
      
      if (!chat) {
        // Create new chat session
        chat = await Chat.create({
          sessionId,
          messages: [
            {
              type: 'user',
              content: message,
              timestamp: new Date()
            },
            {
              type: 'bot',
              content: aiResponse.message,
              recommendations: initialResponse.recommendations,
              timestamp: new Date()
            }
          ]
        });
      } else {
        // Add messages to existing chat
        chat.messages.push(
          {
            type: 'user',
            content: message,
            timestamp: new Date()
          },
          {
            type: 'bot',
            content: aiResponse.message,
            recommendations: initialResponse.recommendations,
            timestamp: new Date()
          }
        );
        await chat.save();
      }
    } catch (dbError) {
      // If database operations fail, log the error but don't block the response
      console.error('Error saving to database:', dbError);
    }
    
    // Return the initial response without images
    res.status(200).json(initialResponse);
    
    // Process images in the background if there are recommendations
    if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
      try {
        // This code will run after the response has been sent
        const processedRecommendations = await Promise.all(
          aiResponse.recommendations.map(async (plant) => {
            try {
              const imageUrl = await getPlantImage(plant.name);
              return {
                ...plant,
                image: imageUrl
              };
            } catch (imageError) {
              console.error(`Error getting image for ${plant.name}:`, imageError);
              return {
                ...plant,
                image: '' // Default empty image URL
              };
            }
          })
        );
        
        // Update the chat record with the images
        const updatedChat = await Chat.findOne({ sessionId });
        if (updatedChat) {
          // Find the last bot message and update its recommendations
          const lastBotMessageIndex = updatedChat.messages
            .map((msg, index) => ({ type: msg.type, index }))
            .filter(msg => msg.type === 'bot')
            .pop();
            
          if (lastBotMessageIndex) {
            updatedChat.messages[lastBotMessageIndex.index].recommendations = processedRecommendations;
            await updatedChat.save();
          }
        }
      } catch (backgroundError) {
        console.error('Error processing images in background:', backgroundError);
      }
    }
  } catch (error) {
    console.error('Error in sendMessage:', error);
    
    // Determine the appropriate error message based on the error type
    let statusCode = 500;
    let errorMessage = 'Failed to process message';
    
    if (error.message.includes('API key')) {
      errorMessage = 'AI service authentication failed. Please check API configuration.';
    } else if (error.message.includes('rate limit')) {
      errorMessage = 'AI service rate limit exceeded. Please try again later.';
    } else if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
      errorMessage = 'AI service connection timed out. Please try again later.';
    }
    
    res.status(statusCode);
    throw new Error(errorMessage);
  }
});

// @desc    Get chat history for a session
// @route   GET /api/plant-chat/:sessionId
// @access  Public
const getChatHistory = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  
  try {
    const chat = await Chat.findOne({ sessionId });
    
    if (!chat) {
      res.status(200).json({ messages: [] });
      return;
    }
    
    // Return all messages with their full recommendation data
    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500);
    throw new Error('Failed to retrieve chat history');
  }
});

// @desc    Clear chat history for a session
// @route   DELETE /api/plant-chat/:sessionId
// @access  Public
const clearChatHistory = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  
  await Chat.deleteOne({ sessionId });
  
  res.status(200).json({ message: 'Chat history cleared' });
});

module.exports = {
  sendMessage,
  getChatHistory,
  clearChatHistory
}; 