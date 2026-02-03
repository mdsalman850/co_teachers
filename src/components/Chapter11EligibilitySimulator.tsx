import React, { useState, useEffect } from 'react';
import { UserStats } from './chapter11/types';
import { ROLES } from './chapter11/constants';
import { CheckCircle2, XCircle, AlertCircle, RefreshCcw } from 'lucide-react';

const Chapter11EligibilitySimulator: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    age: 18,
    isCitizen: true,
    hasOfficeOfProfit: false,
    legalExperience: 0,
    judicialExperience: 0
  });

  const [eligibleRoles, setEligibleRoles] = useState<string[]>([]);

  useEffect(() => {
    const qualified: string[] = [];

    ROLES.forEach(role => {
      let isEligible = true;

      // 1. Citizenship Check (Universal)
      if (!stats.isCitizen) isEligible = false;

      // 2. Age Check
      if (stats.age < role.minAge) isEligible = false;

      // 3. Office of Profit Check (Legislative/Executive roles mostly)
      if (stats.hasOfficeOfProfit && ['president', 'governor', 'loksabha', 'rajyasabha', 'mla', 'mlc'].includes(role.id)) {
        isEligible = false;
      }

      // 4. Judicial Specifics
      if (role.id === 'supremecourt') {
        // Must be Judge for 5 years OR Advocate for 10
        if (stats.judicialExperience < 5 && stats.legalExperience < 10) {
          isEligible = false;
        }
      }
      
      if (role.id === 'highcourt') {
        // Must be Judicial office for 10 years OR Advocate for 10
        if (stats.judicialExperience < 10 && stats.legalExperience < 10) {
          isEligible = false;
        }
      }

      if (isEligible) {
        qualified.push(role.id);
      }
    });

    setEligibleRoles(qualified);
  }, [stats]);

  const updateStat = (key: keyof UserStats, value: any) => {
    setStats(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-8 sm:space-y-10 lg:space-y-12">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight px-2">Governance Career Simulator</h2>
        <p className="text-slate-600 text-base sm:text-lg font-semibold px-4">Configure your profile to see which Constitutional roles you are eligible for.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {/* Controls Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-200/60 p-5 sm:p-6 lg:p-8 space-y-6 sm:space-y-7 lg:space-y-8 h-fit backdrop-blur-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-200/80">
            <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-900 tracking-tight">Your Profile</h3>
            <button 
              onClick={() => setStats({
                age: 18,
                isCitizen: true,
                hasOfficeOfProfit: false,
                legalExperience: 0,
                judicialExperience: 0
              })}
              className="text-slate-400 hover:text-indigo-600 transition-all duration-300 p-2.5 hover:bg-indigo-50 rounded-xl hover:shadow-sm"
              title="Reset"
            >
              <RefreshCcw size={22} strokeWidth={2} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Age Slider */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-[0.15em]">Age</label>
                <span className="text-indigo-700 font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-sm ring-1 ring-indigo-200/50">{stats.age} Years</span>
              </div>
              <input
                type="range"
                min="18"
                max="80"
                value={stats.age}
                onChange={(e) => updateStat('age', parseInt(e.target.value))}
                className="w-full h-2.5 sm:h-3 bg-slate-200 rounded-lg sm:rounded-xl appearance-none cursor-pointer accent-indigo-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
              />
              <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 font-semibold">
                <span>18</span>
                <span>80</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2.5 sm:space-y-3 pt-2">
              <label className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 rounded-xl sm:rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-all duration-300 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-black/5 hover:shadow-md">
                <span className="text-xs sm:text-sm font-bold text-slate-700">Indian Citizen</span>
                <input
                  type="checkbox"
                  checked={stats.isCitizen}
                  onChange={(e) => updateStat('isCitizen', e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 border-gray-300 cursor-pointer shadow-sm"
                />
              </label>

              <label className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 rounded-xl sm:rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-all duration-300 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-black/5 hover:shadow-md">
                <span className="text-xs sm:text-sm font-bold text-slate-700">Hold Office of Profit</span>
                <input
                  type="checkbox"
                  checked={stats.hasOfficeOfProfit}
                  onChange={(e) => updateStat('hasOfficeOfProfit', e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 border-gray-300 cursor-pointer shadow-sm"
                />
              </label>
            </div>

            {/* Specialized Experience */}
            <div className="pt-5 sm:pt-6 border-t border-slate-200/80 space-y-5 sm:space-y-6">
              <h4 className="text-[10px] sm:text-xs font-bold uppercase text-slate-600 tracking-[0.15em]">Judicial Experience</h4>
              <div className="space-y-2.5 sm:space-y-3">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Years in Judicial Office</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={stats.judicialExperience}
                  onChange={(e) => updateStat('judicialExperience', parseInt(e.target.value) || 0)}
                  className="w-full p-3 sm:p-4 border-2 border-slate-200/80 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-black/5 hover:shadow-md text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Years as Advocate</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={stats.legalExperience}
                  onChange={(e) => updateStat('legalExperience', parseInt(e.target.value) || 0)}
                  className="w-full p-3 sm:p-4 border-2 border-slate-200/80 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-black/5 hover:shadow-md text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {ROLES.map((role) => {
              const isEligible = eligibleRoles.includes(role.id);
              const Icon = role.icon;
              
              // Custom logic to determine specific failure reason for simplified UI feedback
              let reason = "";
              if (!stats.isCitizen) reason = "Must be Citizen";
              else if (role.minAge > stats.age) reason = `Min Age: ${role.minAge}`;
              else if (stats.hasOfficeOfProfit && ['president', 'governor', 'loksabha', 'rajyasabha'].includes(role.id)) reason = "Cannot hold Office of Profit";
              else if (role.id === 'supremecourt' && !isEligible) reason = "Lack of Judicial/Legal Exp";
              else if (role.id === 'highcourt' && !isEligible) reason = "Lack of Judicial/Legal Exp";

              return (
                <div 
                  key={role.id}
                  className={`relative overflow-visible rounded-3xl border-2 transition-all duration-300 ease-out ${
                    isEligible 
                      ? 'bg-white border-green-600 shadow-[0_8px_24px_rgba(34,197,94,0.15)] hover:shadow-[0_12px_32px_rgba(34,197,94,0.2)] hover:scale-[1.02]' 
                      : 'bg-gradient-to-br from-slate-50/90 via-slate-50 to-slate-100/80 border-slate-300/80 opacity-70 grayscale-[0.3]'
                  }`}
                >
                  <div className={`absolute top-0 right-0 p-2.5 sm:p-3 rounded-bl-3xl z-20 ${isEligible ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)]' : 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]'}`}>
                    {isEligible ? <CheckCircle2 size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} /> : <XCircle size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />}
                  </div>

                  <div className="p-5 sm:p-6 lg:p-7 pr-12 sm:pr-14 flex items-start gap-3 sm:gap-4 lg:gap-5 relative z-10">
                    <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] shrink-0 ${isEligible ? 'bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50 text-indigo-700' : 'bg-slate-200/80 text-slate-500'}`}>
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <span className={`text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full font-bold shadow-sm ${role.level === 'Union' ? 'bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 text-orange-700 border border-orange-200/80' : 'bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 text-blue-700 border border-blue-200/80'}`}>
                          {role.level}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-2 sm:mb-3 leading-tight break-words pr-2">{role.title}</h4>
                      
                      {!isEligible && (
                        <div className="mt-2 sm:mt-3 flex items-start gap-2 sm:gap-2.5 text-[10px] sm:text-xs font-bold text-red-800 bg-gradient-to-r from-red-50 via-red-50/80 to-red-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-red-200/80 shadow-sm">
                          <AlertCircle size={16} className="shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span className="break-words flex-1">{reason}</span>
                        </div>
                      )}

                      {isEligible && (
                        <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-bold text-green-800 bg-gradient-to-r from-green-50 via-green-50/80 to-green-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-green-200/80 shadow-sm break-words">
                          ✓ You meet the basic criteria!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapter11EligibilitySimulator;

