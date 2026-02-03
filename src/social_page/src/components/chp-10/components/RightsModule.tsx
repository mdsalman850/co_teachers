import React, { useState, useEffect } from 'react';
import { Equal, Mic, ShieldCheck, Sparkles, GraduationCap, Gavel, X } from 'lucide-react';
import { FUNDAMENTAL_RIGHTS } from '../constants';

const IconMap: Record<string, any> = {
  equal: Equal,
  mic: Mic,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  "graduation-cap": GraduationCap,
  gavel: Gavel
};

export const RightsModule: React.FC = () => {
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  const colorVariants = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-red-500 to-red-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-indigo-500 to-indigo-600'
  ];

  const handleRightClick = (rightId: string) => {
    setSelectedRight(rightId);
  };

  const closeModal = () => {
    setSelectedRight(null);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedRight) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedRight]);

  const selectedRightData = selectedRight 
    ? FUNDAMENTAL_RIGHTS.find(r => r.id === selectedRight)
    : null;

  const selectedIndex = selectedRightData 
    ? FUNDAMENTAL_RIGHTS.findIndex(r => r.id === selectedRight)
    : -1;

  return (
    <>
      <div className="space-y-12 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif">Fundamental Rights</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 mx-auto rounded-full"></div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            The Constitution guarantees six Fundamental Rights to all citizens. These rights are essential for the development of an individual's personality.
          </p>
          <p className="text-sm text-slate-500 italic">Click on any right to view its detailed key points</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {FUNDAMENTAL_RIGHTS.map((right, index) => {
            const Icon = IconMap[right.icon] || Equal;
            const gradient = colorVariants[index % colorVariants.length];
            const isSelected = selectedRight === right.id;
            
            return (
              <div 
                key={right.id} 
                className={`group bg-white rounded-2xl shadow-lg border transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'ring-2 ring-blue-400 shadow-xl border-blue-200' 
                    : 'border-slate-200/50 hover:shadow-2xl hover:-translate-y-1'
                }`}
                onClick={() => handleRightClick(right.id)}
              >
                <div className="p-8">
                  <div className="flex gap-6">
                    <div className="shrink-0">
                      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon size={28} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 font-serif mb-3">{right.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-base">
                        {right.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Overlay with Blurred Background */}
      {selectedRightData && selectedRightData.keyPoints && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          {/* Blurred Background */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
          
          {/* Modal Content */}
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Gradient */}
            <div className={`bg-gradient-to-r ${colorVariants[selectedIndex % colorVariants.length]} p-6 text-white sticky top-0 z-10 rounded-t-2xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const Icon = IconMap[selectedRightData.icon] || Equal;
                    return (
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                        <Icon size={28} className="text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className="text-3xl font-bold font-serif">{selectedRightData.title}</h3>
                    <p className="text-white/90 text-base mt-1">Key Points</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 flex items-center justify-center hover:scale-110"
                  aria-label="Close"
                >
                  <X size={22} className="text-white" />
                </button>
              </div>
            </div>

            {/* Description Section */}
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Description</h4>
              <p className="text-slate-700 text-lg leading-relaxed">{selectedRightData.description}</p>
            </div>

            {/* Key Points Content */}
            <div className="p-8">
              <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className={`w-1 h-6 bg-gradient-to-b ${colorVariants[selectedIndex % colorVariants.length]} rounded-full`}></span>
                Key Points
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedRightData.keyPoints.map((point, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 hover:border-slate-300"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorVariants[selectedIndex % colorVariants.length]} flex items-center justify-center shrink-0 text-white font-bold shadow-md`}>
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium pt-1">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};