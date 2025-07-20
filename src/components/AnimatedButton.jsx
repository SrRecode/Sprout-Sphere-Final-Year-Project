import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
// We don't need ArrowUpRightIcon unless specifically used elsewhere
// import { ArrowUpRightIcon } from '@heroicons/react/20/solid' // Optional icon import

const AnimatedButton = ({ 
  children, 
  className = '', 
  onClick, 
  // Default type is only relevant if Component is 'button'
  // type = 'button', 
  variant = 'primary', 
  size = 'md', // Added size prop
  icon: Icon, // Added icon prop
  as: Component = 'button', // Capture the 'as' prop, default to 'button'
  disabled = false,
  ...rest // Capture other props like 'to', 'href', 'type'
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-smooth rounded-md shadow-sm relative overflow-hidden'
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const variants = {
    primary: 'bg-primary-gradient text-white hover:shadow-lg focus:ring-primary-400 border border-transparent',
    secondary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 focus:ring-primary-400 border border-transparent',
    outlinePrimary: 'bg-transparent text-primary-600 dark:text-primary-400 border-2 border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 focus:ring-primary-400',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:ring-primary-400',
    outlineWhite: 'bg-transparent text-white border-2 border-white hover:bg-white/10 focus:ring-white', 
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-primary-400 border border-transparent',
    custom: ''
  }

  // Add disabled styles
  const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : '';

  // Combine classes
  const combinedClassName = variant === 'custom' && className 
    ? `${baseStyles} ${sizeStyles[size]} ${className} ${disabledStyles}`
    : `${baseStyles} ${sizeStyles[size]} ${variants[variant] || variants.primary} ${className} ${disabledStyles}`;

  // Create motion component
  const MotionComponent = motion(Component);

  // Enhanced animation variants
  const buttonVariants = {
    initial: { y: 0, boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)" },
    hover: { 
      y: -2, 
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
    },
    tap: { 
      y: 1, 
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)" 
    }
  };

  // Shimmering effect for primary buttons
  const shimmerVariants = {
    initial: {
      x: "-100%",
      opacity: 0,
    },
    hover: {
      x: "100%", 
      opacity: 0.3,
      transition: {
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 1
      }
    }
  };

  return (
    <MotionComponent
      onClick={onClick}
      className={combinedClassName}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      }}
      disabled={disabled}
      {...rest}
    >
      {variant === 'primary' && !disabled && (
        <motion.span 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={shimmerVariants}
          initial="initial"
          animate="hover"
          aria-hidden="true" 
        />
      )}
      <span className="relative z-10 flex items-center">
        {children}
        {Icon && <Icon className="ml-2 h-4 w-4" aria-hidden="true" />}
      </span>
    </MotionComponent>
  )
}

export default AnimatedButton