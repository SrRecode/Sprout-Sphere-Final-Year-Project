import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock } from 'lucide-react';
import FooterPageTemplate from './FooterPageTemplate';
import AnimatedButton from '../../components/AnimatedButton';
import { toast } from 'react-toastify';

const ContactPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact info
  const contactInfo = [
    { 
      icon: <Mail className="h-5 w-5 text-primary-500" />, 
      title: 'Email Us', 
      info: 'hello@sproutsphere.com',
      description: 'For general inquiries and support',
      link: 'mailto:hello@sproutsphere.com'
    },
    { 
      icon: <Phone className="h-5 w-5 text-primary-500" />, 
      title: 'Call Us', 
      info: '(555) 123-4567',
      description: 'Mon-Fri from 9am to 5pm PST',
      link: 'tel:+15551234567'
    },
    { 
      icon: <MapPin className="h-5 w-5 text-primary-500" />, 
      title: 'Visit Us', 
      info: '123 Green Street, San Francisco, CA 94110',
      description: 'Our headquarters location'
    },
    { 
      icon: <Clock className="h-5 w-5 text-primary-500" />, 
      title: 'Business Hours', 
      info: 'Monday - Friday: 9am - 5pm PST',
      description: 'Weekend: Closed'
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: 'How do I get personalized plant recommendations?',
      answer: 'You can get personalized plant recommendations by using our AI Plant Recommendation feature. Simply navigate to the AI Recommendations page, describe your environment and preferences, and our AI will suggest plants that match your needs.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order is shipped, you\'ll receive a tracking number via email. You can also view your order status and tracking information in your account dashboard under "My Orders".'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day satisfaction guarantee. If you\'re not satisfied with your purchase, you can return it within 30 days for a full refund. Please note that plants must be returned in their original condition.'
    },
    {
      question: 'How can I join the SproutSphere community?',
      answer: 'You can join our community by creating an account and visiting the Community Hub. There, you can connect with other plant enthusiasts, share tips, and participate in discussions.'
    }
  ];

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Your message has been sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <FooterPageTemplate
      title="Contact Us"
      subtitle="We'd love to hear from you"
      breadcrumbItems={[{ label: 'Contact Us' }]}
    >
      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {contactInfo.map((item, index) => (
          <motion.div 
            key={index}
            className="bg-white dark:bg-dark-800/50 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20 mr-4">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                {item.link ? (
                  <a 
                    href={item.link} 
                    className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                  >
                    {item.info}
                  </a>
                ) : (
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{item.info}</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        {/* Contact Form */}
        <div className="lg:w-7/12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="How can we help you?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="Let us know how we can assist you..."
              ></textarea>
            </div>
            
            <div>
              <AnimatedButton 
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                icon={Send}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </AnimatedButton>
            </div>
          </form>
        </div>
        
        {/* FAQ Section */}
        <div className="lg:w-5/12">
          <div className="bg-gray-50 dark:bg-dark-900/30 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center mb-6">
              <MessageSquare className="h-5 w-5 text-primary-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <motion.div 
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{item.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.answer}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <AnimatedButton
                as="a"
                href="/faqs"
                variant="outlinePrimary"
              >
                View All FAQs
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Visit Our Location</h2>
        <div className="bg-gray-100 dark:bg-dark-800 rounded-xl overflow-hidden h-80 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Map would be displayed here. For privacy reasons, we're not loading an actual map in this example.</p>
          </div>
          <div className="absolute bottom-4 left-4 bg-white dark:bg-dark-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">SproutSphere Headquarters</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">123 Green Street, San Francisco, CA 94110</p>
          </div>
        </div>
      </div>
      
      {/* Contact CTA */}
      <div className="bg-primary-gradient p-8 rounded-2xl text-white text-center">
        <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
        <p className="mb-6 max-w-lg mx-auto">
          Our customer support team is always ready to help. Reach out to us through any of the channels above, and we'll get back to you as soon as possible.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <AnimatedButton
            as="a" 
            href="tel:+15551234567" 
            variant="outlineWhite"
            icon={Phone}
          >
            Call Us Now
          </AnimatedButton>
          <AnimatedButton
            as="a" 
            href="mailto:hello@sproutsphere.com" 
            variant="outlineWhite"
            icon={Mail}
          >
            Email Us
          </AnimatedButton>
        </div>
      </div>
    </FooterPageTemplate>
  );
};

export default ContactPage; 