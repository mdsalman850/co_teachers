import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar, Users, MapPin, Book, Award, Maximize2, Minimize2, X, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

// Reusable Year Badge Component
const YearBadge = ({ year, isFullscreen }: { year: string; isFullscreen: boolean }) => (
  <div className={`absolute top-3 right-3 z-10 px-4 py-1.5 rounded-full font-bold text-white shadow-lg ${
    isFullscreen ? 'text-xs px-3 py-1' : 'text-sm'
  }`}
  style={{
    background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
  }}>
    {year}
  </div>
);

// Reusable CTA Button Component
const CTAButton = ({ isFullscreen }: { isFullscreen: boolean }) => (
  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-white transition-all duration-250 ${
    isFullscreen ? 'text-xs px-3 py-1.5' : 'text-sm'
  }`}
  style={{
    background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
    boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(99, 102, 241, 0.4)';
    e.currentTarget.style.transform = 'translateY(-1px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(99, 102, 241, 0.3)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}>
    <ArrowRight className={isFullscreen ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
    <span>Click for more details</span>
  </div>
);

// Timeline Card Component
const TimelineCard = ({ 
  event, 
  index, 
  isLeft, 
  onClick, 
  isFullscreen,
  totalEvents,
  isLast
}: { 
  event: any; 
  index: number; 
  isLeft: boolean; 
  onClick: () => void;
  isFullscreen: boolean;
  totalEvents: number;
  isLast: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={`relative flex items-center ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-col`}
    >
      {/* Straight connecting line */}
      {!isLast && (
        <div className="hidden md:block absolute left-1/2 top-full transform -translate-x-1/2 w-0.5 h-28 z-0"
          style={{
            background: 'linear-gradient(to bottom, #f97316 0%, #3b82f6 50%, #22c55e 100%)',
            opacity: 0.6,
          }}
        />
      )}

      <div
        className={`w-full md:w-[42%] mx-auto ${
          isLeft ? 'md:mr-auto md:ml-0 md:pr-8' : 'md:ml-auto md:mr-0 md:pl-8'
        }`}
        style={{
          maxWidth: '500px',
        }}
      >
        <motion.div
          onClick={onClick}
          className="group cursor-pointer"
          whileHover={{ y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-250"
            style={{
              borderRadius: '20px',
            }}
          >
            {/* Image Section */}
            <div className={`relative bg-gray-100 flex items-center justify-center overflow-hidden ${
              isFullscreen ? 'h-64' : 'h-56'
            }`}>
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-full h-full object-contain rounded-t-2xl"
                style={{
                  borderRadius: '20px 20px 0 0',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
                onError={(e: any) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3EHistorical Image%3C/text%3E%3C/svg%3E';
                }}
              />
              <YearBadge year={event.year} isFullscreen={isFullscreen} />
            </div>

            {/* Content Section */}
            <div 
              className={`${event.color === 'bg-gradient-to-r from-orange-500 via-white to-green-600' ? 'text-gray-900' : 'text-white'} ${isFullscreen ? 'p-6' : 'p-8'}`}
              style={{
                background: event.color === 'bg-gradient-to-r from-orange-500 via-white to-green-600'
                  ? 'linear-gradient(135deg, #f97316 0%, #fef3c7 50%, #22c55e 100%)'
                  : event.color.includes('purple')
                  ? 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)'
                  : event.color.includes('blue')
                  ? event.color.includes('700')
                    ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                  : event.color.includes('red')
                  ? event.color.includes('800')
                    ? 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)'
                    : event.color.includes('700')
                    ? 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)'
                    : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                  : event.color.includes('orange')
                  ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
                  : event.color.includes('green')
                  ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                  : event.color.includes('teal')
                  ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              }}
            >
              <h3 className={`font-semibold mb-3 ${
                isFullscreen ? 'text-xl' : 'text-2xl'
              }`} style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                textShadow: event.color === 'bg-gradient-to-r from-orange-500 via-white to-green-600' 
                  ? 'none' 
                  : '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}>
                {event.title}
              </h3>
              <p className={`mb-4 ${
                isFullscreen ? 'text-sm' : 'text-base'
              }`} style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                color: event.color === 'bg-gradient-to-r from-orange-500 via-white to-green-600'
                  ? '#1f2937'
                  : 'rgba(255, 255, 255, 1)',
                lineHeight: '1.6',
                textShadow: event.color === 'bg-gradient-to-r from-orange-500 via-white to-green-600'
                  ? 'none'
                  : '0 1px 3px rgba(0, 0, 0, 0.4)',
                fontWeight: 500,
              }}>
                {event.description}
              </p>
              <CTAButton isFullscreen={isFullscreen} isIndependence={event.color === 'bg-gradient-to-r from-orange-500 via-white to-green-600'} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ModernIndiaTimeline = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
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
      setIsFullscreen(!isFullscreen);
    }
  }, [isFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isFullscreen, toggleFullscreen]);

  // Prevent body scroll when fullscreen (but allow container scroll)
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

  const events = [
    {
      id: 1,
      year: '1453',
      title: 'Constantinople Falls',
      category: 'trade',
      description: 'Land route closed in 1453 due to the conquest of the city by the Turks. Europeans had to explore the sea routes.',
      imageUrl: '/images/modern_india/constantinople_falls.jpg',
      color: 'bg-purple-600',
      importance: 'This closure forced Europeans to find sea routes to India',
      details: {
        year: '1453',
        event: 'Constantinople conquered by Turks',
        impact: 'Overland trade route to India closed',
        result: 'Europeans had to explore sea routes'
      }
    },
    {
      id: 2,
      year: '1498',
      title: 'Vasco da Gama Arrives',
      category: 'trade',
      description: 'Portuguese Vasco da Gama came to India after finding a sea route to India.',
      imageUrl: '/images/modern_india/vasco_da_gama.png',
      color: 'bg-blue-500',
      importance: 'First European to reach India by sea route',
      details: {
        explorer: 'Vasco da Gama',
        nationality: 'Portuguese',
        achievement: 'Found sea route to India',
        year: '1498'
      }
    },
    {
      id: 3,
      year: '1600',
      title: 'Europeans Come for Trade',
      category: 'trade',
      description: 'Later the Dutch, the English, and the French came to India for trade. British East India Company established.',
      imageUrl: '/images/modern_india/europeans_trade.jpg',
      color: 'bg-blue-700',
      importance: 'Beginning of European commercial presence in India',
      details: {
        europeanPowers: 'Dutch, English, French',
        purpose: 'Trade',
        yearEstablished: '1600',
        company: 'British East India Company'
      }
    },
    {
      id: 4,
      year: '1757',
      title: 'Battle of Plassey',
      category: 'battle',
      description: 'Battle fought between British East India Company (led by Robert Clive) and Nawab of Bengal (Siraj ud-Daulah). Despite being outnumbered, British won decisive victory due to political intrigue and betrayal.',
      imageUrl: '/images/modern_india/battle_of_plassey.jpg',
      color: 'bg-red-600',
      importance: 'Beginning of British rule in India. Changed the course of Indian history, leading to British dominance for nearly two centuries.',
      details: {
        date: 'June 23, 1757',
        location: 'Bengal (modern-day India and Bangladesh)',
        britishLeader: 'Robert Clive',
        nawabLeader: 'Siraj ud-Daulah',
        keyFactor: 'Political intrigue and betrayal within Nawab\'s court',
        result: 'British won despite being outnumbered',
        significance: 'East India Company established control over Bengal'
      }
    },
    {
      id: 5,
      year: '1764',
      title: 'Battle of Buxar',
      category: 'battle',
      description: 'British East India Company faced coalition of Indian rulers (Nawab of Oudh, Mughal Emperor Shah Alam II, Nawab of Bengal). British had fewer soldiers but better weapons and strategy.',
      imageUrl: '/images/modern_india/battle_of_buxar.jpg',
      color: 'bg-red-700',
      importance: 'Turning point in Indian history. Paved the way for British control over much of India. Changed lives of many people.',
      details: {
        date: 'October 22, 1764',
        location: 'Buxar, Bihar',
        britishLeader: 'Hector Munro',
        indianCoalition: 'Nawab of Oudh, Shah Alam II, Nawab of Bengal',
        britishAdvantage: 'Better weapons and strategy',
        outcome: 'British emerged victorious',
        impact: 'Shaped country\'s future'
      }
    },
    {
      id: 6,
      year: '1857',
      title: 'Revolt of 1857',
      category: 'revolt',
      description: 'Great event in modern India history. British came for trade and entered Indian politics. Revolt confined to northern and central India.',
      imageUrl: '/images/modern_india/revolt_1857.jpg',
      color: 'bg-orange-600',
      importance: 'First major uprising against British rule',
      details: {
        regions: 'Northern and Central India',
        participation: 'Only handful of princely kings took part',
        britishSupport: 'Some princely kings helped the British',
        indianWeakness: 'Lacked military resources and modern combat equipment',
        causes: 'Political, Economic, Socio-religious, Military',
        outcome: 'English able to suppress the revolt'
      }
    },
    {
      id: 7,
      year: '1920',
      title: 'Non-Cooperation Movement',
      category: 'movement',
      description: 'Under Gandhiji\'s leadership, Non-Cooperation Movement was organized. Great people movement with participation from all religions and communities.',
      imageUrl: '/images/modern_india/non_cooperation_movement.webp',
      color: 'bg-green-600',
      importance: 'Part of Indian Independence Movement against British rule. Took place in all parts of the country.',
      details: {
        leader: 'Mahatma Gandhi',
        year: '1920',
        type: 'Public movement',
        participation: 'People of all religions and communities',
        scope: 'All parts of the country',
        nature: 'Non-violent resistance'
      }
    },
    {
      id: 8,
      year: '1930',
      title: 'Civil Obedience Movement (Civil Disobedience/Salt March)',
      category: 'movement',
      description: 'Under Gandhiji\'s leadership, Civil Obedience Movement was organized. Also known as Civil Disobedience Movement and Salt March where Gandhi walked to break salt law.',
      imageUrl: '/images/modern_india/dandi_march.png',
      color: 'bg-teal-600',
      importance: 'Part of the great people movement for Indian Independence with participation from all religions and communities.',
      details: {
        leader: 'Mahatma Gandhi',
        year: '1930',
        officialName: 'Civil Obedience Movement',
        alsoKnownAs: 'Civil Disobedience / Salt March',
        action: 'Gandhi walked to make salt',
        purpose: 'Break British salt law',
        participation: 'All religions and communities'
      }
    },
    {
      id: 9,
      year: '1942',
      title: 'Quit India Movement',
      category: 'movement',
      description: 'Under Gandhiji\'s leadership, Quit India Movement was organized. Part of the Indian Independence Movement against British rule.',
      imageUrl: '/images/modern_india/quit_india_movement.webp',
      color: 'bg-red-800',
      importance: 'Final major public movement before independence. Great people movement with participation from all parts of country.',
      details: {
        leader: 'Mahatma Gandhi',
        year: '1942',
        type: 'Public movement',
        demand: 'British to quit India',
        participation: 'All religions and communities',
        scope: 'All parts of the country'
      }
    },
    {
      id: 10,
      year: '1947',
      title: 'India Achieved Independence',
      category: 'freedom',
      description: 'Finally, India achieved Independence on August 15th, 1947. End of British rule after the great Indian Independence Movement.',
      imageUrl: '/images/modern_india/independence_1947.jpg',
      color: 'bg-gradient-to-r from-orange-500 via-white to-green-600',
      importance: 'Birth of independent India - end of British Raj after nearly 200 years',
      details: {
        date: 'August 15, 1947',
        achievement: 'Freedom from British rule',
        movement: 'Indian Independence Movement',
        participation: 'People of all religions and communities',
        flagDesigner: 'Pingali Venkayya',
        firstPM: 'Jawaharlal Nehru'
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Events', icon: Calendar },
    { id: 'trade', name: 'Trade & Exploration', icon: MapPin },
    { id: 'battle', name: 'Battles', icon: Award },
    { id: 'revolt', name: 'Revolts', icon: Users },
    { id: 'movement', name: 'Freedom Movements', icon: Book },
    { id: 'freedom', name: 'Independence', icon: Award }
  ];

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.category === filter);

  return (
    <div 
      ref={containerRef}
      className={`transition-all duration-300 ${
        isFullscreen 
          ? 'h-screen w-screen overflow-y-auto p-2' 
          : 'min-h-screen p-4'
      }`}
      style={{
        background: 'linear-gradient(to bottom, #F8FAFC 0%, #EEF2FF 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      <div className={`mx-auto transition-all duration-300 ${isFullscreen ? 'max-w-full px-4' : 'max-w-7xl px-6 md:px-12 lg:px-16'}`}>
        {/* Header */}
        <motion.div 
          className={`text-center mb-8 relative ${isFullscreen ? 'mb-4' : ''}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className={`absolute top-0 right-0 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 p-2.5 rounded-xl shadow-lg transition-all duration-250 z-10 flex items-center gap-2 ${
              isFullscreen ? 'top-2 right-2' : ''
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-5 h-5" />
                <span className="text-sm font-medium">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-5 h-5" />
                <span className="text-sm font-medium">Fullscreen</span>
              </>
            )}
          </button>
          
          <h1 className={`font-bold text-gray-800 mb-3 ${isFullscreen ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'}`}
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700 }}>
            Modern India Timeline
          </h1>
          <p className={`text-gray-600 mb-2 ${isFullscreen ? 'text-base' : 'text-lg'}`}
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 500 }}>
            From European Trade to Independence (1453-1947)
          </p>
          <p className={`text-gray-500 ${isFullscreen ? 'text-xs' : 'text-sm'}`}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Click on any event to learn more details
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          className={`flex flex-wrap gap-2 mb-8 justify-center ${isFullscreen ? 'mb-4' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-250 ${
                  filter === cat.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md'
                } ${isFullscreen ? 'text-xs px-3 py-1.5' : 'text-sm'}`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <Icon className={isFullscreen ? 'w-3 h-3' : 'w-4 h-4'} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Timeline */}
        <div className="relative px-6 md:px-12 lg:px-20 xl:px-24">
          {/* Events */}
          <div className="space-y-24 md:space-y-32 relative">
            {filteredEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              const isLast = index === filteredEvents.length - 1;
              return (
                <div key={event.id} className="relative">
                  {/* Central timeline node (connects cards) */}
                  <div 
                    className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full z-10"
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
                      boxShadow: '0 0 0 6px rgba(249, 115, 22, 0.2), 0 4px 16px rgba(0, 0, 0, 0.25)',
                      top: '50%',
                      marginTop: '-12px',
                      border: '3px solid white',
                    }}
                  />
                  
                  <TimelineCard
                    event={event}
                    index={index}
                    isLeft={isLeft}
                    onClick={() => setSelectedEvent(event)}
                    isFullscreen={isFullscreen}
                    totalEvents={filteredEvents.length}
                    isLast={isLast}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Modal */}
        {selectedEvent && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEvent(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div 
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Image Header */}
              <div className="relative bg-gray-100 flex items-center justify-center min-h-[400px] max-h-[500px] overflow-hidden">
                <img 
                  src={selectedEvent.imageUrl} 
                  alt={selectedEvent.title}
                  className="w-full h-full max-h-[500px] object-contain"
                  style={{
                    borderRadius: '24px 24px 0 0',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                  onError={(e: any) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect width="600" height="400" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23999"%3EHistorical Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-all duration-250 z-10"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
                <div 
                  className="absolute bottom-4 left-4 px-5 py-2 rounded-full font-bold text-white shadow-lg z-10"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
                  }}
                >
                  {selectedEvent.year}
                </div>
              </div>

              <div className={`space-y-5 ${isFullscreen ? 'p-5' : 'p-8'}`}>
                <h2 className={`font-bold text-gray-800 ${
                  isFullscreen ? 'text-2xl' : 'text-3xl'
                }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700 }}>
                  {selectedEvent.title}
                </h2>

                <div className={`bg-orange-50/80 backdrop-blur-sm rounded-2xl ${isFullscreen ? 'p-4' : 'p-6'}`}
                  style={{ borderRadius: '16px' }}>
                  <h3 className={`font-bold text-gray-800 mb-2 ${
                    isFullscreen ? 'text-base' : 'text-lg'
                  }`}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600 }}>
                    Description
                  </h3>
                  <p className={`text-gray-700 ${
                    isFullscreen ? 'text-sm' : 'text-base'
                  }`}
                  style={{ 
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: '#6B7280',
                    lineHeight: '1.6',
                  }}>
                    {selectedEvent.description}
                  </p>
                </div>

                <div className={`bg-blue-50/80 backdrop-blur-sm rounded-2xl ${isFullscreen ? 'p-4' : 'p-6'}`}
                  style={{ borderRadius: '16px' }}>
                  <h3 className={`font-bold text-gray-800 mb-2 ${
                    isFullscreen ? 'text-base' : 'text-lg'
                  }`}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600 }}>
                    Historical Importance
                  </h3>
                  <p className={`text-gray-700 ${
                    isFullscreen ? 'text-sm' : 'text-base'
                  }`}
                  style={{ 
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: '#6B7280',
                    lineHeight: '1.6',
                  }}>
                    {selectedEvent.importance}
                  </p>
                </div>

                {selectedEvent.details && (
                  <div className={`bg-green-50/80 backdrop-blur-sm rounded-2xl ${isFullscreen ? 'p-4' : 'p-6'}`}
                    style={{ borderRadius: '16px' }}>
                    <h3 className={`font-bold text-gray-800 mb-3 ${
                      isFullscreen ? 'text-base' : 'text-lg'
                    }`}
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600 }}>
                      Key Details
                    </h3>
                    <div className="space-y-2.5">
                      {Object.entries(selectedEvent.details).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className={`font-semibold text-gray-700 min-w-[140px] capitalize ${
                            isFullscreen ? 'text-xs' : 'text-sm'
                          }`}
                          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600 }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className={`text-gray-600 ${
                            isFullscreen ? 'text-xs' : 'text-sm'
                          }`}
                          style={{ 
                            fontFamily: 'Inter, system-ui, sans-serif',
                            color: '#6B7280',
                          }}>
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          className={`text-center text-gray-600 ${isFullscreen ? 'mt-8' : 'mt-12'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Book className={`inline-block mr-2 ${isFullscreen ? 'w-4 h-4' : 'w-6 h-6'}`} />
          <span className={isFullscreen ? 'text-sm' : 'text-base'}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Chapter 4: Modern India
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernIndiaTimeline;
