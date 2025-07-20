import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import FooterPageTemplate from './FooterPageTemplate';
import AnimatedButton from '../../components/AnimatedButton';

const FAQsPage = () => {
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // FAQ categories
  const categories = [
    { id: 'all', label: 'All FAQs' },
    { id: 'general', label: 'General' },
    { id: 'account', label: 'Account' },
    { id: 'orders', label: 'Orders & Shipping' },
    { id: 'plants', label: 'Plant Care' },
    { id: 'ai', label: 'AI Recommendations' }
  ];

  // FAQ items
  const faqItems = [
    {
      category: 'general',
      question: 'What is SproutSphere?',
      answer: 'SproutSphere is a comprehensive platform for plant enthusiasts, offering AI-powered plant recommendations, a curated plant store, and a community hub. Our mission is to make plant care accessible to everyone, from beginners to experienced gardeners.'
    },
    {
      category: 'general',
      question: 'Is SproutSphere available worldwide?',
      answer: 'Yes, SproutSphere\'s digital features like AI plant recommendations and community hub are available worldwide. However, our plant store shipping is currently limited to the United States and Canada. We\'re working on expanding our shipping capabilities to more countries soon.'
    },
    {
      category: 'general',
      question: 'How do I contact customer support?',
      answer: 'You can contact our customer support team by emailing hello@sproutsphere.com, calling (555) 123-4567 during business hours (Monday-Friday, 9am-5pm PST), or by using the contact form on our Contact Us page. We aim to respond to all inquiries within 24 hours on business days.'
    },
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'To create an account, click on the "Sign Up" button in the top-right corner of the website. You\'ll need to provide your name, email address, and a secure password. You can also sign up using your Google or Facebook account for a quicker registration process.'
    },
    {
      category: 'account',
      question: 'Can I use SproutSphere without creating an account?',
      answer: 'Yes, you can browse our plant store and access basic information without an account. However, features like AI plant recommendations, saving your plant collection, participating in the community, and making purchases require an account.'
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'If you forgot your password, click on the "Login" button, then select "Forgot password?" link below the login form. Enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
    },
    {
      category: 'orders',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days within the continental United States. Express shipping options (2-day and overnight) are also available at checkout for an additional fee. International shipping to Canada takes approximately 7-10 business days.'
    },
    {
      category: 'orders',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day satisfaction guarantee. If you\'re not satisfied with your purchase, you can return it within 30 days for a full refund. Plants must be returned in their original condition. For plant health issues upon arrival, please contact us within 48 hours with photos to receive a replacement or refund.'
    },
    {
      category: 'orders',
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a shipping confirmation email with a tracking number. You can also view your order status and tracking information in your account dashboard under "My Orders". If you have any issues tracking your order, please contact our customer support team.'
    },
    {
      category: 'plants',
      question: 'How often should I water my plants?',
      answer: 'Watering frequency depends on the specific plant, its environment, and the season. Most houseplants need watering when the top 1-2 inches of soil feels dry to the touch. Our AI recommendations provide personalized watering schedules for your specific plants, and each plant in our store includes care instructions with watering guidelines.'
    },
    {
      category: 'plants',
      question: 'Why are the leaves on my plant turning yellow?',
      answer: 'Yellowing leaves can have several causes, including overwatering (the most common cause), underwatering, too much direct sunlight, nutrient deficiencies, or pests. Check the soil moisture first—if it\'s soggy, allow the plant to dry out. For more specific advice, use our AI plant care assistant with a photo of your plant for a detailed diagnosis.'
    },
    {
      category: 'plants',
      question: 'What plants are good for beginners?',
      answer: 'Great beginner-friendly plants include Snake Plants, Pothos, ZZ Plants, Spider Plants, and Succulents. These plants are resilient, tolerant of inconsistent watering, and can thrive in various light conditions. Our AI recommendation tool can suggest specific beginner-friendly plants based on your living space and lifestyle.'
    },
    {
      category: 'ai',
      question: 'How does the AI plant recommendation feature work?',
      answer: 'Our AI plant recommendation system uses advanced algorithms to analyze your inputs about your space (light conditions, humidity, temperature), your lifestyle (how often you can water, travel frequency), and preferences (size, style, benefits) to suggest plants that will thrive in your specific environment. The more information you provide, the more personalized your recommendations will be.'
    },
    {
      category: 'ai',
      question: 'Can the AI help diagnose problems with my plants?',
      answer: 'Yes! Our AI can help diagnose common plant problems. Simply upload a photo of your plant, describe the symptoms you\'re observing, and the AI will analyze the image to identify potential issues like pest infestations, diseases, or care-related problems. It will then provide recommendations for treatment and recovery.'
    },
    {
      category: 'ai',
      question: 'How accurate are the AI plant recommendations?',
      answer: 'Our AI recommendations are highly accurate, with a satisfaction rate of over 90% among users. The system is continuously learning and improving based on user feedback and outcomes. However, remember that plant care is both a science and an art—you may need to make adjustments based on your specific conditions and observation of your plants.'
    }
  ];

  // Toggle FAQ item open/closed
  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Filter FAQs based on search query and category
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <FooterPageTemplate
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about SproutSphere"
      breadcrumbItems={[{ label: 'FAQs' }]}
    >
      {/* Search Bar */}
      <div className="mb-10">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100"
            placeholder="Search for questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto mb-16">
        {filteredFAQs.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredFAQs.map((item, index) => (
              <div key={index} className="py-5">
                <button
                  onClick={() => toggleItem(index)}
                  className="flex justify-between items-center w-full text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.question}</h3>
                  <motion.div
                    animate={{ rotate: openItems[index] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-2"
                  >
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openItems[index] && (
                    <motion.div
                      key={`answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-gray-600 dark:text-gray-400">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-800 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find any FAQs matching your search. Try using different keywords or browsing by category.
            </p>
            <AnimatedButton 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              variant="outlinePrimary"
            >
              Reset Filters
            </AnimatedButton>
          </div>
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="bg-gray-50 dark:bg-dark-800/50 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
          <MessageCircle className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Still Have Questions?</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-6">
          If you couldn't find the answer you were looking for, our support team is here to help.
        </p>
        <AnimatedButton 
          as="a" 
          href="/contact" 
          variant="primary"
        >
          Contact Us
        </AnimatedButton>
      </div>
    </FooterPageTemplate>
  );
};

export default FAQsPage; 