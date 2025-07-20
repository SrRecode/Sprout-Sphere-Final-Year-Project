import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import plantAnimation from '../assets/animations/plant.json';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaFacebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaTwitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaInstagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaPinterest />, href: 'https://pinterest.com', label: 'Pinterest' },
  ];

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press', href: '/press' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQs', href: '/faqs' },
        { label: 'Shipping', href: '/shipping' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Plant Care Guides', href: '/guides' },
        { label: 'Community Forum', href: '/forum' },
        { label: 'Plant Database', href: '/database' },
        { label: 'Expert Advice', href: '/expert-advice' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Accessibility', href: '/accessibility' },
      ],
    },
  ];

  return (
    <footer className="relative bg-dark-800 text-dark-100 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary-gradient"></div>
      <div className="absolute top-40 left-10 w-72 h-72 rounded-full bg-primary-400/5 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-teal-400/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-16">
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8"
        >
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <Lottie
                  animationData={plantAnimation}
                  loop={true}
                  className="w-full h-full"
                />
              </div>
              <h2 className="font-display text-2xl font-bold bg-clip-text text-transparent bg-primary-gradient">
                SproutSphere
              </h2>
            </div>
            <p className="text-gray-400 max-w-sm">
              Cultivating a greener future, one plant at a time. Join our community of plant enthusiasts and transform your space into a thriving oasis.
            </p>
            
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-gradient transition-all duration-300 ease-smooth"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <div className="pt-6">
              <h3 className="text-white font-medium mb-3">Subscribe to our Newsletter</h3>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 flex-grow"
                />
                <button
                  type="submit"
                  className="bg-primary-gradient hover:opacity-90 text-white font-medium px-4 py-2 rounded-full transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-display text-lg font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-primary-400 transition-colors ease-smooth inline-block py-1"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p 
              className="text-gray-500 text-sm"
            >
              © {currentYear} SproutSphere. All rights reserved.
            </p>
            
            <div 
              className="flex flex-wrap justify-center gap-6 text-sm text-gray-500"
            >
              <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms</Link>
              <Link to="/cookies" className="hover:text-primary-400 transition-colors">Cookies</Link>
              <Link to="/sitemap" className="hover:text-primary-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 