import React from 'react';
import { Crown, MapPin, UserCheck, ArrowRightLeft, Gavel } from 'lucide-react';

const Chapter11ComparisonView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
      <div className="text-center mb-10 sm:mb-12 lg:mb-16 px-2">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight leading-tight">Union vs State Comparison</h2>
        <p className="text-slate-600 text-base sm:text-lg font-semibold">Understand the parallel structure of the Indian Government.</p>
      </div>

      <div className="space-y-8 sm:space-y-10 lg:space-y-14">
        
        {/* Comparison 1: Constitutional Heads */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden border border-slate-200/60 backdrop-blur-sm ring-1 ring-black/5">
          <div className="bg-gradient-to-r from-slate-50/90 via-slate-100/50 to-slate-50/90 p-4 sm:p-5 lg:p-6 border-b border-slate-200/80 flex items-center justify-center">
             <h3 className="font-bold text-base sm:text-lg lg:text-xl text-slate-800 uppercase tracking-[0.15em]">Constitutional Heads</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 sm:gap-6 lg:gap-8 p-5 sm:p-7 lg:p-10 items-center">
            
            {/* President */}
            <div className="md:col-span-3 bg-gradient-to-br from-orange-50/90 via-orange-50/70 to-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-orange-300/80 text-center hover:shadow-[0_16px_48px_rgba(249,115,22,0.2)] hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 ease-out shadow-[0_8px_24px_rgba(249,115,22,0.15)] ring-1 ring-orange-200/50">
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-100 text-orange-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-5 shadow-[0_4px_16px_rgba(249,115,22,0.2)] ring-1 ring-orange-300/50">
                <Crown size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2} />
              </div>
              <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900 mb-2 sm:mb-3 leading-tight">President</h4>
              <p className="text-[10px] sm:text-xs font-bold text-orange-700 uppercase mb-4 sm:mb-6 tracking-[0.15em] bg-gradient-to-r from-orange-100 to-orange-50 px-3 sm:px-4 py-1 sm:py-2 rounded-full inline-block shadow-sm ring-1 ring-orange-200/80">Union Level</p>
              
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2 sm:space-y-3 text-left bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200/80 ring-1 ring-black/5">
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Role:</span> <span className="font-semibold">Head of State</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Age:</span> <span className="font-semibold">35+ Years</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Power:</span> <span className="font-semibold">Nominal Executive</span></li>
              </ul>
            </div>

            {/* Icon */}
            <div className="md:col-span-1 flex justify-center text-slate-400 py-4">
              <ArrowRightLeft size={32} className="sm:w-10 sm:h-10 lg:w-11 lg:h-11 opacity-50" strokeWidth={2} />
            </div>

            {/* Governor */}
            <div className="md:col-span-3 bg-gradient-to-br from-blue-50/90 via-blue-50/70 to-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-blue-300/80 text-center hover:shadow-[0_16px_48px_rgba(59,130,246,0.2)] hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 ease-out shadow-[0_8px_24px_rgba(59,130,246,0.15)] ring-1 ring-blue-200/50">
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-100 text-blue-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-5 shadow-[0_4px_16px_rgba(59,130,246,0.2)] ring-1 ring-blue-300/50">
                <MapPin size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2} />
              </div>
              <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900 mb-2 sm:mb-3 leading-tight">Governor</h4>
              <p className="text-[10px] sm:text-xs font-bold text-blue-700 uppercase mb-4 sm:mb-6 tracking-[0.15em] bg-gradient-to-r from-blue-100 to-blue-50 px-3 sm:px-4 py-1 sm:py-2 rounded-full inline-block shadow-sm ring-1 ring-blue-200/80">State Level</p>
              
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2 sm:space-y-3 text-left bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200/80 ring-1 ring-black/5">
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Role:</span> <span className="font-semibold">Head of State Executive</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Age:</span> <span className="font-semibold">35+ Years</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Appointed by:</span> <span className="font-semibold">President</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison 2: Real Executives */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden border border-slate-200/60 backdrop-blur-sm ring-1 ring-black/5">
          <div className="bg-gradient-to-r from-slate-50/90 via-slate-100/50 to-slate-50/90 p-4 sm:p-5 lg:p-6 border-b border-slate-200/80 flex items-center justify-center">
             <h3 className="font-bold text-base sm:text-lg lg:text-xl text-slate-800 uppercase tracking-[0.15em]">Real Executives</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 sm:gap-6 lg:gap-8 p-5 sm:p-7 lg:p-10 items-center">
            
            {/* PM */}
            <div className="md:col-span-3 bg-gradient-to-br from-orange-50/90 via-orange-50/70 to-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-orange-300/80 text-center hover:shadow-[0_16px_48px_rgba(249,115,22,0.2)] hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 ease-out shadow-[0_8px_24px_rgba(249,115,22,0.15)] ring-1 ring-orange-200/50">
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-100 text-orange-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-5 shadow-[0_4px_16px_rgba(249,115,22,0.2)] ring-1 ring-orange-300/50">
                <UserCheck size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2} />
              </div>
              <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900 mb-2 sm:mb-3 leading-tight">Prime Minister</h4>
              <p className="text-[10px] sm:text-xs font-bold text-orange-700 uppercase mb-4 sm:mb-6 tracking-[0.15em] bg-gradient-to-r from-orange-100 to-orange-50 px-3 sm:px-4 py-1 sm:py-2 rounded-full inline-block shadow-sm ring-1 ring-orange-200/80">Union Level</p>
              
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2 sm:space-y-3 text-left bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200/80 ring-1 ring-black/5">
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[80px] sm:min-w-[90px]">Role:</span> <span className="font-semibold">Leader of Parliament House</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[80px] sm:min-w-[90px]">Selection:</span> <span className="font-semibold">Majority Party Leader</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[80px] sm:min-w-[90px]">Duty:</span> <span className="font-semibold">Head of Council of Ministers</span></li>
              </ul>
            </div>

            {/* Icon */}
            <div className="md:col-span-1 flex justify-center text-slate-400 py-4">
              <ArrowRightLeft size={32} className="sm:w-10 sm:h-10 lg:w-11 lg:h-11 opacity-50" strokeWidth={2} />
            </div>

            {/* CM */}
            <div className="md:col-span-3 bg-gradient-to-br from-blue-50/90 via-blue-50/70 to-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-blue-300/80 text-center hover:shadow-[0_16px_48px_rgba(59,130,246,0.2)] hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 ease-out shadow-[0_8px_24px_rgba(59,130,246,0.15)] ring-1 ring-blue-200/50">
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-100 text-blue-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-5 shadow-[0_4px_16px_rgba(59,130,246,0.2)] ring-1 ring-blue-300/50">
                <UserCheck size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2} />
              </div>
              <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900 mb-2 sm:mb-3 leading-tight">Chief Minister</h4>
              <p className="text-[10px] sm:text-xs font-bold text-blue-700 uppercase mb-4 sm:mb-6 tracking-[0.15em] bg-gradient-to-r from-blue-100 to-blue-50 px-3 sm:px-4 py-1 sm:py-2 rounded-full inline-block shadow-sm ring-1 ring-blue-200/80">State Level</p>
              
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2 sm:space-y-3 text-left bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200/80 ring-1 ring-black/5">
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[80px] sm:min-w-[90px]">Role:</span> <span className="font-semibold">Leader of State Assembly</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[80px] sm:min-w-[90px]">Selection:</span> <span className="font-semibold">Majority Party Leader</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[80px] sm:min-w-[90px]">Duty:</span> <span className="font-semibold">Head of State Council</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison 3: Judiciary */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden border border-slate-200/60 backdrop-blur-sm ring-1 ring-black/5">
          <div className="bg-gradient-to-r from-slate-50/90 via-slate-100/50 to-slate-50/90 p-4 sm:p-5 lg:p-6 border-b border-slate-200/80 flex items-center justify-center">
             <h3 className="font-bold text-base sm:text-lg lg:text-xl text-slate-800 uppercase tracking-[0.15em]">The Judiciary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 sm:gap-6 lg:gap-8 p-5 sm:p-7 lg:p-10 items-center">
            
            {/* Supreme Court */}
            <div className="md:col-span-3 bg-gradient-to-br from-orange-50/90 via-orange-50/70 to-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-orange-300/80 text-center hover:shadow-[0_16px_48px_rgba(249,115,22,0.2)] hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 ease-out shadow-[0_8px_24px_rgba(249,115,22,0.15)] ring-1 ring-orange-200/50">
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-100 text-orange-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-5 shadow-[0_4px_16px_rgba(249,115,22,0.2)] ring-1 ring-orange-300/50">
                <Gavel size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2} />
              </div>
              <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900 mb-2 sm:mb-3 leading-tight">Supreme Court</h4>
              <p className="text-[10px] sm:text-xs font-bold text-orange-700 uppercase mb-4 sm:mb-6 tracking-[0.15em] bg-gradient-to-r from-orange-100 to-orange-50 px-3 sm:px-4 py-1 sm:py-2 rounded-full inline-block shadow-sm ring-1 ring-orange-200/80">Union Level</p>
              
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2 sm:space-y-3 text-left bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200/80 ring-1 ring-black/5">
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Role:</span> <span className="font-semibold">Apex Judicial Body</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Head:</span> <span className="font-semibold">Chief Justice of India</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Scope:</span> <span className="font-semibold">Entire Territory of India</span></li>
              </ul>
            </div>

            {/* Icon */}
            <div className="md:col-span-1 flex justify-center text-slate-400 py-4">
              <ArrowRightLeft size={32} className="sm:w-10 sm:h-10 lg:w-11 lg:h-11 opacity-50" strokeWidth={2} />
            </div>

            {/* High Court */}
            <div className="md:col-span-3 bg-gradient-to-br from-blue-50/90 via-blue-50/70 to-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-blue-300/80 text-center hover:shadow-[0_16px_48px_rgba(59,130,246,0.2)] hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 ease-out shadow-[0_8px_24px_rgba(59,130,246,0.15)] ring-1 ring-blue-200/50">
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-100 text-blue-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-5 shadow-[0_4px_16px_rgba(59,130,246,0.2)] ring-1 ring-blue-300/50">
                <Gavel size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2} />
              </div>
              <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900 mb-2 sm:mb-3 leading-tight">High Court</h4>
              <p className="text-[10px] sm:text-xs font-bold text-blue-700 uppercase mb-4 sm:mb-6 tracking-[0.15em] bg-gradient-to-r from-blue-100 to-blue-50 px-3 sm:px-4 py-1 sm:py-2 rounded-full inline-block shadow-sm ring-1 ring-blue-200/80">State Level</p>
              
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2 sm:space-y-3 text-left bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200/80 ring-1 ring-black/5">
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Role:</span> <span className="font-semibold">Highest State Court</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Head:</span> <span className="font-semibold">Chief Justice of HC</span></li>
                <li className="flex gap-2 sm:gap-3 items-center flex-wrap"><span className="font-bold text-slate-900 min-w-[60px] sm:min-w-[70px]">Scope:</span> <span className="font-semibold">State Jurisdiction</span></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chapter11ComparisonView;

