import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Store, 
  Users, 
  MessageCircle, 
  BookOpen, 
  Settings,
  HelpCircle,
  FileText,
  Camera,
  Heart,
  Search,
  Globe,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FooterPageTemplate from './FooterPageTemplate';

const SitemapPage = () => {
  const [expandedSections, setExpandedSections] = useState(new Set(['main', 'shop', 'community']));

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const sitemapData = [
    {
      id: 'main',
      title: 'Main Pages',
      icon: Home,
      color: 'emerald',
      pages: [
        { name: 'Home', path: '/', description: 'Welcome to SproutSphere' },
        { name: 'About Us', path: '/about', description: 'Learn about our mission and team' },
        { name: 'Contact', path: '/contact', description: 'Get in touch with us' },
        { name: 'Blog', path: '/blog', description: 'Plant care articles and tips' },
        { name: 'Careers', path: '/careers', description: 'Join our growing team' }
      ]
    },
    {
      id: 'shop',
      title: 'Plant Store',
      icon: Store,
      color: 'blue',
      pages: [
        { name: 'Plant Catalog', path: '/store', description: 'Browse our plant collection' },
        { name: 'Plant Categories', path: '/store/categories', description: 'Shop by plant type' },
        { name: 'New Arrivals', path: '/store/new-arrivals', description: 'Latest additions' },
        { name: 'Best Sellers', path: '/store/best-sellers', description: 'Most popular plants' },
        { name: 'Sale Items', path: '/store/sale', description: 'Special offers and discounts' },
        { name: 'Plant Care Products', path: '/store/care-products', description: 'Pots, soil, and accessories' },
        { name: 'Gift Cards', path: '/store/gift-cards', description: 'Perfect for plant lovers' }
      ]
    },
    {
      id: 'community',
      title: 'Community & Social',
      icon: Users,
      color: 'purple',
      pages: [
        { name: 'Community Hub', path: '/community-hub', description: 'Connect with fellow plant enthusiasts' },
        { name: 'Plant Identification', path: '/plant-identifier', description: 'Identify plants from photos' },
        { name: 'AI Plant Care Hub', path: '/ai-plant-care', description: 'Get AI-powered care advice' },
        { name: 'Expert Advice', path: '/expert-advice', description: 'Consult with horticulture experts' },
        { name: 'Plant Care Guides', path: '/guides', description: 'Comprehensive care instructions' },
        { name: 'Plant Care Forum', path: '/forum', description: 'Ask questions and share experiences' }
      ]
    },
    {
      id: 'ai-services',
      title: 'AI Services',
      icon: Search,
      color: 'orange',
      pages: [
        { name: 'Plant Identification', path: '/plant-identifier', description: 'AI-powered plant recognition' },
        { name: 'Disease Detection', path: '/disease-detection', description: 'Identify plant health issues' },
        { name: 'Care Assistant', path: '/ai-plant-care', description: 'Personalized care recommendations' },
        { name: 'Voice Recognition', path: '/voice-assistant', description: 'Voice-controlled plant care' },
        { name: 'Health Analysis', path: '/health-analysis', description: 'Comprehensive plant health assessment' }
      ]
    },
    {
      id: 'user-account',
      title: 'User Account',
      icon: Settings,
      color: 'gray',
      pages: [
        { name: 'Login', path: '/login', description: 'Sign in to your account' },
        { name: 'Sign Up', path: '/signup', description: 'Create a new account' },
        { name: 'User Profile', path: '/profile', description: 'Manage your profile and preferences' },
        { name: 'Order History', path: '/orders', description: 'View your purchase history' },
        { name: 'Wishlist', path: '/wishlist', description: 'Save plants for later' },
        { name: 'Plant Care Log', path: '/care-log', description: 'Track your plant care activities' },
        { name: 'Notifications', path: '/notifications', description: 'Manage your notifications' },
        { name: 'Settings', path: '/settings', description: 'Account and privacy settings' }
      ]
    },
    {
      id: 'help-support',
      title: 'Help & Support',
      icon: HelpCircle,
      color: 'red',
      pages: [
        { name: 'Help Center', path: '/help', description: 'Find answers to common questions' },
        { name: 'FAQs', path: '/faqs', description: 'Frequently asked questions' },
        { name: 'Contact Support', path: '/contact', description: 'Get help from our team' },
        { name: 'Live Chat', path: '/chat', description: 'Real-time customer support' },
        { name: 'Shipping Information', path: '/shipping', description: 'Delivery and shipping details' },
        { name: 'Returns & Refunds', path: '/returns', description: 'Return policy and procedures' },
        { name: 'Plant Care Support', path: '/care-support', description: 'Get help with plant care' }
      ]
    },
    {
      id: 'legal',
      title: 'Legal & Policies',
      icon: FileText,
      color: 'indigo',
      pages: [
        { name: 'Privacy Policy', path: '/privacy', description: 'How we protect your data' },
        { name: 'Terms of Service', path: '/terms', description: 'Platform usage terms' },
        { name: 'Cookie Policy', path: '/cookies', description: 'Cookie usage information' },
        { name: 'Accessibility', path: '/accessibility', description: 'Accessibility commitment' },
        { name: 'Data Protection', path: '/data-protection', description: 'GDPR and data rights' },
        { name: 'Intellectual Property', path: '/ip', description: 'Copyright and trademarks' }
      ]
    },
    {
      id: 'admin',
      title: 'Admin Dashboard',
      icon: Settings,
      color: 'yellow',
      pages: [
        { name: 'Admin Dashboard', path: '/admin', description: 'Main admin interface' },
        { name: 'Analytics', path: '/admin/analytics', description: 'Platform analytics and insights' },
        { name: 'User Management', path: '/admin/users', description: 'Manage user accounts' },
        { name: 'Plant Inventory', path: '/admin/inventory', description: 'Manage plant catalog' },
        { name: 'Order Management', path: '/admin/orders', description: 'Process and track orders' },
        { name: 'Community Posts', path: '/admin/posts', description: 'Moderate community content' },
        { name: 'Content Management', path: '/admin/content', description: 'Manage website content' }
      ]
    }
  ];

  const quickLinks = [
    { name: 'Plant Store', path: '/store', icon: Store },
    { name: 'Plant Identifier', path: '/plant-identifier', icon: Camera },
    { name: 'Community Hub', path: '/community-hub', icon: Users },
    { name: 'Care Guides', path: '/guides', icon: BookOpen },
    { name: 'AI Care Assistant', path: '/ai-plant-care', icon: MessageCircle },
    { name: 'Help Center', path: '/help', icon: HelpCircle }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      gray: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
      red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <FooterPageTemplate
      title="Sitemap"
      subtitle="Complete overview of all pages and sections"
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Sitemap', href: '/sitemap' }
      ]}
    >
      <div className="space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <Globe className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Site Navigation Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore all the features and pages available on SproutSphere. 
            Find exactly what you're looking for with our comprehensive site map.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Quick Navigation
          </h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  to={link.path}
                  className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all text-center group"
                >
                  <div className="flex justify-center mb-2">
                    <link.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {link.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Sitemap */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Complete Site Structure
          </h2>
          
          <div className="space-y-6">
            {sitemapData.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * sectionIndex }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg mr-4 ${getColorClasses(section.color)}`}>
                      <section.icon className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {section.pages.length} pages
                      </p>
                    </div>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.has(section.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {section.pages.map((page, pageIndex) => (
                          <motion.div
                            key={page.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * pageIndex }}
                            className="group"
                          >
                            <Link
                              to={page.path}
                              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {page.name}
                                  </h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {page.description}
                                  </p>
                                </div>
                                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex-shrink-0 ml-2" />
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Search Tips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Finding What You Need
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Search className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Use Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Find pages quickly with our powerful search feature
              </p>
            </div>
            
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Browse Categories
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Explore organized sections for different types of content
              </p>
            </div>
            
            <div className="text-center">
              <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Popular Pages
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Check out our most visited and recommended pages
              </p>
            </div>
            
            <div className="text-center">
              <HelpCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Get Help
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Contact support if you can't find what you're looking for
              </p>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-emerald-600 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Our support team is here to help you navigate the site and find exactly what you need
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/help"
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Help Center
            </Link>
          </div>
        </motion.section>
      </div>
    </FooterPageTemplate>
  );
};

export default SitemapPage; 