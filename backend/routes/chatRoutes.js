const express = require('express');
const router = express.Router();
const { 
  sendMessage, 
  getChatHistory, 
  clearChatHistory 
} = require('../controllers/chatController');

const { getPlantImage } = require('../services/imageService');

// @route   POST /api/plant-chat
// @desc    Send a message to the plant care chatbot
// @access  Public
router.post('/', sendMessage);

// @route   GET /api/plant-chat/image/:plantName
// @desc    Get an image for a specific plant
// @access  Public
router.get('/image/:plantName', async (req, res) => {
  try {
    const { plantName } = req.params;
    if (!plantName) {
      return res.status(400).json({ error: 'Plant name is required' });
    }
    
    const imageUrl = await getPlantImage(plantName);
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error fetching plant image:', error);
    res.status(500).json({ error: 'Failed to fetch plant image' });
  }
});

// @route   GET /api/plant-chat/:sessionId
// @desc    Get chat history for a session
// @access  Public
router.get('/:sessionId', getChatHistory);

// @route   DELETE /api/plant-chat/:sessionId
// @desc    Clear chat history for a session
// @access  Public
router.delete('/:sessionId', clearChatHistory);

module.exports = router; 