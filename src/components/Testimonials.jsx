import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import AnimatedSection from './AnimatedSection'

const testimonials = [
  {
    content: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
    author: "Sarah Chen",
    role: "Product Manager at TechFlow",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    content: "The community hub is fantastic! I've learned so much and connected with other passionate users. The interface is intuitive and the support team is responsive.",
    author: "Michael Torres",
    role: "Design Lead at CreativeStudio",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    content: "Finally, an app that delivers on its promises. The integration capabilities and automation features have saved us countless hours every week.",
    author: "Emma Davis",
    role: "Operations Director at InnovateCorp",
    image: "https://images.unsplash.com/photo-1517841905240-472988bdfe83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    content: "The platform's analytics tools provide valuable insights that have directly contributed to our growth. We've seen a 30% increase in productivity since implementation.",
    author: "James Thompson",
    role: "CEO at GrowthMetrics",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
]

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <AnimatedSection 
      className="py-20 md:py-32 bg-dark-600 dark:from-dark-800/30 dark:to-dark-900/50 overflow-hidden relative"
      animation="fade-in"
    >
      {/* Decorative elements */}
      <div className="absolute top-40 left-5 w-72 h-72 rounded-full bg-primary-100/30 dark:bg-primary-900/10 blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-green-100/30 dark:bg-green-900/10 blur-3xl -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-4 font-display">
            What Our <span className="text-primary-gradient">Clients Say</span>
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Testimonial Card */}
          <div className="rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-dark-800/50">
            <div className="relative w-full h-full">
              <div className="relative w-full h-full">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image Section */}
                  <div className="relative aspect-square md:aspect-auto">
                    <div className="w-full h-full overflow-hidden">
                      <img 
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].author}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 md:bg-gradient-to-r md:from-transparent md:to-black/30" />
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {testimonials[currentIndex].author}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 mb-6">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl italic mb-8 leading-relaxed">
                      "{testimonials[currentIndex].content}"
                    </p>
                    
                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-3">
                        {testimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentIndex(index);
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              index === currentIndex
                                ? "bg-primary-500 w-8"
                                : "bg-gray-300 dark:bg-gray-600 hover:bg-primary-400 dark:hover:bg-primary-700"
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                          />
                        ))}
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={goToPrevious}
                          className="p-2.5 rounded-full bg-gray-100 dark:bg-dark-700 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                          aria-label="Previous testimonial"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={goToNext}
                          className="p-2.5 rounded-full bg-gray-100 dark:bg-dark-700 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                          aria-label="Next testimonial"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default Testimonials 