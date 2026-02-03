import React from 'react';
import { User } from 'lucide-react';
import { COMMITTEE_MEMBERS } from '../constants';

export const CommitteeModule: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif">Key Figures & Drafting Committee</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 mx-auto rounded-full"></div>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          The Constituent Assembly was led by Dr. Rajendra Prasad as President. The task of writing the Constitution was given to the Drafting Committee (set up on August 29, 1947) with 7 members. Let's meet these key figures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {COMMITTEE_MEMBERS.map((member, index) => (
          <div 
            key={index} 
            className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
              member.role === "Chairman" ? "ring-4 ring-orange-400/50 border-2 border-orange-300" : "border border-slate-200/50"
            }`}
          >
            <div className="h-72 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden flex items-center justify-center">
               <img 
                 src={member.imagePlaceholder} 
                 alt={member.name}
                 className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
               />
               {member.role && (
                 <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg z-10">
                   {member.role}
                 </div>
               )}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg text-slate-900 mb-2 font-serif">
                {member.name}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {member.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 flex items-start gap-6 shadow-lg border border-slate-200/50">
        <div className="bg-white p-4 rounded-2xl shadow-md shrink-0">
            <User className="text-slate-700" size={28} />
        </div>
        <div>
            <h4 className="font-bold text-xl text-slate-900 mb-2">Important Fact</h4>
            <p className="text-slate-700 text-lg leading-relaxed">
                <span className="font-bold text-indigo-600">Dr. B.R. Ambedkar</span> is known as the "Father of the Indian Constitution" for his vital role in drafting the document.
            </p>
        </div>
      </div>
    </div>
  );
};