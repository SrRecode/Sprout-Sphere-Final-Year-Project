import { useNavigate } from 'react-router-dom'
import AnimatedButton from './AnimatedButton'
import AnimatedSection from './AnimatedSection'
import { ChevronRight, Leaf, Droplets, Sun, Wind } from 'lucide-react'

const Hero = () => {
  const navigate = useNavigate()

  const handleGetStartedClick = () => {
    navigate('/signup')
  }

  // Particles animation for the background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 dark:from-black dark:to-dark-900">
      {/* Animated background particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-primary-400"
          style={{
            width: particle.size,
            height: particle.size,
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0.1
          }}
        />
      ))}
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl"
        />
        <div 
          className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-cyan-400/15 blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-primary-gradient opacity-5 rotate-12 scale-150"></div>
      </div>
      
      <AnimatedSection className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full py-20" animation="zoom-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-primary-400/10 backdrop-blur-sm border border-primary-400/20">
              <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-primary-400"></span>
              <span className="text-sm font-medium text-primary-300">Sustainable Gardening Platform</span>
            </div>
            
            <h1 
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl font-display"
            >
              Grow Your World With
              <span className="block text-primary-gradient mt-2">SproutSphere</span>
            </h1>
            
            <p 
              className="mt-6 text-lg text-gray-300 sm:text-xl max-w-xl mx-auto md:mx-0"
            >
              Your AI-powered guide to gardening success. Discover plants, track care, and join our vibrant community of plant enthusiasts.
            </p>
            
            <div 
              className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <AnimatedButton 
                variant="primary" 
                size="lg"
                className="bg-primary-gradient"
                onClick={handleGetStartedClick}
                icon={ChevronRight}
              >
                Get Started
              </AnimatedButton>
              
              <AnimatedButton 
                variant="outlineWhite" 
                size="lg"
                onClick={() => navigate('/plant-store')}
              >
                Explore Store
              </AnimatedButton>
            </div>
            
            {/* Added trust indicators */}
            <div className="mt-12 flex items-center justify-center md:justify-start">
              <span className="text-gray-400 text-sm mr-4">Trusted by plant lovers worldwide</span>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 border-2 border-dark-800 flex items-center justify-center text-white text-xs">
                    {["JD", "SK", "AB", "MN"][i-1]}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-dark-700 border-2 border-dark-800 flex items-center justify-center text-white text-xs">
                  +3k
                </div>
              </div>
            </div>
          </div>

          <div 
            className="relative h-80 md:h-[500px] lg:h-[600px] flex items-center justify-center"
          >
            {/* Glowing background */}
            <div 
              className="absolute inset-0 bg-primary-gradient opacity-10 rounded-full blur-3xl transform scale-75 md:scale-90"
            />
            
            {/* Main image with glowing effect */}
            <div className="relative rounded-3xl overflow-hidden w-full h-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 via-transparent to-cyan-400/20 z-10 mix-blend-overlay"></div>
              <img
                className="w-full h-full object-cover object-center drop-shadow-2xl transition-all duration-500 hover:scale-105"
                src="/images/Generated Image March 30, 2025 - 10_41AM.jpeg"
                alt="Healthy plant in sunlight"
                loading="lazy"
              />
            </div>
            
            {/* Floating badges around the image */}
            <div 
              className="absolute top-10 -right-6 bg-white dark:bg-dark-800 shadow-lg rounded-xl p-3 z-20 border border-gray-100 dark:border-dark-700"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Leaf className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Eco-friendly</div>
                  <div className="text-sm font-medium">100% Sustainable</div>
                </div>
              </div>
            </div>
            
            <div 
              className="absolute bottom-20 -left-6 bg-white dark:bg-dark-800 shadow-lg rounded-xl p-3 z-20 border border-gray-100 dark:border-dark-700"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Droplets className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Smart Water</div>
                  <div className="text-sm font-medium">AI Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 md:mt-24"
        >
          {[
            { value: '10K+', label: 'Plant Species', icon: Leaf },
            { value: '50K+', label: 'Active Users', icon: Sun },
            { value: '99%', label: 'Growth Success', icon: Wind },
            { value: '24/7', label: 'Expert Support', icon: Droplets }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/10 transition-colors border border-white/5"
            >
              <div className="flex justify-center mb-3">
                <stat.icon className="h-6 w-6 text-primary-400" />
              </div>
              <span className="block text-3xl font-bold text-primary-gradient">{stat.value}</span>
              <span className="text-gray-300">{stat.label}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}

export default Hero 