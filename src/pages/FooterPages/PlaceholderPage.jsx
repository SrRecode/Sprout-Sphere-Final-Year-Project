import React from 'react';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import FooterPageTemplate from './FooterPageTemplate';
import AnimatedButton from '../../components/AnimatedButton';

const PlaceholderPage = ({ 
  title = "Page Under Construction", 
  subtitle = "We're working on bringing you great content", 
  breadcrumbItems = [] 
}) => {
  return (
    <FooterPageTemplate
      title={title}
      subtitle={subtitle}
      breadcrumbItems={breadcrumbItems}
    >
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-100 dark:bg-dark-800/50 p-8 rounded-2xl mb-8 inline-flex"
        >
          <Construction className="w-24 h-24 text-primary-500" />
        </motion.div>
        
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Coming Soon!</h2>
        
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mb-8">
          We're currently developing this page to provide you with valuable information and resources. 
          Please check back soon for updates!
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <AnimatedButton 
            as="a" 
            href="/" 
            variant="outlinePrimary"
          >
            Return to Home
          </AnimatedButton>
          
          <AnimatedButton 
            as="a" 
            href="/contact" 
            variant="primary"
          >
            Contact Us
          </AnimatedButton>
        </div>
        
        <div className="mt-16 p-6 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-100 dark:border-primary-800 max-w-2xl">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Looking for something specific?</h3>
          <p className="text-gray-700 dark:text-gray-300">
            While this page is under construction, you might find what you're looking for in our 
            <a href="/faqs" className="text-primary-600 dark:text-primary-400 hover:underline mx-1">FAQs</a> 
            or by exploring our 
            <a href="/ai-recommendations" className="text-primary-600 dark:text-primary-400 hover:underline mx-1">AI Recommendations</a> 
            feature.
          </p>
        </div>
      </div>
    </FooterPageTemplate>
  );
};

export default PlaceholderPage; 