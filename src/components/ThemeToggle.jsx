import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  // Get the user's preference from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    // Check if dark mode is set in localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // If not in localStorage, check user's system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply the theme immediately on mount and when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Save the preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Toggle the theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Spring animation for the toggle
  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
        darkMode 
          ? 'bg-dark-700 text-yellow-400 hover:bg-dark-600' 
          : 'bg-blue-100 text-blue-500 hover:bg-blue-200'
      } ${className}`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-6 h-6">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ opacity: darkMode ? 0 : 1, rotate: darkMode ? -90 : 0 }}
          transition={spring}
        >
          <Sun className="w-5 h-5" />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ opacity: darkMode ? 1 : 0, rotate: darkMode ? 0 : 90 }}
          transition={spring}
        >
          <Moon className="w-5 h-5" />
        </motion.div>
      </div>
    </button>
  );
};

export default ThemeToggle; 