import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import AuthPopups from './AuthPopups';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Detect active section based on scroll position
      const sections = ['features', 'how-it-works', 'pricing'];
      const scrollPosition = window.scrollY + 200; // Increased offset for better detection
      
      let currentSection = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          
          // Special handling for pricing (footer) - if we're near the bottom, show pricing as active
          if (section === 'pricing') {
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.scrollY;
            
            // If we're in the last 20% of the page, show pricing as active
            if (scrollTop + windowHeight >= documentHeight * 0.8) {
              currentSection = 'pricing';
              break;
            }
          }
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            currentSection = section;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Call once to set initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold text-primary-text font-inter">
              CO<span className="text-accent-bio">TEACHERS</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a 
                href="#features" 
                className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('features'); // Immediately set as active
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('how-it-works'); // Immediately set as active
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                How it works
              </a>
              <a 
                href="#pricing" 
                className={`nav-link ${activeSection === 'pricing' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('pricing'); // Immediately set as active
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Pricing
              </a>
            </div>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setShowSignIn(true)}
              className="text-primary-text hover:text-accent-bio transition-colors font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => setShowSignUp(true)}
              className="btn-primary"
            >
              Sign Up — It's Free
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary-text"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2">
              <a 
                href="#features" 
                className={`block px-3 py-2 text-primary-text hover:text-accent-bio ${activeSection === 'features' ? 'bg-gray-100 border-l-4 border-gray-500' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className={`block px-3 py-2 text-primary-text hover:text-accent-bio ${activeSection === 'how-it-works' ? 'bg-gray-100 border-l-4 border-gray-500' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                How it works
              </a>
              <a 
                href="#pricing" 
                className={`block px-3 py-2 text-primary-text hover:text-accent-bio ${activeSection === 'pricing' ? 'bg-gray-100 border-l-4 border-gray-500' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Pricing
              </a>
              <div className="px-3 py-2 space-y-2">
                <button 
                  onClick={() => setShowSignIn(true)}
                  className="w-full text-left text-primary-text hover:text-accent-bio"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setShowSignUp(true)}
                  className="btn-primary w-full"
                >
                  Sign Up — It's Free
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Authentication Popups */}
      <AuthPopups
        showSignUp={showSignUp}
        showSignIn={showSignIn}
        onClose={() => {
          setShowSignUp(false);
          setShowSignIn(false);
        }}
        onSwitchToSignIn={() => {
          setShowSignUp(false);
          setShowSignIn(true);
        }}
        onSwitchToSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />
    </header>
  );
};

export default Header;