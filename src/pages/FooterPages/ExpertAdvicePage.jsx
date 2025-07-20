import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Calendar,
  Star,
  Award,
  Leaf,
  Camera,
  Microphone,
  Globe,
  Clock
} from 'lucide-react';
import FooterPageTemplate from './FooterPageTemplate';

const ExpertAdvicePage = () => {
  const expertTeam = [
    {
      name: "Dr. Sarah Chen",
      title: "Lead Horticulturist",
      expertise: "Tropical Plants & Indoor Gardening",
      experience: "15+ years",
      education: "Ph.D. in Horticulture, Cornell University",
      avatar: "/avatars/sarah-chen.jpg",
      bio: "Dr. Chen specializes in tropical plant care and has published over 50 research papers on indoor plant health and growth optimization.",
      specialties: ["Monstera", "Philodendron", "Orchids", "Ferns"],
      rating: 4.9,
      consultations: 1200
    },
    {
      name: "Marcus Rodriguez",
      title: "Succulent & Cactus Specialist",
      expertise: "Desert Plants & Xeriscaping",
      experience: "12+ years",
      education: "M.S. in Botany, University of Arizona",
      avatar: "/avatars/marcus-rodriguez.jpg",
      bio: "Marcus is a certified succulent expert who has worked with botanical gardens across the Southwest and authored three books on desert plant care.",
      specialties: ["Cacti", "Succulents", "Aloe", "Agave"],
      rating: 4.8,
      consultations: 980
    },
    {
      name: "Dr. Emily Watson",
      title: "Plant Health & Disease Expert",
      expertise: "Plant Pathology & Pest Management",
      experience: "18+ years",
      education: "Ph.D. in Plant Pathology, UC Davis",
      avatar: "/avatars/emily-watson.jpg",
      bio: "Dr. Watson is a leading expert in plant disease diagnosis and treatment, with extensive experience in both commercial and home gardening.",
      specialties: ["Disease Diagnosis", "Pest Control", "Fertilization", "Soil Health"],
      rating: 4.9,
      consultations: 1500
    },
    {
      name: "James Kim",
      title: "Bonsai Master",
      expertise: "Bonsai & Miniature Trees",
      experience: "20+ years",
      education: "Traditional Bonsai Apprenticeship, Japan",
      avatar: "/avatars/james-kim.jpg",
      bio: "James trained under master bonsai artists in Japan and has won multiple international bonsai competitions. He specializes in traditional and modern bonsai techniques.",
      specialties: ["Bonsai", "Dwarf Trees", "Pruning", "Wiring"],
      rating: 4.9,
      consultations: 850
    },
    {
      name: "Lisa Thompson",
      title: "Herb & Vegetable Specialist",
      expertise: "Edible Plants & Organic Gardening",
      experience: "10+ years",
      education: "M.S. in Sustainable Agriculture, Oregon State",
      avatar: "/avatars/lisa-thompson.jpg",
      bio: "Lisa is passionate about organic gardening and sustainable food production. She has helped thousands of families start their own edible gardens.",
      specialties: ["Herbs", "Vegetables", "Organic Methods", "Composting"],
      rating: 4.7,
      consultations: 1100
    },
    {
      name: "Dr. Alex Johnson",
      title: "Plant Genetics & Breeding Expert",
      expertise: "Plant Breeding & New Varieties",
      experience: "14+ years",
      education: "Ph.D. in Plant Genetics, University of Wisconsin",
      avatar: "/avatars/alex-johnson.jpg",
      bio: "Dr. Johnson has developed several award-winning plant varieties and specializes in helping gardeners understand plant genetics and breeding.",
      specialties: ["Plant Breeding", "Hybridization", "Seed Saving", "Variety Selection"],
      rating: 4.8,
      consultations: 720
    }
  ];

  const services = [
    {
      title: "One-on-One Consultations",
      description: "Get personalized advice from our expert horticulturists",
      icon: MessageCircle,
      features: [
        "30-minute video consultations",
        "Personalized care plans",
        "Follow-up support",
        "Plant health assessments"
      ],
      price: "$49",
      duration: "30 min"
    },
    {
      title: "Plant Health Assessments",
      description: "Professional diagnosis of plant problems and solutions",
      icon: Leaf,
      features: [
        "Comprehensive health evaluation",
        "Disease and pest identification",
        "Treatment recommendations",
        "Prevention strategies"
      ],
      price: "$39",
      duration: "45 min"
    },
    {
      title: "Care Plan Development",
      description: "Custom care schedules and routines for your plants",
      icon: Calendar,
      features: [
        "Seasonal care schedules",
        "Watering and fertilizing plans",
        "Repotting recommendations",
        "Growth optimization tips"
      ],
      price: "$29",
      duration: "60 min"
    }
  ];

  const contentTypes = [
    {
      type: "Video Tutorials",
      icon: Video,
      count: "150+",
      description: "Step-by-step video guides on plant care techniques",
      topics: ["Watering Methods", "Pruning Techniques", "Repotting", "Propagation"]
    },
    {
      type: "Written Guides",
      icon: BookOpen,
      count: "300+",
      description: "Comprehensive articles and care guides",
      topics: ["Plant Profiles", "Care Instructions", "Troubleshooting", "Seasonal Tips"]
    },
    {
      type: "Live Workshops",
      icon: Users,
      count: "Monthly",
      description: "Interactive live sessions with expert Q&A",
      topics: ["Plant Care Basics", "Advanced Techniques", "Seasonal Care", "Problem Solving"]
    },
    {
      type: "Community Q&A",
      icon: MessageCircle,
      count: "24/7",
      description: "Expert-moderated community discussions",
      topics: ["Plant Identification", "Care Questions", "Problem Diagnosis", "Tips Sharing"]
    }
  ];

  const testimonials = [
    {
      name: "Maria Garcia",
      location: "San Francisco, CA",
      rating: 5,
      comment: "Dr. Chen helped me save my dying monstera. Her advice was spot-on and my plant is now thriving!",
      plant: "Monstera Deliciosa"
    },
    {
      name: "David Park",
      location: "Austin, TX",
      rating: 5,
      comment: "Marcus's succulent care tips transformed my collection. I've never had such healthy plants!",
      plant: "Succulent Collection"
    },
    {
      name: "Jennifer Lee",
      location: "Portland, OR",
      rating: 5,
      comment: "Dr. Watson diagnosed my plant's disease in minutes and provided a complete treatment plan.",
      plant: "Peace Lily"
    }
  ];

  return (
    <FooterPageTemplate
      title="Expert Advice"
      subtitle="Get professional guidance from certified horticulturists"
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Expert Advice', href: '/expert-advice' }
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
              <Users className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Expert Plant Care Guidance
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Connect with certified horticulturists, plant pathologists, and gardening experts 
            who are passionate about helping you succeed with your plants.
          </p>
        </motion.div>

        {/* Expert Team */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Meet Our Expert Team
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertTeam.map((expert, index) => (
              <motion.div
                key={expert.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-4">
                      <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {expert.name}
                      </h3>
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {expert.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {expert.bio}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      {expert.experience} experience
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Award className="h-4 w-4 mr-1" />
                      {expert.education}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Specialties:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {expert.specialties.map((specialty, specialtyIndex) => (
                        <span
                          key={specialtyIndex}
                          className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {expert.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {expert.consultations} consultations
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Expert Services
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-4">
                    <service.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {service.duration} • {service.price}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="w-full mt-6 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Book Consultation
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Content Types */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Expert Content & Resources
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentTypes.map((content, index) => (
              <motion.div
                key={content.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <content.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {content.type}
                </h3>
                
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {content.count}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {content.description}
                </p>
                
                <div className="space-y-1">
                  {content.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="text-xs text-gray-500 dark:text-gray-400">
                      • {topic}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What Our Community Says
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {testimonial.plant}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            How Expert Consultations Work
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  1
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Book a Session
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Choose your expert and schedule a consultation at your convenience
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  2
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Prepare Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Gather photos and specific questions about your plant concerns
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  3
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Meet Your Expert
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Join a video call and get personalized advice from certified experts
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  4
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Follow Up
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Receive a detailed care plan and ongoing support as needed
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-emerald-600 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Expert Help?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Connect with our certified horticulturists and transform your plant care journey
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Book a Consultation
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-emerald-600 transition-colors">
              Browse Experts
            </button>
          </div>
        </motion.section>
      </div>
    </FooterPageTemplate>
  );
};

export default ExpertAdvicePage; 