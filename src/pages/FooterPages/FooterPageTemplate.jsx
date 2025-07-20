import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import AnimatedSection from '../../components/AnimatedSection';

const FooterPageTemplate = ({ 
  title, 
  subtitle, 
  children, 
  breadcrumbItems = [], 
  showBackLink = true,
  bgColor = "bg-gradient-to-br from-primary-50/50 via-white to-cyan-50/30 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900/90"
}) => {
  return (
    <AnimatedSection 
      animation="fade-in" 
      className={`min-h-screen ${bgColor} py-12 md:py-16 px-4 sm:px-6`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs and back button */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div>
            {breadcrumbItems.length > 0 && (
              <nav className="flex items-center text-sm">
                <Link 
                  to="/" 
                  className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Home
                </Link>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <span className="mx-2 text-gray-400">/</span>
                    {item.href ? (
                      <Link 
                        to={item.href} 
                        className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
          </div>
          
          {showBackLink && (
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          )}
        </div>

        {/* Page Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-display">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="mt-6 w-24 h-1 bg-primary-gradient mx-auto rounded-full"></div>
        </motion.div>

        {/* Page Content */}
        <motion.div
          className="prose dark:prose-invert prose-lg max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default FooterPageTemplate; 