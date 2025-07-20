import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useCart } from '../context/CartContext'; // Import useCart
import AnimatedButton from './AnimatedButton'; // Default import
import ThemeToggle from './ThemeToggle';
import { Menu, X, User, ShoppingCartIcon, Search, Home, Leaf, Users, Info, Heart, LogOut, Bot } from 'lucide-react'; // Icons for mobile menu toggle & User icon

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout } = useAuth(); // Get auth state and functions
  const { cartItemCount } = useCart(); // Get cart item count
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setSearchActive(!searchActive);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchActive(false);
      setSearchQuery('');
    }
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 120, damping: 20 }
    },
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.3, 
        ease: [0.76, 0, 0.24, 1]
      }
    },
    open: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.5, 
        ease: [0.76, 0, 0.24, 1]
      }
    },
  };

  const searchVariants = {
    closed: { 
      width: '40px', 
      transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] }
    },
    open: { 
      width: '100%', 
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
    }
  };

  // Staggered children animation for mobile menu items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Enhanced hover for transparent state
  const linkHoverTransparent = { color: '#6EE7B7' }; // Lighter emerald for hover on transparent
  const linkHoverScrolled = { color: '#10B981' }; // Standard emerald for hover on white

  // Restore missing links
  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'AI Recommendations', path: '/ai-recommendations', icon: <Leaf size={18} /> },
    { name: 'AI Plant Care', path: '/ai-plant-care', icon: <Bot size={18} /> },
    { name: 'Plant Identifier', path: '/plant-identifier', icon: <Search size={18} /> },
    { name: 'Plant Store', path: '/plant-store', icon: <ShoppingCartIcon size={18} /> },
    { name: 'Community Hub', path: '/community-hub', icon: <Users size={18} /> },
    
  ];

  // Close menu on navigation
  useEffect(() => {
      setIsOpen(false);
      setSearchActive(false);
  }, [location]);

  // Dynamic text colors based on scroll state
  const baseTextColor = scrolled ? 'text-gray-700' : 'text-white';
  const logoColor = scrolled ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-white';
  // Use conditional hover text color
  const hoverTextColor = scrolled ? 'hover:text-emerald-600' : 'hover:text-emerald-300'; 
  const activeLinkColor = 'text-emerald-600'; // Active link color
  const iconColor = scrolled ? 'text-gray-600' : 'text-white';
  const iconHoverColor = scrolled ? 'hover:text-emerald-600' : 'hover:text-emerald-300';

  const navBg = scrolled 
    ? 'bg-white/90 backdrop-blur-md shadow-sm' 
    : 'bg-transparent';

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-smooth ${navBg}`}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand Name with dynamic color */} 
          <div className="flex-shrink-0">
            <Link 
              to="/"
              className={`font-display text-2xl font-bold ${logoColor} transition duration-300`}
            >
              SproutSphere
            </Link>
          </div>

          {/* Desktop Navigation Links with dynamic color */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <motion.div 
                key={link.path} 
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Link 
                  to={link.path} 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === link.path 
                      ? 'text-primary-400' 
                      : baseTextColor
                  } hover:text-primary-400 transition-all duration-300 ease-smooth flex items-center gap-1.5`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              </motion.div>
            ))}

            {/* Conditionally add Admin link for desktop */}
            {isAuthenticated && user?.role === 'Admin' && (
              <motion.div 
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Link 
                  to="/admin" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname.startsWith('/admin') 
                      ? 'text-primary-400' 
                      : baseTextColor
                  } hover:text-primary-400 transition-all duration-300 ease-smooth flex items-center gap-1.5`}
                >
                  <Info size={18} />
                  <span>Admin</span>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <motion.form 
              onSubmit={handleSearchSubmit}
              className="relative"
              variants={searchVariants}
              animate={searchActive ? "open" : "closed"}
              initial="closed"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plants..."
                className={`py-1.5 px-3 pr-8 rounded-full border-2 border-gray-200 focus:border-primary-400 focus:outline-none text-sm transition-all duration-300 ease-smooth w-full ${
                  searchActive ? 'opacity-100' : 'opacity-0'
                } ${searchActive ? 'visible' : 'absolute -z-10'}`}
              />
              <button 
                type="button"
                onClick={toggleSearch}
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-400 transition-colors duration-300 ${
                  searchActive ? '' : 'bg-gray-100 rounded-full p-1.5'
                }`}
              >
                <Search size={18} />
              </button>
            </motion.form>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Cart Icon */}
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
              <Link 
                to="/cart" 
                className={`relative p-1.5 rounded-full ${
                  scrolled ? 'text-gray-700' : 'text-white'
                } hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 transition-colors duration-300`}
              >
                <span className="sr-only">View shopping cart</span>
                <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-primary-gradient rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* Auth Buttons - Desktop */} 
            {isAuthenticated ? (
              <div className="flex items-center space-x-3"> {/* Adjusted spacing */}
                {/* Display User Name linking to Profile */}
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                  <AnimatedButton 
                    onClick={() => navigate('/profile')} 
                    variant="ghost" // Use ghost or subtle variant for name display
                    size="sm"
                    // Apply text color based on scroll, similar to nav links
                    className={`${baseTextColor} font-medium flex items-center gap-1.5`}
                  >
                    <User size={16} /> {/* Optional: Add user icon */}
                    {/* Display user name if user object is available */}
                    <span className="max-w-[100px] truncate">{user?.name || 'Account'}</span>
                  </AnimatedButton>
                </motion.div>
                {/* Logout Button */}
                <AnimatedButton 
                  onClick={logout} 
                  variant={scrolled ? "outlinePrimary" : "outlineWhite"} // Adjust variant based on scroll
                  size="sm"
                >
                  Logout
                </AnimatedButton>
              </div>
            ) : (
              <div className="flex items-center space-x-2"> {/* Added ml-4 for spacing */} 
                {/* Login Button */}
                <AnimatedButton 
                  as={Link} 
                  to="/login" 
                  // Use variants for styling based on scroll
                  variant={scrolled ? "outlinePrimary" : "outlineWhite"}
                  size="sm"
                >
                  Login
                </AnimatedButton>
                {/* Sign Up Button */}
                <AnimatedButton 
                  as={Link} 
                  to="/signup" 
                  variant="primary" 
                  size="sm"
                  className="bg-primary-gradient hover:opacity-90"
                >
                  Sign Up
                </AnimatedButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Adjust icon color */} 
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Cart Icon */}
             <Link to="/cart" className={`relative p-1 ${
                scrolled ? 'text-gray-700' : 'text-white'
              } hover:text-primary-400 transition-colors duration-300`}>
               <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
               {cartItemCount > 0 && (
                 <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-primary-gradient rounded-full">
                   {cartItemCount}
                 </span>
               )}
             </Link>
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-1.5 rounded-md ${
                scrolled ? 'text-gray-700' : 'text-white'
              } hover:text-primary-400 transition-colors duration-300`}
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */} 
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md shadow-lg"
          >
            <motion.div 
              className="px-4 pt-2 pb-4 space-y-1"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* Mobile Search */}
              <motion.form 
                onSubmit={handleSearchSubmit}
                className="mb-4 pt-3"
                variants={itemVariants}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search plants..."
                    className="w-full py-2 px-4 pr-10 rounded-full border-2 border-gray-200 focus:border-primary-400 text-gray-800 focus:outline-none text-sm"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-400"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </motion.form>

              {navLinks.map((link) => (
                <motion.div key={link.path} variants={itemVariants}>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                      location.pathname === link.path 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    } transition-colors`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {isAuthenticated && user?.role === 'Admin' && (
                <motion.div variants={itemVariants}>
                  <Link
                    to="/admin"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                      location.pathname.startsWith('/admin') 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    } transition-colors`}
                  >
                    <Info size={18} />
                    Admin Panel
                  </Link>
                </motion.div>
              )}

              <div className="pt-4 pb-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <motion.div variants={itemVariants}>
                      <AnimatedButton 
                        onClick={() => {navigate('/profile'); toggleMenu();}} 
                        variant="ghost" // Use ghost variant for consistency
                        className="w-full mb-2 flex items-center justify-start gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg" // Align left, add hover
                        size="sm"
                      >
                        <User size={18} />
                        <span className="font-medium">{user?.name || 'Profile'}</span>
                      </AnimatedButton>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <AnimatedButton 
                        onClick={() => { logout(); toggleMenu(); }} 
                        variant="outlinePrimary" // Use outline for mobile consistency
                        className="w-full mt-2" 
                      >
                        Logout
                      </AnimatedButton>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={itemVariants}>
                      <AnimatedButton 
                        as={Link} 
                        to="/login" 
                        variant="outlinePrimary" 
                        className="w-full mb-2" 
                        onClick={toggleMenu} // This onClick is for the button, Link handles navigation
                        size="sm"
                      >
                        Login
                      </AnimatedButton>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <AnimatedButton 
                        as={Link} 
                        to="/signup" 
                        variant="primary" 
                        className="w-full bg-primary-gradient hover:opacity-90" 
                        onClick={toggleMenu} // This onClick is for the button, Link handles navigation
                        size="sm"
                      >
                        Sign Up
                      </AnimatedButton>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;