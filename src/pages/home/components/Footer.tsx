import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo */}
          <div className="text-xl font-bold tracking-tight">
            <span className="text-black">CO</span>
            <span className="text-[#27AE60]">TEACHERS</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <a href="/help" className="text-sm text-gray-600 hover:text-[#27AE60] transition-colors duration-200">
              Help
            </a>
            <a href="/privacy" className="text-sm text-gray-600 hover:text-[#27AE60] transition-colors duration-200">
              Privacy
            </a>
            <a href="/contact" className="text-sm text-gray-600 hover:text-[#27AE60] transition-colors duration-200">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center text-sm text-gray-500">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for young learners
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;