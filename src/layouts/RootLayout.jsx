import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SkipLink } from '../components/AccessibilityUtils';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import ProgressBar from 'react-scroll-progress-bar';
import { AnimatePresence, motion } from 'framer-motion';

// Create a PageTransition component
const PageTransition = ({ children, transition = 'fade' }) => {
  // Different animation variants based on the transition type
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    },
    slide: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '-100%', opacity: 0 },
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    slideUp: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -20, opacity: 0 },
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    zoom: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <motion.div
      initial={variants[transition].initial}
      animate={variants[transition].animate}
      exit={variants[transition].exit}
      transition={variants[transition].transition}
    >
      {children}
    </motion.div>
  );
};

const RootLayout = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Set page as loaded after a short delay to allow for initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Determine if we should hide navbar and footer
  // Only hide on login, signup, and admin pages
  const hideNavbarAndFooter = location.pathname === '/login' || 
                            location.pathname === '/signup' || 
                            location.pathname.startsWith('/admin');

  // Ensure navbar is visible on key pages (explicitly check)
  const keyPages = ['/plant-store', '/ai-recommendations', '/community-hub'];
  const forceShowNavbar = keyPages.some(page => location.pathname.includes(page));
  
  // Determine which transition to use based on the route
  const getTransitionType = () => {
    if (location.pathname === '/') return 'fade';
    if (location.pathname.includes('plant-store')) return 'slideUp';
    if (location.pathname.includes('profile')) return 'slide';
    if (location.pathname.includes('design-example')) return 'zoom';
    return 'fade'; // default
  };

  return (
    <>
      {/* Accessibility skip link */}
      <SkipLink targetId="main-content" />
      
      {/* Scroll Progress Indicator */}
      <ProgressBar 
        height={3}
        bgcolor={theme === 'dark' ? 'var(--color-primary-400)' : 'var(--color-primary-600)'}
      />
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      
      {/* Floating theme toggle button for all pages */}
      <motion.div 
        className="fixed bottom-6 right-6 z-40" 
        aria-label="Theme toggle button" 
        role="region"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <ThemeToggle />
      </motion.div>
      
      {/* Initial page load animation */}
      <AnimatePresence>
        {!pageLoaded && (
          <motion.div 
            className="fixed inset-0 bg-primary-500 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.4 }}
              className="text-white text-3xl font-display"
            >
              SproutSphere
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={`min-h-screen flex flex-col transition-colors duration-300
                     ${theme === 'dark' ? 'bg-dark-800 text-dark-100' : 'bg-white text-gray-900'}`}>
        {(!hideNavbarAndFooter || forceShowNavbar) && <Navbar />}
        
        <main id="main-content" className="flex-grow focus:outline-none" tabIndex="-1">
          <PageTransition transition={getTransitionType()}>
            <Outlet />
          </PageTransition>
        </main>
        
        {(!hideNavbarAndFooter || forceShowNavbar) && <Footer />}
      </div>
    </>
  );
};

export default RootLayout; 