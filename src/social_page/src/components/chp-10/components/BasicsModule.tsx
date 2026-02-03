import React from 'react';
import { Book, FileText, Globe, Lightbulb } from 'lucide-react';

export const BasicsModule: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 font-serif">What is a Constitution?</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 mx-auto rounded-full"></div>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Before we dive into history, let's understand what this important document actually is.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-orange-500 hover:-translate-y-1">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Book className="text-orange-600" size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-900">Rule Book</h3>
          <p className="text-slate-600 leading-relaxed">
            It is a set of <span className="font-semibold text-slate-900">rules and regulations</span> guiding the administration of a state. It may be written or unwritten. Just like a school has rules, a country has a Constitution.
          </p>
        </div>

        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileText className="text-blue-600" size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-900">Fundamental Law</h3>
          <p className="text-slate-600 leading-relaxed">
            It contains the <span className="font-semibold text-slate-900">fundamental laws</span> of the land. No other law can break the rules set by the Constitution.
          </p>
        </div>

        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-green-500 hover:-translate-y-1">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Globe className="text-green-600" size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-900">World Record</h3>
          <p className="text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-900">Did you know?</span> The Indian Constitution is the world's longest written constitution!
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
            Objectives of the Indian Draft
          </h3>
          <ul className="list-none space-y-4 text-amber-900">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
              <span>The Territories that India will comprise.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
              <span>Citizenship (who is an Indian).</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
              <span>Fundamental Rights.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
              <span>Directive Principles of State Policy and Fundamental Duties.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
              <span>Functioning of Government at Union, State, and Local levels.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
              <span>Preamble.</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-center">
           <div className="flex items-start gap-5">
              <div className="bg-white p-4 rounded-2xl shadow-md shrink-0">
                <Lightbulb className="text-indigo-600" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-indigo-900 mb-3">Did You Know?</h3>
                <p className="text-indigo-800 italic text-lg leading-relaxed">
                  "Lord Mountbatten was the last British Governor General of India."
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};