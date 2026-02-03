import React from 'react';
import { Sparkles, BarChart3, PlayCircle, ShieldCheck } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Tutor',
      description: 'Get instant help with friendly AI that explains concepts in simple terms.',
      color: 'accent-bio'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Watch your knowledge grow with detailed progress reports and achievements.',
      color: 'accent-math'
    },
    {
      icon: PlayCircle,
      title: 'Audio & Video Lessons',
      description: 'Learn through engaging multimedia content tailored to your pace.',
      color: 'accent-chem'
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Kid-friendly',
      description: 'Completely secure learning environment designed specifically for young minds.',
      color: 'accent-phys'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-text font-inter mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-3xl mx-auto">
            Our platform combines cutting-edge AI with proven educational methods
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card group cursor-pointer"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-${feature.color} to-${feature.color}/80 text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold text-primary-text font-inter mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 font-poppins leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;