import React from 'react';
import { Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="pricing" className="bg-primary-text text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold font-inter mb-4">
              CO<span className="text-accent-bio">TEACHERS</span>
            </div>
            <p className="text-gray-300 font-poppins leading-relaxed mb-6 max-w-md">
              Making learning fun, interactive, and accessible for students aged 10-16 
              with AI-powered tutoring and engaging multimedia content.
            </p>
            
            {/* Language Selector Placeholder */}
            <div className="flex items-center space-x-2 text-gray-300">
              <Globe size={16} />
              <select className="bg-transparent border border-gray-600 rounded px-3 py-1 text-sm">
                <option value="en">English</option>
                <option value="es">Español (Coming Soon)</option>
                <option value="fr">Français (Coming Soon)</option>
              </select>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold font-inter mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-300 hover:text-accent-bio transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-300 hover:text-accent-bio transition-colors">How it Works</a></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-accent-bio transition-colors">Pricing</a></li>
              <li><a href="#subjects" className="text-gray-300 hover:text-accent-bio transition-colors">Subjects</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold font-inter mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-accent-bio transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent-bio transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent-bio transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent-bio transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-poppins">
              © 2024 COTEACHERS. All rights reserved. Safe learning environment for children.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-accent-bio transition-colors text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-accent-bio transition-colors text-sm">Safety</a>
              <a href="#" className="text-gray-400 hover:text-accent-bio transition-colors text-sm">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;