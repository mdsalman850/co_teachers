import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Sprout, Heart, GraduationCap, Handshake, Users, Mountain, Scale, X, ChevronRight, TreePine, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VillageSimulator = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fullscreen toggle similar to ModernIndiaTimeline
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  // Keep isFullscreen in sync with actual fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Exit fullscreen on ESC
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.fullscreenElement) {
        toggleFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isFullscreen, toggleFullscreen]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const sections = [
    {
      id: 'village-life',
      title: 'Village Life',
      icon: Home,
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      description: 'A village is a small group of houses and buildings in a rural area, where people live and work together.',
      image: '/images/villages/Village Life.png',
      details: {
        definition: 'Villages are often surrounded by farmland, forests, or other natural environments',
        characteristics: ['Small community', 'Rural area', 'Close-knit society', 'Agricultural focus'],
        importance: 'The heart of India lies in its villages'
      }
    },
    {
      id: 'occupations',
      title: 'Occupations',
      icon: Sprout,
      color: 'bg-amber-600',
      hoverColor: 'hover:bg-amber-700',
      description: 'Learn about the various occupations that sustain village life and economy.',
      image: '/images/villages/Occupations.png',
      details: {
        farming: 'Growing crops like wheat, rice, pulses, spices, and vegetables. Agriculture is the backbone of Indian villages.',
        animalHusbandry: 'Raising animals like cows, buffaloes, and chickens for milk, meat, and eggs.',
        craftsmanship: 'Making pottery, weaving, and carpentry.',
        smallBusiness: 'Running grocery stores, tea stalls, and other small businesses.',
        agriculture: 'Paddy cultivation under irrigation of tanks and tubewells. Farmers sell crops through cooperative societies.',
        nonAgricultural: 'Dairy products, poultry farms, sheep rearing, auto drivers, mason work'
      }
    },
    {
      id: 'culture',
      title: 'Culture & Festivals',
      icon: Heart,
      color: 'bg-pink-600',
      hoverColor: 'hover:bg-pink-700',
      description: 'Explore the rich cultural traditions and festivals celebrated in Indian villages.',
      image: '/images/villages/Culture.jpg',
      details: {
        traditions: 'Villages have strong traditions and customs, passed down through generations.',
        festivals: 'Diwali, Holi, Eid, Bathukamma celebrated with great enthusiasm',
        musicDance: 'Traditional music and dance are an important part of village culture',
        food: 'Homemade bread, curries, and sweets on festival days',
        importance: 'Culture binds the community together and preserves heritage'
      }
    },
    {
      id: 'religion',
      title: 'Religion',
      icon: Users,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      description: 'Understand the religious diversity and harmony in Indian villages.',
      image: '/images/villages/Religion.jpg',
      details: {
        hinduism: 'Many villages are predominantly Hindu, with temples and festivals dedicated to Hindu gods and goddesses',
        islam: 'Some villages have significant Muslim population, with mosques and Islamic festivals',
        others: 'Christians, Sikhs, Buddhists, and people of other religions living together harmoniously',
        harmony: 'Religious diversity exists peacefully in villages'
      }
    },
    {
      id: 'education',
      title: 'Education & Healthcare',
      icon: GraduationCap,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      description: 'Learn about educational and healthcare facilities in villages.',
      image: '/images/villages/Education and Healthcare.jpg',
      details: {
        schools: 'Villages often have primary schools, and sometimes higher secondary schools',
        healthcare: 'Villages may have a healthcare center or hospital with doctors and nurses',
        challenges: 'Limited access compared to cities',
        importance: 'Essential for village development'
      }
    },
    {
      id: 'challenges',
      title: 'Challenges',
      icon: Scale,
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700',
      description: 'Understand the challenges faced by villages in modern times.',
      image: '/images/villages/Challenges.jpg',
      details: {
        limitedResources: 'Limited access to electricity, water, and internet',
        migration: 'Villagers migrate to cities for better job opportunities, leading to brain drain',
        infrastructure: 'Lack of proper roads and transportation',
        solutions: 'Government schemes and rural development programs'
      }
    },
    {
      id: 'soils',
      title: 'Types of Soils',
      icon: Mountain,
      color: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700',
      description: 'Discover the different types of soils found in Indian villages and their uses.',
      image: '/images/villages/Types of soils.png',
      details: {
        blackSoil: 'Ideal for growing cotton, soybeans, and some oilseeds (Regur Soil)',
        redSoil: 'Used for cultivating crops like millets, pulses, and groundnuts',
        alluvialSoil: 'Highly fertile, suitable for rice, wheat, sugarcane, and vegetables',
        lateriteSoil: 'Mainly used for plantation crops like cashew, tea, and rubber',
        mountainSoil: 'Supports forest vegetation, maintains ecological balance',
        desertSoil: 'Limited agriculture and less vegetation due to arid conditions',
        fact: 'Earthworms are the real heroes of healthy soils!'
      }
    },
    {
      id: 'government',
      title: 'Local Self-Government',
      icon: Handshake,
      color: 'bg-indigo-600',
      hoverColor: 'hover:bg-indigo-700',
      description: 'Learn about democratic governance through Gram Panchayats in villages.',
      image: '/images/villages/Elections and local self-government.jpg',
      details: {
        gramPanchayat: 'Local self-government bodies in Indian villages',
        elections: 'Villagers elect their representatives who work for community welfare',
        periodic: 'Elections held periodically for democratic participation',
        importance: 'Provides opportunity to voice opinions and concerns',
        development: 'Representatives work towards welfare and development of community'
      }
    }
  ];

  const didYouKnow = [
    {
      fact: 'India has the largest irrigated land in the world',
      detail: '96 Million hectares of Indian land area is irrigated every year'
    },
    {
      fact: 'Uttar Pradesh is India\'s top farming state',
      detail: 'Leading agricultural producer in the country'
    },
    {
      fact: 'Earthworms are the real heroes of healthy soils',
      detail: 'They improve soil fertility and structure'
    }
  ];

  return (
    <div
      ref={containerRef}
      className={`bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 transition-all duration-300 ${
        isFullscreen ? 'h-screen w-screen overflow-y-auto p-2' : 'min-h-screen p-4'
      }`}
    >
      <div className={`mx-auto ${isFullscreen ? 'max-w-full px-4' : 'max-w-7xl'}`}>
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-end mb-2">
            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 text-gray-700 shadow-md hover:bg-white hover:shadow-lg text-sm font-medium transition-all duration-200"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <TreePine className="w-12 h-12 text-green-700" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              All About Villages
            </h1>
            <Home className="w-12 h-12 text-amber-700" />
          </div>
          <p className="text-lg text-gray-600 mb-2">
            Explore the Rich Tapestry of Indian Village Life
          </p>
          <p className="text-sm text-gray-500">
            Click on any section to learn more about village life, culture, and traditions
          </p>
        </motion.div>

        {/* Did You Know Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sprout className="w-6 h-6" />
            Did You Know?
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {didYouKnow.map((item, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
                <p className="font-bold mb-2">{item.fact}</p>
                <p className="text-sm opacity-90">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline-style layout similar to Modern India */}
        <div className="relative max-w-6xl mx-auto mb-12">
          {/* Center vertical line */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5"
            style={{
              background:
                'linear-gradient(to bottom, #22c55e 0%, #f97316 50%, #0ea5e9 100%)',
              opacity: 0.5,
            }}
          />

          <div className="space-y-12">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={section.id}
                  className={`relative flex items-center flex-col ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  {/* Center dot */}
                  <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 rounded-full bg-white shadow-md" />
                      <div
                        className="absolute inset-1 rounded-full"
                        style={{
                          background:
                            'radial-gradient(circle, #22c55e 0%, #f97316 60%, #0ea5e9 100%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Card container */}
                  <div
                    className={`w-full md:w-[46%] ${
                      isLeft ? 'md:pr-10 md:mr-auto' : 'md:pl-10 md:ml-auto'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedSection(section)}
                      className="w-full text-left group"
                    >
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] overflow-hidden transition-all duration-300 group-hover:-translate-y-1">
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={section.image}
                            alt={section.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill=\"%23ddd\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"sans-serif\" font-size=\"18\" fill=\"%23999\"%3EVillage Scene%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <div className="absolute top-4 left-4">
                            <div className={`${section.color} p-3 rounded-full shadow-lg`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1">
                            Topic {index + 1}
                          </p>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {section.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            {section.description}
                          </p>
                          <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">
                            <span>Click for more details</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Detail Modal */}
        {selectedSection && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSection(null)}
          >
            <div 
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Image */}
              <div className="relative min-h-96 bg-gray-100 flex items-center justify-center">
                <img
                  src={selectedSection.image}
                  alt={selectedSection.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  style={{ maxWidth: '100%' }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect width="600" height="400" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                  }}
                />
                {/* Subtle gradient overlay for text readability only - no color tint */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                  <div className="bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg">
                    {React.createElement(selectedSection.icon, { className: `w-8 h-8 ${selectedSection.color.replace('bg-', 'text-')}` })}
                  </div>
                  <h2 className="text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{selectedSection.title}</h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div className="bg-amber-50 p-5 rounded-lg border-l-4 border-amber-500">
                  <p className="text-lg text-gray-800">{selectedSection.description}</p>
                </div>

                <div className="space-y-4">
                  {Object.entries(selectedSection.details).map(([key, value]) => (
                    <div key={key} className="bg-white border-2 border-gray-100 rounded-lg p-5 hover:border-gray-200 transition">
                      <h3 className="font-bold text-gray-800 text-lg mb-2 capitalize flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${selectedSection.color}`}></span>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      {Array.isArray(value) ? (
                        <ul className="space-y-1 ml-4">
                          {value.map((item, idx) => (
                            <li key={idx} className="text-gray-700 flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 mt-1 flex-shrink-0 text-green-600" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 bg-white rounded-lg p-6 shadow-md">
          <p className="text-sm text-gray-500">
            "The heart of India lies in its villages" - Explore their lifestyle, culture, economy, and traditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default VillageSimulator;