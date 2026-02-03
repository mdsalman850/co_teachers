import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  Droplet, 
  TreePine, 
  Mountain, 
  Sun, 
  Wind, 
  Waves, 
  Leaf, 
  Circle, 
  Zap, 
  Sparkles, 
  Recycle, 
  Minimize2, 
  Maximize2,
  ChevronDown,
  Check,
  X
} from 'lucide-react';

const NaturalResourcesSimulator = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fullscreen functionality
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 60;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const resources = [
    { icon: Droplet, name: 'Water', description: 'Essential for all life', color: 'text-blue-600', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
    { icon: TreePine, name: 'Forests', description: 'Oxygen & habitat', color: 'text-green-600', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop' },
    { icon: Mountain, name: 'Minerals', description: 'Construction & tech', color: 'text-gray-600', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop' },
    { icon: Sun, name: 'Solar Energy', description: 'Clean electricity', color: 'text-yellow-600', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop' },
  ];

  const renewableResources = [
    { icon: Sun, name: 'Solar Energy', description: 'Unlimited sunlight', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=200&fit=crop' },
    { icon: Wind, name: 'Wind Energy', description: 'Clean electricity', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=300&h=200&fit=crop' },
    { icon: Waves, name: 'Hydro Energy', description: 'Water power', image: '/images/natural_resources/Water Energy - dam.jpg' },
    { icon: Leaf, name: 'Biomass', description: 'Organic matter', image: '/images/natural_resources/bio energy.webp' },
    { icon: Waves, name: 'Tidal Energy', description: 'Ocean tides', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=200&fit=crop' },
  ];

  const nonRenewableResources = [
    { icon: Circle, name: 'Coal', description: 'Fossil fuel', image: '/images/natural_resources/Coal.jpg' },
    { icon: Zap, name: 'Oil/Petroleum', description: 'Liquid fuel', image: '/images/natural_resources/Oil Extraction.jpg' },
    { icon: Zap, name: 'Natural Gas', description: 'Heating fuel', image: 'https://source.unsplash.com/300x200/?natural-gas,gas-facility,energy' },
    { icon: Mountain, name: 'Iron', description: 'Metal mineral', image: '/images/natural_resources/Iron.jpg' },
    { icon: Sparkles, name: 'Precious Minerals', description: 'Gold, Silver', image: '/images/natural_resources/gold.jpg' },
  ];

  const minerals = [
    { icon: Circle, name: 'Coal', formula: 'Fossil Fuel', uses: ['Electricity generation', 'Steel production', 'Industrial heating'], image: '/images/natural_resources/Coal.jpg' },
    { icon: Mountain, name: 'Iron', formula: 'Fe - Metal', uses: ['Construction', 'Vehicles & machinery', 'Tools & equipment'], image: '/images/natural_resources/Iron.jpg' },
    { icon: Sparkles, name: 'Mica', formula: 'Silicate', uses: ['Electronics', 'Cosmetics', 'Insulation'], image: '/images/natural_resources/Mica.jpg' },
    { icon: Sparkles, name: 'Gold', formula: 'Au - Precious', uses: ['Jewelry', 'Electronics', 'Investment'], image: '/images/natural_resources/gold.jpg' },
    { icon: Sparkles, name: 'Silver', formula: 'Ag - Precious', uses: ['Jewelry', 'Photography', 'Electronics'], image: '/images/natural_resources/Silver.jpeg' },
    { icon: Sparkles, name: 'Bauxite', formula: 'Aluminum Ore', uses: ['Aluminum production', 'Aircraft', 'Packaging'], image: '/images/natural_resources/Bauxite.jpg' },
  ];

  const fourRs = [
    { 
      icon: '📉', 
      title: 'REDUCE', 
      description: 'Use less resources by consuming only what you need.',
      color: 'border-red-500',
      bgColor: 'bg-red-50',
      examples: ['Turn off lights', 'Use less water', 'Buy necessities only', 'Public transport']
    },
    { 
      icon: '🔄', 
      title: 'REUSE', 
      description: 'Use items multiple times instead of disposing.',
      color: 'border-blue-500',
      bgColor: 'bg-blue-50',
      examples: ['Refillable bottles', 'Donate old items', 'Cloth bags', 'Repair, don\'t replace']
    },
    { 
      icon: '♻️', 
      title: 'RECYCLE', 
      description: 'Convert waste into new products.',
      color: 'border-green-500',
      bgColor: 'bg-green-50',
      examples: ['Recycle paper', 'Separate plastic', 'Compost organic waste', 'E-waste recycling']
    },
    { 
      icon: '🚫', 
      title: 'REFUSE', 
      description: 'Say no to unnecessary items.',
      color: 'border-orange-500',
      bgColor: 'bg-orange-50',
      examples: ['No plastic bags', 'Refuse giveaways', 'Avoid disposables', 'Reject excess packaging']
    },
  ];

  const keyPoints = [
    { title: '🌍 Natural Resources', description: 'Materials in nature - essential for life and development.' },
    { title: '♻️ Renewable', description: 'Solar, Wind, Water - unlimited & eco-friendly.' },
    { title: '⛏️ Non-Renewable', description: 'Coal, Oil, Minerals - limited supply.' },
    { title: '💎 Minerals', description: 'Essential for tech but must be conserved.' },
    { title: '🌱 Conservation', description: 'Practice 4Rs: Reduce, Reuse, Recycle, Refuse.' },
    { title: '⚠️ Act Now', description: 'Use wisely, conserve diligently.' },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-gradient-to-br from-blue-50 via-green-50 to-amber-50 transition-all duration-300 relative ${
        isFullscreen ? 'h-screen w-screen overflow-y-auto p-2' : 'min-h-screen p-4'
      }`}
    >
      <div className={`mx-auto ${isFullscreen ? 'max-w-full px-4' : 'max-w-7xl px-6'}`}>
        <div className="pt-4">
          {/* Hero Section */}
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8 md:p-12 text-center mb-6 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Fullscreen Button - Inside Hero Section */}
            <div className="absolute top-4 right-4">
              <button
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 shadow-lg text-sm font-medium transition-all duration-200 border border-white/30"
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Natural Resources</h1>
            <p className="text-lg md:text-xl opacity-95 max-w-3xl mx-auto">
              Understanding the resources that nature provides and how to use them sustainably
            </p>
          </motion.div>

          {/* Introduction Section */}
          <motion.section
            id="introduction"
            className="bg-white rounded-xl p-6 md:p-8 mb-6 shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">What are Natural Resources?</h2>
              <p className="text-gray-600">Resources formed in nature without human intervention</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">📖 Definition</h3>
              <p className="text-gray-700 leading-relaxed">
                Natural resources are materials or substances that occur naturally in the environment and can be used for economic gain or to meet human needs. These resources are essential for life and include everything from the air we breathe to the minerals in the earth.
              </p>
            </div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden text-center hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    {resource.image ? (
                      <div className="relative h-32 overflow-hidden">
                        <img 
                          src={resource.image} 
                          alt={resource.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <Icon className={`absolute top-2 right-2 w-8 h-8 ${resource.color} bg-white/80 rounded-full p-1.5`} />
                      </div>
                    ) : (
                      <div className="p-6">
                        <Icon className={`w-12 h-12 mx-auto mb-3 ${resource.color}`} />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1">{resource.name}</h3>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          {/* Classification Section */}
          <motion.section
            id="classification"
            className="bg-white rounded-xl p-6 md:p-8 mb-6 shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Classification of Natural Resources</h2>
              <p className="text-gray-600">Resources are classified based on their ability to regenerate</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Renewable */}
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 text-center">
                  <h2 className="text-2xl font-bold mb-2">♻️ Renewable Resources</h2>
                  <p className="opacity-90">Can be recharged naturally</p>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  {renewableResources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (
                      <motion.div
                        key={index}
                        className="flex items-center p-3 mb-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {resource.image ? (
                          <img 
                            src={resource.image} 
                            alt={resource.name}
                            className="w-16 h-16 object-cover rounded-lg mr-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Icon className="w-8 h-8 mr-4 text-green-600" />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-800">{resource.name}</h4>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Non-Renewable */}
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 text-center">
                  <h2 className="text-2xl font-bold mb-2">⛏️ Non-Renewable Resources</h2>
                  <p className="opacity-90">Limited supply</p>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  {nonRenewableResources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (
                      <motion.div
                        key={index}
                        className="flex items-center p-3 mb-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {resource.image ? (
                          <img 
                            src={resource.image} 
                            alt={resource.name}
                            className="w-16 h-16 object-cover rounded-lg mr-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Icon className="w-8 h-8 mr-4 text-red-600" />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-800">{resource.name}</h4>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Renewable Energy Demonstrations */}
          <motion.section
            id="renewable"
            className="bg-white rounded-xl p-6 md:p-8 mb-6 shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">♻️ Renewable Energy Sources</h2>
              <p className="text-gray-600">Visual demonstrations of how renewable energy works</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Solar Energy */}
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 text-center">
                  <h3 className="font-semibold">☀️ Solar Energy</h3>
                </div>
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop"
                    alt="Solar Energy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.className = 'h-48 bg-gradient-to-b from-yellow-50 to-orange-50 relative overflow-hidden flex items-center justify-center';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/30 to-transparent"></div>
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sun className="w-12 h-12 text-yellow-300 drop-shadow-lg" />
                  </motion.div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
                  <p className="text-sm text-gray-600">Sun's rays captured by panels convert to electricity. Clean & unlimited.</p>
                </div>
              </motion.div>

              {/* Wind Energy */}
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 text-center">
                  <h3 className="font-semibold">💨 Wind Energy</h3>
                </div>
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop"
                    alt="Wind Energy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.className = 'h-48 bg-gradient-to-b from-blue-100 to-blue-200 relative overflow-hidden flex items-center justify-center';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-400/30 to-transparent"></div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
                  <p className="text-sm text-gray-600">Wind spins turbine blades generating electricity. Fully renewable.</p>
                </div>
              </motion.div>

              {/* Hydro Energy */}
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 text-center">
                  <h3 className="font-semibold">💧 Hydro Energy</h3>
                </div>
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src="/images/natural_resources/Water Energy - dam.jpg"
                    alt="Hydro Energy - Hydroelectric Dam"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.className = 'h-48 bg-gradient-to-b from-blue-200 to-blue-400 relative overflow-hidden flex items-center justify-center';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 to-transparent"></div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
                  <p className="text-sm text-gray-600">Water flows through dam turning turbines. Highly efficient power.</p>
                </div>
              </motion.div>

              {/* Biomass Energy */}
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 text-center">
                  <h3 className="font-semibold">🌳 Biomass Energy</h3>
                </div>
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src="/images/natural_resources/bio energy.webp"
                    alt="Biomass Energy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.className = 'h-48 bg-gradient-to-b from-green-100 to-green-300 relative overflow-hidden flex items-center justify-center';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-green-500/30 to-transparent"></div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
                  <p className="text-sm text-gray-600">Plant materials processed for energy. Trees absorb CO₂ while growing.</p>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Non-Renewable Energy */}
          <motion.section
            id="nonrenewable"
            className="bg-white rounded-xl p-6 md:p-8 mb-6 shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">⛏️ Non-Renewable Energy Sources</h2>
              <p className="text-gray-600">Understanding fossil fuels and their limitations</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Coal */}
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-4 text-center">
                  <h3 className="font-semibold">⚫ Coal Mining</h3>
                </div>
                <div className="h-48 relative overflow-hidden bg-gray-800">
                  <img 
                    src="/images/natural_resources/Coal Mining.jpg"
                    alt="Coal Mining"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Final fallback - show gradient background
                      target.style.display = 'none';
                      target.parentElement!.className = 'h-48 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden flex items-center justify-center';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-white text-center"><p class="text-4xl mb-2">⛏️</p><p class="text-sm">Coal Mining</p></div>';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-transparent"></div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Formation & Extraction:</h4>
                  <p className="text-sm text-gray-600">Formed over millions of years. Mined from underground. Non-renewable & causes pollution.</p>
                </div>
              </motion.div>

              {/* Oil */}
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 text-center">
                  <h3 className="font-semibold">🛢️ Oil Extraction</h3>
                </div>
                <div className="h-48 relative overflow-hidden bg-gray-900">
                  <img 
                    src="/images/natural_resources/Oil Extraction.jpg"
                    alt="Oil Extraction - Oil Rig"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Final fallback - show gradient background
                      target.style.display = 'none';
                      target.parentElement!.className = 'h-48 bg-gradient-to-b from-gray-700 to-gray-900 relative overflow-hidden flex items-center justify-center';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-white text-center"><p class="text-4xl mb-2">🛢️</p><p class="text-sm">Oil Extraction</p></div>';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-transparent"></div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Formation & Extraction:</h4>
                  <p className="text-sm text-gray-600">From ancient organisms. Drilled deep underground. Limited supply on Earth.</p>
                </div>
              </motion.div>
            </div>

            {/* Comparison Table */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Renewable vs Non-Renewable</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      <th className="p-4 text-left">Feature</th>
                      <th className="p-4 text-left">♻️ Renewable</th>
                      <th className="p-4 text-left">⛏️ Non-Renewable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Availability', renewable: 'Unlimited', nonRenewable: 'Limited' },
                      { feature: 'Regeneration', renewable: 'Natural recharge', nonRenewable: 'Millions of years' },
                      { feature: 'Environment', renewable: 'Clean', nonRenewable: 'Causes pollution' },
                      { feature: 'Sustainability', renewable: 'Forever', nonRenewable: 'Will run out' },
                    ].map((row, index) => (
                      <motion.tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <td className="p-4 font-semibold text-gray-800">{row.feature}</td>
                        <td className="p-4 text-green-600">
                          <Check className="w-5 h-5 inline mr-2" />
                          {row.renewable}
                        </td>
                        <td className="p-4 text-red-600">
                          <X className="w-5 h-5 inline mr-2" />
                          {row.nonRenewable}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* Minerals Section */}
          <motion.section
            id="minerals"
            className="bg-white rounded-xl p-6 md:p-8 mb-6 shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">💎 Important Minerals</h2>
              <p className="text-gray-600">Non-renewable resources essential for modern life</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">⚠️ Why are Minerals Non-Renewable?</h3>
              <p className="text-gray-700">Minerals form through geological processes taking millions of years. Once extracted, they cannot be replaced within human timescales.</p>
            </div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {minerals.map((mineral, index) => {
                const Icon = mineral.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-white border-t-4 border-purple-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    {mineral.image ? (
                      <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={mineral.image} 
                          alt={mineral.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // Try fallback image
                            if (!target.src.includes('photo-1581092160562-40aa08e78837')) {
                              target.src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&q=80&auto=format';
                            } else {
                              target.style.display = 'none';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                        <motion.div
                          className="absolute top-2 right-2"
                          animate={{ filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Icon className="w-8 h-8 text-white drop-shadow-lg bg-purple-600/80 rounded-full p-1.5" />
                        </motion.div>
                      </div>
                    ) : (
                      <motion.div
                        className="text-center mb-4"
                        animate={{ filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Icon className="w-12 h-12 mx-auto text-purple-600" />
                      </motion.div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-800 text-center mb-1">{mineral.name}</h3>
                    <p className="text-sm text-gray-500 text-center italic mb-4">{mineral.formula}</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <strong className="text-blue-600 block mb-2">Uses:</strong>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {mineral.uses.map((use, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          {/* Conservation Section */}
          <motion.section
            id="conservation"
            className="bg-white rounded-xl p-6 md:p-8 mb-6 shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">🌱 Conservation - The 4Rs</h2>
              <p className="text-gray-600">Our strategy to protect resources for future generations</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">🎯 Why Conservation Matters</h3>
              <p className="text-gray-700">Conservation ensures resources remain available for future generations. By practicing the 4Rs, we reduce environmental impact and preserve Earth's resources.</p>
            </div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {fourRs.map((r, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`bg-white border-t-4 ${r.color} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all`}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="text-5xl text-center mb-4">{r.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 text-center mb-3">{r.title}</h3>
                  <p className="text-sm text-gray-600 text-center mb-4">{r.description}</p>
                  <div className={`${r.bgColor} rounded-lg p-4 border-l-4 ${r.color}`}>
                    <strong className="text-gray-800 block mb-2">Examples:</strong>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {r.examples.map((example, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Key Points Summary */}
          <motion.section
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 md:p-8 mb-6 shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">🎯 Key Takeaways</h3>
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white border-l-4 border-blue-500 rounded-lg p-5 shadow-md"
                >
                  <strong className="text-gray-800 block mb-2">{point.title}</strong>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default NaturalResourcesSimulator;
