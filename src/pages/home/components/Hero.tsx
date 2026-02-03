import React from 'react';
import { Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-[#F7FBF9] to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-[#27AE60] mr-3 animate-pulse" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F1724] tracking-tight">
            Welcome Back, Learner!
          </h1>
          <Sparkles className="w-8 h-8 text-[#27AE60] ml-3 animate-pulse" />
        </div>
        
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Continue your educational journey with engaging lessons and interactive activities designed just for you.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200">
            <div className="w-3 h-3 bg-[#27AE60] rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Ready to learn something new today?</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;