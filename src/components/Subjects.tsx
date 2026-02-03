import React from 'react';
import { Sigma, Dna, Atom, FlaskConical, Map } from 'lucide-react';

const Subjects = () => {
  const subjects = [
    {
      id: 'math',
      title: 'Mathematics',
      icon: Sigma,
      description: 'Numbers, algebra & geometry',
      demoProgress: 75,
      accent: 'accent-math',
      bgGradient: 'from-red-400 to-red-500'
    },
    {
      id: 'biology',
      title: 'Biology',
      icon: Dna,
      description: 'Basics of life & cells',
      demoProgress: 18,
      accent: 'accent-bio',
      bgGradient: 'from-green-400 to-green-500'
    },
    {
      id: 'physics',
      title: 'Physics',
      icon: Atom,
      description: 'Forces, energy & motion',
      demoProgress: 42,
      accent: 'accent-phys',
      bgGradient: 'from-blue-400 to-blue-500'
    },
    {
      id: 'chemistry',
      title: 'Chemistry',
      icon: FlaskConical,
      description: 'Elements & reactions',
      demoProgress: 63,
      accent: 'accent-chem',
      bgGradient: 'from-purple-400 to-purple-500'
    },
    {
      id: 'social',
      title: 'Social Studies',
      icon: Map,
      description: 'History & geography',
      demoProgress: 29,
      accent: 'accent-social',
      bgGradient: 'from-orange-400 to-orange-500'
    }
  ];

  return (
    <section className="py-20 bg-primary-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-text font-inter mb-4">
            Choose your learning adventure
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-3xl mx-auto">
            Interactive subjects designed to make learning engaging and fun
          </p>
        </div>

        <div className="horizontal-scroll-container">
          <div className="horizontal-scroll">
            {subjects.map((subject) => (
              <div 
                key={subject.id}
                className="subject-card group cursor-pointer"
              >
                <div className={`w-full h-32 bg-gradient-to-br ${subject.bgGradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all duration-300`}>
                  <subject.icon size={48} className="text-white drop-shadow-lg" />
                </div>
                
                <h3 className="text-xl font-semibold text-primary-text font-inter mb-2">
                  {subject.title}
                </h3>
                
                <p className="text-gray-600 font-poppins text-sm mb-4">
                  {subject.description}
                </p>
                
                {/* Demo Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-primary-text">{subject.demoProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${subject.bgGradient} h-2 rounded-full transition-all duration-500 group-hover:animate-pulse`}
                      style={{ width: `${subject.demoProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subjects;