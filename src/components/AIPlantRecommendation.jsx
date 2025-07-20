import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { 
  Send, 
  User, 
  Bot, 
  RotateCcw, 
  Download, 
  Sparkles, 
  XCircle,
  Lightbulb,
  Droplets,
  Sun,
  Home,
  Ruler,
  Save,
  RefreshCw,
  Loader2,
  Leaf
} from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import AnimatedCard from './AnimatedCard';
import AnimatedSection from './AnimatedSection';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

const AIPlantRecommendation = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "👋 Hello! I'm your plant recommendation assistant. Tell me about your living space, light conditions, experience level, or what you're looking for in a plant, and I'll suggest perfect matches for you!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize session ID
  useEffect(() => {
    const savedSessionId = localStorage.getItem('plantAiSessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      const newId = uuidv4();
      localStorage.setItem('plantAiSessionId', newId);
      setSessionId(newId);
    }
  }, []);

  // Load chat history
  useEffect(() => {
    if (sessionId) {
      const savedHistory = localStorage.getItem(`plantAiHistory-${sessionId}`);
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          setMessages(parsedHistory);
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      }
    }
  }, [sessionId]);

  // Save chat history
  useEffect(() => {
    if (sessionId && messages.length > 1) {
      localStorage.setItem(`plantAiHistory-${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const token = localStorage.getItem('sproutSphereToken');
      const response = await axios.post(`${API_URL}/recommendations`, {
        userQuery: input
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        let botMessage = { 
          role: 'bot', 
          content: `Based on your request, here are some plant recommendations that would be perfect for you!` 
        };
        
        // Check if response includes plant recommendations
        if (response.data.data && response.data.data.length > 0) {
          botMessage.plants = response.data.data;
        }
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.data?.message || 'Failed to get recommendations');
      }
    } catch (err) {
      console.error('AI Recommendation error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Something went wrong with the plant recommendation service';
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: errorMsg
      }]);
    } finally {
      setLoading(false);
    }
  }

  const handleResetChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      const newId = uuidv4()
      localStorage.setItem('plantAiSessionId', newId)
      localStorage.removeItem(`plantAiHistory-${sessionId}`)
      setSessionId(newId)
      setMessages([
        {
          role: 'bot',
          content: "👋 Hello! I'm your plant recommendation assistant. Tell me about your living space, light conditions, experience level, or what you're looking for in a plant, and I'll suggest perfect matches for you!"
        }
      ])
      setInput('')
      setLoading(false)
    }
  }

  const handleSaveChat = () => {
    const chatText = messages
      .map(msg => `${msg.role === 'user' ? 'You' : 'PlantAI'}: ${msg.content}`)
      .join('\n\n')
    
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `plant-ai-chat-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user'
    const isError = message.role === 'error'
    
    return (
      <div 
        key={index}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div 
          className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] ${isError ? 'items-center' : 'items-start'}`}
        >
          {/* Avatar for user or bot */}
          <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
            <div className={`
              h-10 w-10 rounded-full flex items-center justify-center
              ${isUser 
                ? 'bg-primary-gradient text-white' 
                : isError 
                  ? 'bg-red-500 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              }
            `}>
              {isUser ? (
                <User className="h-5 w-5" />
              ) : isError ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <Bot className="h-5 w-5" />
              )}
            </div>
          </div>
          
          {/* Message content */}
          <div>
            <div 
              className={`
                rounded-2xl px-4 py-3 
                ${isUser
                  ? 'bg-primary-gradient text-white'
                  : isError
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50'
                    : 'bg-white dark:bg-dark-800/80 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                }
              `}
            >
              <div className="text-sm whitespace-pre-line">
                {message.content}
              </div>
            </div>
            
            {/* Plant recommendations cards */}
            {message.plants && message.plants.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {message.plants.map((plant, idx) => (
                  <div 
                    key={idx}
                    className="bg-white dark:bg-dark-800/80 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800">
                      <img 
                        src={plant.image || 'https://placehold.co/300x200/4ADE80/FFFFFF.png?text=Plant+Image'} 
                        alt={plant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="text-gray-900 dark:text-white font-medium mb-1">{plant.name}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-xs italic mb-2">{plant.scientificName}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full">
                          <Sun className="h-3 w-3 mr-1 text-yellow-500" />
                          <span>{plant.lightNeeds}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full">
                          <Droplets className="h-3 w-3 mr-1 text-blue-500" />
                          <span>{plant.waterNeeds}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full">
                          <Ruler className="h-3 w-3 mr-1 text-purple-500" />
                          <span>{plant.size}</span>
                        </div>
                      </div>
                      {plant.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{plant.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderSuggestions = () => {
    const suggestions = [
      "I need a plant that's hard to kill for my apartment.",
      "What are some good plants for a sunny bathroom?",
      "I have a cat. What plants are safe and non-toxic?",
      "I'm a beginner. What's the easiest plant to start with?",
      "Which plants help purify the air the most?"
    ]
    
    return (
      <div className="mb-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(suggestion)
              // inputRef.current?.focus() // This line was removed as per the new_code
            }}
            className="text-xs bg-white dark:bg-dark-800/80 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    )
  }

  return (
    <AnimatedSection className="min-h-[calc(100vh-10rem)] bg-dark-700 dark:bg-dark-800/50 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary-gradient rounded-full shadow-lg mb-6">
            <Leaf className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white dark:text-white sm:text-5xl md:text-6xl mb-4">
            AI Plant <span className="text-primary-gradient">Recommendations</span>
          </h1>
          <p className="mt-4 text-xl text-primary-gradient dark:text-gray-300 max-w-3xl mx-auto">
            Get personalized plant suggestions based on your space, lifestyle, and preferences.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-dark-800/80 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Chat header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3">
                <Bot className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Plant AI Assistant</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Powered by intelligent plant database</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleSaveChat}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full transition-colors"
                title="Save conversation"
              >
                <Save className="h-5 w-5" />
              </button>
              <button 
                onClick={handleResetChat}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Messages area */}
          <div className="h-[400px] md:h-[500px] overflow-y-auto p-4 bg-gray-50 dark:bg-dark-900/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Bot className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No messages yet</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-md mb-4">
                  Start a conversation with the AI assistant to get personalized plant recommendations.
                </p>
                {renderSuggestions()}
              </div>
            ) : (
              <>
                {messages.map(renderMessage)}
                {loading && (
                  <div className="flex justify-start mb-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                          <Bot className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="bg-white dark:bg-dark-800/80 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-500 dark:text-gray-400" />
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            {messages.length === 1 && messages[0].role === 'bot' && (
              renderSuggestions()
            )}
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                // ref={inputRef} // This line was removed as per the new_code
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your space or what you're looking for..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-full focus:ring-primary-500 focus:border-primary-500 dark:text-white"
                disabled={loading}
              />
              <AnimatedButton
                type="submit"
                variant="icon"
                className="absolute right-1 top-1 bg-primary-gradient text-white"
                disabled={loading || !input.trim()}
              >
                <Send className="h-5 w-5" />
              </AnimatedButton>
            </form>
            <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              AI recommendations are based on general plant care knowledge. Please research specific plant care instructions for best results.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default AIPlantRecommendation