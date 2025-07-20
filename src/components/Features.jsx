import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import plantAnimation from '../assets/animations/plant.json';
import { Leaf, ShoppingBag, Users, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import AnimatedCard from './AnimatedCard';

const FeatureCard = ({ title, description, icon, children }) => {
  return (
    <AnimatedCard className="group relative p-6 rounded-xl bg-dark-500 dark:bg-dark-800/50 shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 h-full">
      {/* Gradient hover effect */}
      <div className="absolute inset-0 bg-primary-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-500 ease-smooth" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-full bg-primary-gradient/10">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-white dark:text-white">{title}</h3>
        </div>
        <p className="text-white dark:text-gray-300 mb-6">{description}</p>
        {children}
      </div>
    </AnimatedCard>
  );
};

const Features = () => {
  return (
    <AnimatedSection className="py-20 bg-dark-700 dark:bg-dark-800/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white dark:text-white mb-4">
            Discover Our <span className="text-primary-gradient">Features</span>
          </h2>
          <p className="text-xl text-white dark:text-gray-300 max-w-2xl mx-auto">
            Experience the future of plant care with our innovative features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="AI Plant Care"
            description="Get personalized care recommendations powered by advanced AI technology"
            icon={<Leaf className="w-6 h-6 text-primary-400" />}
          >
            <div className="h-48 mb-4">
              <Lottie
                animationData={plantAnimation}
                loop={true}
                className="w-full h-full"
              />
            </div>
            <motion.a 
              href="/ai-recommendations"
              className="flex items-center gap-2 text-white dark:text-primary-400 hover:text-teal-400 dark:hover:text-teal-400 transition-colors duration-300 ease-smooth"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Learn More <ArrowRight size={16} />
            </motion.a>
          </FeatureCard>

          <FeatureCard
            title="Plant Store"
            description="Browse and purchase from our curated selection of plants and accessories"
            icon={<ShoppingBag className="w-6 h-6 text-primary-400" />}
          >
            <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
              <motion.div
                className="absolute inset-0"
                initial={{ x: 0 }}
                animate={{ x: ['0%', '-100%', '0%'] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-shrink-0 w-48">
                      <div className="bg-primary-50 dark:bg-dark-800/80 rounded-lg p-4">
                        <div className="h-32 bg-primary-100 dark:bg-primary-900/20 rounded mb-2" />
                        <div className="h-4 bg-primary-200 dark:bg-primary-800/30 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.a
              href="/plant-store"
              className="flex items-center gap-2 text-white dark:text-primary-400 hover:text-teal-400 dark:hover:text-teal-400 transition-colors duration-300 ease-smooth"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Shop Now <ArrowRight size={16} />
            </motion.a>
          </FeatureCard>

          <FeatureCard
            title="Community Hub"
            description="Connect with fellow plant enthusiasts and share your gardening journey"
            icon={<Users className="w-6 h-6 text-primary-400" />}
          >
            <div className="space-y-4 mb-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-gradient/30" />
                  <div className="flex-1">
                    <div className="h-3 bg-primary-100 dark:bg-primary-800/30 rounded w-3/4 mb-1" />
                    <div className="h-2 bg-primary-50 dark:bg-primary-900/20 rounded w-1/2" />
                  </div>
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary-gradient"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </motion.div>
              ))}
            </div>
            <motion.a
              href="/community-hub"
              className="flex items-center gap-2 text-white dark:text-primary-400 hover:text-teal-400 dark:hover:text-teal-400 transition-colors duration-300 ease-smooth"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Join Community <ArrowRight size={16} />
            </motion.a>
          </FeatureCard>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Features; 