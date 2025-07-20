import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import FooterPageTemplate from './FooterPageTemplate';

const AboutPage = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&crop=faces&fit=crop',
      bio: 'Plant enthusiast with over 15 years of experience in sustainable gardening.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&h=200&crop=faces&fit=crop',
      bio: 'Tech innovator with a passion for creating solutions that connect people with nature.'
    },
    {
      name: 'Aisha Patel',
      role: 'Head of Plant Science',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&crop=faces&fit=crop',
      bio: 'PhD in Botany with expertise in plant care, growth patterns, and sustainability.'
    }
  ];

  // Mission values
  const missionValues = [
    {
      title: 'Sustainability',
      description: 'We promote eco-friendly practices that help preserve our planet for future generations.'
    },
    {
      title: 'Education',
      description: 'We believe in empowering people with knowledge about plants and their care.'
    },
    {
      title: 'Community',
      description: 'We foster a supportive community of plant enthusiasts who share and learn together.'
    },
    {
      title: 'Innovation',
      description: 'We leverage technology to make plant care more accessible and effective.'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <FooterPageTemplate
      title="About SproutSphere"
      subtitle="Cultivating a greener future, one plant at a time"
      breadcrumbItems={[{ label: 'About Us' }]}
    >
      {/* Company Story Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Our Story</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <p className="mb-4">
              Founded in 2021, SproutSphere began as a passion project by Sarah Johnson, a lifelong plant enthusiast who wanted to make plant care more accessible for everyone. What started as a small blog about houseplants has grown into a comprehensive platform that combines AI technology with human expertise.
            </p>
            <p className="mb-4">
              Our journey hasn't been without challenges. In the early days, we struggled to balance technological innovation with the personal touch that makes plant care special. But through dedication and the support of our growing community, we've created a platform that truly serves the needs of plant lovers everywhere.
            </p>
            <p>
              Today, SproutSphere serves over 50,000 plant enthusiasts worldwide, helping them discover, care for, and celebrate their plant collections. We're proud of our journey so far and excited about the future as we continue to grow and evolve.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-80">
              <div className="absolute inset-0 bg-primary-gradient opacity-10 rounded-2xl"></div>
              <img 
                src="/images/Generated Image March 30, 2025 - 10_41AM.jpeg" 
                alt="SproutSphere office with plants" 
                className="rounded-2xl h-full w-full object-cover shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-dark-800 p-3 rounded-lg shadow-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Est. 2021</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Our Mission & Values</h2>
        <div className="bg-white dark:bg-dark-800/50 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
          <p className="text-lg font-medium text-primary-600 dark:text-primary-400 mb-2">Our Mission</p>
          <p className="text-gray-700 dark:text-gray-300">
            To empower people to create thriving green spaces by making expert plant care knowledge accessible through technology, while promoting sustainable practices that benefit both people and the planet.
          </p>
        </div>
        
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">Our Core Values</p>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {missionValues.map((value, index) => (
            <motion.div 
              key={index} 
              className="bg-white/50 dark:bg-dark-800/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 transition-colors duration-300"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2" />
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Meet Our Team</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          SproutSphere is powered by a diverse team of plant lovers, tech innovators, and sustainability advocates who are passionate about our mission.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-dark-800/50 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">SproutSphere By The Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '50K+', label: 'Registered Users' },
            { value: '10K+', label: 'Plant Species' },
            { value: '100K+', label: 'Plants Cared For' },
            { value: '25+', label: 'Countries Reached' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-primary-gradient/5 dark:bg-primary-gradient/10 rounded-lg p-6 text-center border border-primary-100 dark:border-primary-900"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <span className="block text-3xl font-bold text-primary-gradient mb-2">{stat.value}</span>
              <span className="text-gray-700 dark:text-gray-300">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Join Us CTA */}
      <section>
        <div className="bg-primary-gradient p-8 rounded-2xl text-white text-center">
          <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Become part of the SproutSphere family and embark on a journey of plant discovery, care, and connection.
          </p>
          <motion.a 
            href="/signup" 
            className="inline-block px-6 py-3 bg-white text-primary-600 font-medium rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.a>
        </div>
      </section>
    </FooterPageTemplate>
  );
};

export default AboutPage; 