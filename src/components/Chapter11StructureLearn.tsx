import React, { useState, useEffect } from 'react';
import { ROLES, RoleData } from './chapter11/constants';
import { ChevronRight, ArrowDown, BookOpen } from 'lucide-react';

const Chapter11StructureLearn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Union' | 'State'>('Union');
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);

  // Set President of India as default when component mounts or when switching tabs
  useEffect(() => {
    if (activeTab === 'Union') {
      const presidentRole = ROLES.find(role => role.id === 'president' && role.level === 'Union');
      if (presidentRole) {
        setSelectedRole(presidentRole);
      }
    } else if (activeTab === 'State') {
      // When switching to State tab, find the first State role (Governor) as default
      const governorRole = ROLES.find(role => role.id === 'governor' && role.level === 'State');
      if (governorRole) {
        setSelectedRole(governorRole);
      }
    }
  }, [activeTab]);

  const roles = ROLES.filter(r => r.level === activeTab);
  
  // Categorize roles for display
  const executive = roles.filter(r => ['president', 'pm', 'governor', 'cm'].includes(r.id));
  const legislative = roles.filter(r => ['loksabha', 'rajyasabha', 'mla', 'mlc'].includes(r.id));
  // Updated filter to include High Court for State level
  const judiciary = roles.filter(r => ['supremecourt', 'highcourt'].includes(r.id)); 

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 h-auto flex flex-col relative z-0">
      {/* Header Toggle */}
      <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
        <div className="bg-slate-100/60 backdrop-blur-sm p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl flex shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-slate-200/50 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('Union')}
            className={`px-4 sm:px-8 lg:px-12 py-2.5 sm:py-3 lg:py-3.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 ease-out flex-1 sm:flex-none ${
              activeTab === 'Union' 
                ? 'bg-white text-orange-700 shadow-[0_4px_12px_rgba(249,115,22,0.2)] ring-1 ring-orange-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            Union Government
          </button>
          <button
            onClick={() => setActiveTab('State')}
            className={`px-4 sm:px-8 lg:px-12 py-2.5 sm:py-3 lg:py-3.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 ease-out flex-1 sm:flex-none ${
              activeTab === 'State' 
                ? 'bg-white text-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.2)] ring-1 ring-blue-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            State Government
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 flex-1 min-h-0">
        
        {/* Structure Visualization (Left) */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 lg:overflow-y-auto lg:pr-4 pb-6 lg:pb-8 lg:max-h-[calc(100vh-140px)]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent', scrollBehavior: 'smooth' }}>
          
          {/* Executive Section */}
          <section>
            <h3 className="text-[10px] sm:text-xs font-bold uppercase text-slate-600 tracking-[0.15em] mb-4 sm:mb-6 border-l-4 border-indigo-600 pl-3 sm:pl-4 py-1 sm:py-1.5 bg-gradient-to-r from-indigo-50/50 to-transparent rounded-r-lg">
              The Executive
            </h3>
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              {executive.map((role) => (
                <div key={role.id} className="w-full relative group">
                  <button
                    onClick={() => setSelectedRole(role)}
                    className={`w-full p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border-2 text-left transition-all duration-300 ease-out flex items-center justify-between relative z-10 ${
                      selectedRole?.id === role.id
                        ? 'bg-gradient-to-r from-indigo-50 via-indigo-50/80 to-indigo-50/50 border-indigo-600 shadow-[0_4px_16px_rgba(99,102,241,0.15)]'
                        : 'bg-white border-slate-200/80 hover:border-indigo-400/60 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 min-w-0 flex-1 pr-2">
                      <div className={`p-2.5 sm:p-3 lg:p-3.5 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] shrink-0 ${activeTab === 'Union' ? 'bg-gradient-to-br from-orange-100 via-orange-50 to-white text-orange-700' : 'bg-gradient-to-br from-blue-100 via-blue-50 to-white text-blue-700'}`}>
                        <role.icon size={20} strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="font-bold text-slate-900 text-sm sm:text-base leading-tight mb-0.5 sm:mb-1 break-words">{role.title}</div>
                        <div className="text-[10px] sm:text-xs text-slate-500 font-semibold break-words">
                           {role.id === 'president' || role.id === 'governor' ? 'Constitutional Head' : 'Real Executive Head'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`transition-all duration-300 shrink-0 ml-2 ${selectedRole?.id === role.id ? 'text-indigo-600' : 'text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1'}`} size={20} strokeWidth={2} />
                  </button>
                  {/* Visual connector */}
                  {role.id === executive[0].id && executive.length > 1 && (
                    <div className="absolute left-11 sm:left-12 lg:left-14 -bottom-4 h-4 w-0.5 bg-gradient-to-b from-slate-300 to-slate-200 z-0 pointer-events-none"></div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Legislative Section */}
          <section>
            <h3 className="text-[10px] sm:text-xs font-bold uppercase text-slate-600 tracking-[0.15em] mb-4 sm:mb-6 border-l-4 border-emerald-600 pl-3 sm:pl-4 py-1 sm:py-1.5 bg-gradient-to-r from-emerald-50/50 to-transparent rounded-r-lg">
              The Legislature
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
               {legislative.length > 0 ? legislative.map(role => (
                 <button
                 key={role.id}
                 onClick={() => setSelectedRole(role)}
                 className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border-2 text-left transition-all duration-300 ease-out relative z-10 ${
                   selectedRole?.id === role.id
                     ? 'bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-emerald-50/50 border-emerald-600 shadow-[0_4px_16px_rgba(16,185,129,0.15)]'
                     : 'bg-white border-slate-200/80 hover:border-emerald-400/60 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-slate-50/50'
                 }`}
               >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${activeTab === 'Union' ? 'bg-gradient-to-br from-orange-100 via-orange-50 to-white text-orange-700' : 'bg-gradient-to-br from-blue-100 via-blue-50 to-white text-blue-700'}`}>
                    <role.icon size={18} strokeWidth={2} />
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm leading-tight mb-1 break-words">{role.title}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-semibold break-words">
                    {role.id.includes('rajya') || role.id.includes('parishath') ? 'Upper House' : 'Lower House'}
                  </div>
               </button>
               )) : (
                 <div className="col-span-2 p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-slate-50/90 to-slate-50/50 border-2 border-dashed border-slate-300/80 rounded-2xl sm:rounded-3xl text-center text-slate-500 text-xs sm:text-sm font-semibold shadow-sm">
                   Legislative Council might not exist in all states.
                 </div>
               )}
            </div>
          </section>

          {/* Judiciary Section - Now renders for both Union (SC) and State (HC) */}
          {judiciary.length > 0 && (
             <section>
             <h3 className="text-[10px] sm:text-xs font-bold uppercase text-slate-600 tracking-[0.15em] mb-4 sm:mb-6 border-l-4 border-rose-600 pl-3 sm:pl-4 py-1 sm:py-1.5 bg-gradient-to-r from-rose-50/50 to-transparent rounded-r-lg">
               The Judiciary
             </h3>
             {judiciary.map(role => (
                <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`w-full p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border-2 text-left transition-all duration-300 ease-out flex items-center gap-3 sm:gap-4 lg:gap-5 relative z-10 ${
                  selectedRole?.id === role.id
                    ? 'bg-gradient-to-r from-rose-50 via-rose-50/80 to-rose-50/50 border-rose-600 shadow-[0_4px_16px_rgba(225,29,72,0.15)]'
                    : 'bg-white border-slate-200/80 hover:border-rose-400/60 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-slate-50/50'
                }`}
              >
                 <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-100 via-rose-50 to-white text-rose-700 shadow-[0_2px_8px_rgba(0,0,0,0.08)] shrink-0">
                   <role.icon size={20} strokeWidth={2} />
                 </div>
                 <div className="min-w-0 flex-1 overflow-hidden pr-2">
                   <div className="font-bold text-slate-900 text-sm sm:text-base leading-tight mb-0.5 sm:mb-1 break-words">{role.title}</div>
                   <div className="text-[10px] sm:text-xs text-slate-500 font-semibold break-words">
                      {role.level === 'Union' ? 'Highest Judicial Body' : 'Highest State Judicial Body'}
                   </div>
                 </div>
              </button>
             ))}
           </section>
          )}

        </div>

        {/* Info Panel (Right) */}
        <div className="lg:col-span-5 pb-6 lg:pb-0">
          <div className="sticky top-24 lg:top-28 bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-200/60 overflow-hidden h-fit lg:h-[calc(100vh-140px)] lg:max-h-[calc(100vh-140px)] flex flex-col z-30">
            {selectedRole ? (
              <>
                <div className={`p-4 sm:p-5 lg:p-6 ${activeTab === 'Union' ? 'bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800'} text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] relative z-10`}>
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                    <div className="p-2 sm:p-2.5 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-md shrink-0">
                      <selectedRole.icon size={20} className="text-white" strokeWidth={2} />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold bg-white/30 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase tracking-wider">{selectedRole.level} Level</span>
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight leading-tight break-words pr-2">{selectedRole.title}</h2>
                </div>
                
                <div className="p-4 sm:p-5 lg:p-6 pr-5 sm:pr-6 lg:pr-7 overflow-y-auto space-y-3 sm:space-y-4 bg-gradient-to-b from-white via-white to-slate-50/30 relative" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent', scrollBehavior: 'smooth' }}>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="bg-gradient-to-br from-slate-50 via-white to-white p-3 sm:p-3.5 rounded-lg sm:rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                      <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold tracking-[0.1em] mb-1">Min Age</div>
                      <div className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 break-words">{selectedRole.minAge} Years</div>
                    </div>
                    {selectedRole.term && (
                      <div className="bg-gradient-to-br from-slate-50 via-white to-white p-3 sm:p-3.5 rounded-lg sm:rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold tracking-[0.1em] mb-1">Term</div>
                        <div className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 break-words">{selectedRole.term}</div>
                      </div>
                    )}
                  </div>

                  {/* Composition */}
                  {selectedRole.composition && (
                    <div className="relative z-10">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.15em]">
                        <ArrowDown size={12} className="sm:w-3.5 sm:h-3.5 text-indigo-600 shrink-0" strokeWidth={2.5}/> <span>Composition</span>
                      </h4>
                      <p className="text-slate-700 bg-gradient-to-br from-indigo-50/80 via-indigo-50/50 to-white p-3 sm:p-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs border border-indigo-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-semibold leading-snug break-words">
                        {selectedRole.composition}
                      </p>
                    </div>
                  )}

                  {/* Qualifications */}
                  <div className="relative z-10">
                    <h4 className="font-bold text-slate-900 mb-2 text-[9px] sm:text-[10px] uppercase tracking-[0.15em]">Qualifications</h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {selectedRole.qualifications.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-slate-700 bg-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                          <span className="mt-1 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="font-semibold leading-snug break-words flex-1">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Powers */}
                  {selectedRole.powers && (
                    <div className="relative z-10">
                      <h4 className="font-bold text-slate-900 mb-2 text-[9px] sm:text-[10px] uppercase tracking-[0.15em]">Key Powers</h4>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {selectedRole.powers.map((p, idx) => (
                          <li key={idx} className="flex items-start gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-slate-700 bg-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                            <span className="mt-1 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-orange-500 shrink-0"></span>
                            <span className="font-semibold leading-snug break-words flex-1">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Notes */}
                  {selectedRole.notes && (
                     <div className="mt-2 p-3 sm:p-3.5 bg-gradient-to-br from-yellow-50/90 via-yellow-50/70 to-white text-yellow-900 text-[11px] sm:text-xs rounded-lg sm:rounded-xl border-2 border-yellow-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] font-semibold italic leading-snug relative z-10 break-words">
                       <span className="font-bold not-italic text-yellow-800">Did you know?</span> {selectedRole.notes}
                     </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 sm:p-12 lg:p-14 text-center min-h-[300px] sm:min-h-[400px] lg:min-h-[450px]">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-slate-100 via-slate-50 to-white rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
                  <BookOpen size={32} className="sm:w-10 sm:h-10 lg:w-[40px] lg:h-[40px] text-slate-400" strokeWidth={1.5} />
                </div>
                <p className="font-semibold text-slate-500 text-sm sm:text-base leading-relaxed max-w-xs px-4">Select a role from the structure to view its detailed Constitution card.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapter11StructureLearn;

