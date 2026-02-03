import React, { useState } from 'react';
import { Search, MessageCircle, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface NavBarProps {
  currentPath?: string;
}

const NavBar: React.FC<NavBarProps> = ({ currentPath = '/' }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Resources', path: '/resources', disabled: true }
  ];

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-black">CO</span>
              <span className="text-[#27AE60]">TEACHERS</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.disabled ? (
                <span
                  key={item.name}
                  className="text-sm font-medium text-gray-400 cursor-not-allowed"
                >
                  {item.name}
                </span>
              ) : (
                <a
                  key={item.name}
                  href={item.path === '/dashboard' ? '#/dashboard' : item.path === '/' ? '#/home' : item.path}
                  onClick={item.name === 'Home' ? handleHomeClick : undefined}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-[#27AE60] ${
                    currentPath === item.path
                      ? 'text-[#27AE60] border-b-2 border-[#27AE60] pb-1'
                      : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </a>
              )
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Ask AI Button */}
            <button className="bg-[#27AE60] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#219A52] transition-all duration-200 hover:scale-105 active:scale-95">
              <MessageCircle className="inline w-4 h-4 mr-2" />
              Ask AI
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 bg-gray-100 rounded-xl px-3 py-2 hover:bg-gray-200 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-[#27AE60] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <a href="#/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="inline w-4 h-4 mr-2" />
                    Profile
                  </a>
                  <a href="#/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Search className="inline w-4 h-4 mr-2" />
                    Dashboard
                  </a>
                  <a href="#/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="inline w-4 h-4 mr-2" />
                    Settings
                  </a>
                  <hr className="my-1" />
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="inline w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;