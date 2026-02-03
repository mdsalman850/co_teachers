import React from 'react';
import { UserPlus, BookOpen, Trophy } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Create your free account and tell us about your learning goals.',
      color: 'accent-bio'
    },
    {
      icon: BookOpen,
      title: 'Choose & Learn',
      description: 'Pick your favorite subject and start with interactive lessons.',
      color: 'accent-math'
    },
    {
      icon: Trophy,
      title: 'Track Progress',
      description: 'Watch your knowledge grow with AI guidance and achievement badges.',
      color: 'accent-chem'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-text font-inter mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-3xl mx-auto">
            Get started in just three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-accent-bio to-accent-math transform -translate-y-1/2"></div>
          <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-accent-math to-accent-chem transform -translate-y-1/2"></div>

          {steps.map((step, index) => (
            <div key={index} className="text-center relative z-10">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-${step.color} to-${step.color}/80 text-white mb-6 step-animation`}>
                <step.icon size={36} />
              </div>
              
              <div className="step-number absolute -top-2 -left-2 w-8 h-8 bg-primary-text text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              
              <h3 className="text-2xl font-semibold text-primary-text font-inter mb-4">
                {step.title}
              </h3>
              
              <p className="text-gray-600 font-poppins leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;