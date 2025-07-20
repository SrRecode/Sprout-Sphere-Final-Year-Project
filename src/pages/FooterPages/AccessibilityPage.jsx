import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Ear, 
  MousePointer, 
  Keyboard, 
  Smartphone, 
  Monitor,
  CheckCircle,
  AlertCircle,
  Info,
  Heart,
  Users,
  Shield
} from 'lucide-react';
import FooterPageTemplate from './FooterPageTemplate';

const AccessibilityPage = () => {
  const accessibilityFeatures = [
    {
      icon: Eye,
      title: "Visual Accessibility",
      features: [
        "High contrast mode for better visibility",
        "Adjustable font sizes (up to 200%)",
        "Screen reader compatibility (NVDA, JAWS, VoiceOver)",
        "Alternative text for all images",
        "Color-blind friendly design",
        "Focus indicators for keyboard navigation"
      ]
    },
    {
      icon: Ear,
      title: "Auditory Accessibility",
      features: [
        "Closed captions for video content",
        "Audio descriptions for visual content",
        "Voice recognition for plant identification",
        "Text-to-speech for care instructions",
        "Visual alerts for audio notifications",
        "Transcripts for all audio content"
      ]
    },
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      features: [
        "Full keyboard accessibility",
        "Logical tab order throughout the site",
        "Skip navigation links",
        "Keyboard shortcuts for common actions",
        "Focus management for dynamic content",
        "Escape key support for modals and overlays"
      ]
    },
    {
      icon: MousePointer,
      title: "Motor Accessibility",
      features: [
        "Large click targets (minimum 44px)",
        "Voice control compatibility",
        "Switch device support",
        "Reduced motion options",
        "Extended time limits for interactions",
        "One-handed navigation support"
      ]
    },
    {
      icon: Smartphone,
      title: "Mobile Accessibility",
      features: [
        "Responsive design for all screen sizes",
        "Touch-friendly interface elements",
        "Gesture alternatives for complex interactions",
        "Portrait and landscape orientation support",
        "Accessible mobile navigation",
        "Voice input support on mobile devices"
      ]
    },
    {
      icon: Monitor,
      title: "Cognitive Accessibility",
      features: [
        "Clear, simple language throughout",
        "Consistent navigation and layout",
        "Error prevention and recovery",
        "Multiple ways to complete tasks",
        "Progress indicators for multi-step processes",
        "Help and support always available"
      ]
    }
  ];

  const complianceStandards = [
    {
      standard: "WCAG 2.1",
      level: "AA",
      status: "Compliant",
      description: "Web Content Accessibility Guidelines 2.1 Level AA compliance ensures our platform is accessible to users with various disabilities."
    },
    {
      standard: "Section 508",
      level: "Federal",
      status: "Compliant",
      description: "Section 508 compliance ensures our platform meets federal accessibility requirements for government and educational institutions."
    },
    {
      standard: "ADA Title III",
      level: "Commercial",
      status: "Compliant",
      description: "Americans with Disabilities Act Title III compliance ensures equal access for users with disabilities in commercial digital spaces."
    },
    {
      standard: "EN 301 549",
      level: "European",
      status: "Compliant",
      description: "European standard for accessibility requirements for ICT products and services, ensuring compliance across EU member states."
    }
  ];

  const assistiveTechnologies = [
    {
      name: "Screen Readers",
      examples: ["NVDA", "JAWS", "VoiceOver", "TalkBack"],
      compatibility: "Full",
      description: "Complete compatibility with major screen readers for navigation and content consumption."
    },
    {
      name: "Voice Recognition",
      examples: ["Dragon NaturallySpeaking", "Windows Speech Recognition", "Voice Control"],
      compatibility: "Full",
      description: "Full support for voice recognition software for hands-free navigation and interaction."
    },
    {
      name: "Switch Devices",
      examples: ["AbleNet", "RJ Cooper", "Inclusive Technology"],
      compatibility: "Full",
      description: "Compatible with switch devices for users with motor impairments."
    },
    {
      name: "Magnification Software",
      examples: ["ZoomText", "MAGic", "Windows Magnifier"],
      compatibility: "Full",
      description: "Optimized for screen magnification software up to 400% zoom."
    }
  ];

  const accessibilityTools = [
    {
      name: "Accessibility Checker",
      description: "Built-in tool to identify and fix accessibility issues",
      icon: CheckCircle,
      color: "text-emerald-600"
    },
    {
      name: "Contrast Analyzer",
      description: "Real-time color contrast checking for text and backgrounds",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      name: "Keyboard Tester",
      description: "Test keyboard navigation and shortcuts",
      icon: Keyboard,
      color: "text-purple-600"
    },
    {
      name: "Screen Reader Simulator",
      description: "Experience how screen readers interpret our content",
      icon: Monitor,
      color: "text-orange-600"
    }
  ];

  return (
    <FooterPageTemplate
      title="Accessibility"
      subtitle="Making plant care accessible to everyone"
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Accessibility', href: '/accessibility' }
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
              <Heart className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Accessibility at SproutSphere
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We believe that the joy of plant care should be accessible to everyone. 
            Our platform is designed with inclusivity at its core, ensuring that users 
            of all abilities can enjoy growing and caring for plants.
          </p>
        </motion.div>

        {/* Our Commitment */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Accessibility Commitment
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We are committed to creating an inclusive digital experience for all users
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Inclusive Design
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every feature is designed with accessibility in mind from the start
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Standards Compliance
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Meeting and exceeding international accessibility standards
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Continuous Improvement
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Regular testing and updates to enhance accessibility features
              </p>
            </div>
          </div>
        </motion.section>

        {/* Accessibility Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Accessibility Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessibilityFeatures.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-4">
                    <category.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>
                
                <ul className="space-y-2">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Compliance Standards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Compliance Standards
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {complianceStandards.map((standard, index) => (
              <motion.div
                key={standard.standard}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {standard.standard}
                  </h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-medium rounded-full">
                    {standard.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Level: {standard.level}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {standard.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Assistive Technology Support */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Assistive Technology Support
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {assistiveTechnologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tech.name}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-medium rounded-full">
                    {tech.compatibility}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {tech.description}
                </p>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tech.examples.map((example, exampleIndex) => (
                      <span
                        key={exampleIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Accessibility Tools */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Built-in Accessibility Tools
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accessibilityTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {tool.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact & Support */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Need Help with Accessibility?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Our accessibility team is here to help you get the most out of SproutSphere
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Info className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Accessibility Support
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Get help with accessibility features and settings
                </p>
              </div>
              
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Report Issues
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Report accessibility issues or suggest improvements
                </p>
              </div>
              
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Testing & Feedback
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Participate in accessibility testing and provide feedback
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Contact Accessibility Team
              </a>
            </div>
          </div>
        </motion.section>

        {/* Accessibility Statement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Accessibility Statement
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              SproutSphere is committed to ensuring digital accessibility for people with disabilities. 
              We are continually improving the user experience for everyone and applying the relevant 
              accessibility standards.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our platform conforms to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA 
              standards. These guidelines explain how to make web content more accessible for people 
              with disabilities and more user-friendly for everyone.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              We welcome your feedback on the accessibility of SproutSphere. Please let us know if 
              you encounter accessibility barriers or have suggestions for improvement.
            </p>
          </div>
        </motion.section>
      </div>
    </FooterPageTemplate>
  );
};

export default AccessibilityPage; 