import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const AnimatedCard = ({ 
  children, 
  className = '', 
  delay = 0, 
  hoverEffect = true,
  variant = 'default' // 'default', 'outline', 'primary', or 'minimal'
}) => {
  // Base variants for different card styles
  const cardVariants = {
    default: "bg-primary-50 dark:bg-primary-900 shadow-card border border-primary-100 dark:border-primary-800",
    outline: "bg-primary-50 dark:bg-primary-900 border-2 border-primary-200 dark:border-primary-700",
    primary: "bg-primary-gradient text-white border-none",
    minimal: "bg-primary-50/50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900"
  };

  // Animation variants
  const animations = {
    initial: { 
      opacity: 0, 
      y: 20 
    },
    animate: { 
      opacity: 1, 
      y: 0 
    },
    hover: hoverEffect ? { 
      y: -5,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    } : {},
    tap: hoverEffect ? {
      scale: 0.98,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)"
    } : {}
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={animations}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={`rounded-xl overflow-hidden ${cardVariants[variant]} ${className}`}
    >
      {variant === 'primary' && hoverEffect && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ 
            x: '100%', 
            opacity: 0.3,
            transition: {
              duration: 1.2,
              ease: "easeInOut",
            }
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export default AnimatedCard 