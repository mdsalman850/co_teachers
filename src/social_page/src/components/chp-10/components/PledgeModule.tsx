import React, { useState } from 'react';
import { Award, PenTool } from 'lucide-react';

export const PledgeModule: React.FC = () => {
  const [name, setName] = useState('');
  const [pledgeView, setPledgeView] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      {!pledgeView ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <PenTool size={48} className="mx-auto text-blue-600 mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">The Citizen's Pledge</h2>
          <p className="text-slate-600 mb-8">
            As a student of the Indian Constitution, you understand your rights. Now, acknowledge your duties.
          </p>
          
          <input
            type="text"
            placeholder="Enter your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border-2 border-slate-200 rounded-xl text-lg mb-6 focus:border-blue-500 focus:outline-none text-center"
          />

          <button
            disabled={!name.trim()}
            onClick={() => setPledgeView(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 hover:scale-105 transition-transform"
          >
            Take the Pledge
          </button>
        </div>
      ) : (
        <div className="bg-[#fff9e6] p-1 border-8 border-double border-orange-900 rounded-lg shadow-2xl relative overflow-hidden">
          {/* Watermark effect */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award size={300} />
          </div>

          <div className="border-2 border-orange-900/30 p-8 h-full rounded flex flex-col items-center text-center relative z-10">
            <h2 className="text-4xl font-serif font-bold text-orange-800 mb-2">Certificate of Citizenship</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-orange-500 via-white to-green-500 mb-8"></div>
            
            <p className="text-lg text-slate-700 italic mb-4">This is to certify that</p>
            <h3 className="text-3xl font-bold text-slate-900 mb-6 font-serif border-b-2 border-slate-300 pb-2 px-8">
              {name}
            </h3>
            
            <p className="text-slate-700 mb-6 leading-relaxed max-w-md">
              Has successfully studied Chapter 10 "Indian Constitution" and pledges to be a responsible citizen, respecting the rights of others and upholding the values of the nation.
            </p>

            <div className="mt-8 flex items-center gap-2 text-green-700 font-bold">
               <Award />
               <span>Constitution Explorer</span>
            </div>
            
            <button 
                onClick={() => setPledgeView(false)}
                className="mt-8 text-sm text-slate-400 hover:text-slate-600 underline"
            >
                Create New
            </button>
          </div>
        </div>
      )}
    </div>
  );
};