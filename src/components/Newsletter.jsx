import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import AnimatedSection from './AnimatedSection'
import AnimatedButton from './AnimatedButton'

const Newsletter = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement actual newsletter signup logic (e.g., API call)
    console.log('Newsletter subscription for:', email)
    // Optional: Add toast notification for success
    setEmail('')
  }

  return (
    <AnimatedSection 
      className="py-24 relative overflow-hidden"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-dark-800">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-gradient"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-primary-400/5 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-teal-400/5 blur-3xl"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
          <div className="text-center mb-8">
            <motion.span 
              className="inline-block px-4 py-1.5 mb-3 rounded-full bg-primary-gradient/10 text-primary-400 text-sm font-medium"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              Join Our Community
            </motion.span>
          
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.1 } }
              }}
            >
              Grow Your <span className="text-primary-gradient">Knowledge</span>
            </motion.h2>
            
            <motion.p 
              className="text-gray-300 text-lg max-w-2xl mx-auto"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.2 } }
              }}
            >
              Subscribe to our newsletter for the latest gardening tips, seasonal advice, and exclusive SproutSphere offers.
            </motion.p>
          </div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.3 } }
            }}
          >
            <input
              id="email-address"
              name="email-address"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Enter your email address"
            />
            <AnimatedButton
              type="submit"
              variant="primary"
              className="w-full sm:w-auto bg-primary-gradient"
              icon={Send}
            >
              Subscribe
            </AnimatedButton>
          </motion.form>
          
          <motion.p 
            className="mt-4 text-center text-sm text-gray-400"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 0.4 } }
            }}
          >
            We respect your privacy. Read our{' '}
            <a href="/privacy" className="text-primary-400 hover:text-teal-400 underline transition-colors duration-300">
              Privacy Policy
            </a>
          </motion.p>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default Newsletter 