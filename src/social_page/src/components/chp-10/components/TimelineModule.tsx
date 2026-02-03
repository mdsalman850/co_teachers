import React, { useState } from 'react';
import { ChevronRight, Calendar, Flag, FileText, Users, Award, CheckCircle } from 'lucide-react';
import { TIMELINE_EVENTS } from '../constants';

export const TimelineModule: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const getIcon = (index: number) => {
    // Special icons for key events
    if (index === 3) return Flag; // Independence Day
    if (index === 6) return FileText; // Constitution Adoption
    if (index === 7) return Flag; // Republic Day
    if (index === 2) return Award; // Objective Resolution
    if (index === 4) return Users; // Drafting Committee
    return Calendar;
  };

  const getSpecialMessage = (index: number) => {
    if (index === 3) {
      return {
        text: "This day marks India's Independence from British rule!",
        color: "from-orange-50 to-amber-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-800",
        iconColor: "text-orange-600"
      };
    }
    if (index === 6) {
      return {
        text: "This day is celebrated as Constitution Day (Samvidhan Divas)!",
        color: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        iconColor: "text-blue-600"
      };
    }
    if (index === 7) {
      return {
        text: "This day is celebrated as Republic Day with great pride!",
        color: "from-green-50 to-emerald-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        iconColor: "text-green-600"
      };
    }
    return null;
  };

  const Icon = getIcon(activeIndex);
  const specialMessage = getSpecialMessage(activeIndex);

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-112px)] md:h-[calc(100vh-128px)]">
      {/* Fixed Header Section - Not Scrollable */}
      <div className="text-center mb-4 md:mb-6 space-y-3 md:space-y-4 shrink-0">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 font-serif">The Journey to the Constitution</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 mx-auto rounded-full"></div>
        <p className="text-slate-600 text-base md:text-lg">Explore 8 key milestones in the making of India's Constitution</p>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="grid md:grid-cols-[320px_1fr] gap-6 md:gap-8 items-start flex-1 min-h-0 overflow-hidden">
        {/* Navigation List - Only This Scrolls */}
        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar h-full">
          {TIMELINE_EVENTS.map((event, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex justify-between items-start group ${
                index === activeIndex
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl scale-[1.02]'
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:shadow-md border border-slate-200'
              }`}
            >
              <div className="flex-1 min-w-0 pr-2">
                <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                  index === activeIndex ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {event.year}
                </span>
                <span className={`font-bold text-sm block ${index === activeIndex ? 'text-white' : 'text-slate-900'}`}>
                  {event.date}
                </span>
                <span className={`text-xs mt-1 block leading-snug ${index === activeIndex ? 'text-blue-100' : 'text-slate-500'}`}>
                  {event.title}
                </span>
              </div>
              {index === activeIndex && <ChevronRight size={18} className="text-white shrink-0 mt-1" />}
            </button>
          ))}
        </div>

        {/* Display Area */}
        <div className="w-full">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-slate-200/50 relative overflow-visible md:sticky md:top-24">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Icon size={140} />
            </div>
            
            <div className="relative z-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-full text-sm font-bold mb-6 border border-orange-200">
                  <Calendar size={16} />
                  {TIMELINE_EVENTS[activeIndex].year}
               </div>
               <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 font-serif">
                 {TIMELINE_EVENTS[activeIndex].title}
               </h3>
               <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6">
                 {TIMELINE_EVENTS[activeIndex].description}
               </p>

               {specialMessage && (
                 <div className={`mt-6 md:mt-8 p-4 md:p-5 bg-gradient-to-r ${specialMessage.color} border-2 ${specialMessage.borderColor} rounded-xl shadow-md`}>
                   <p className={`${specialMessage.textColor} font-semibold flex items-center gap-3 text-base md:text-lg`}>
                     <Icon size={24} className={specialMessage.iconColor} />
                     {specialMessage.text}
                   </p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};