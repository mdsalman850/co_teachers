import React, { useState, useEffect, useRef } from 'react';
import SubjectCard from './SubjectCard';
import { subjectsData } from '../data/subjects';

const SubjectsGallery: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(subjectsData.length).fill(false));
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    const cards = galleryRef.current?.querySelectorAll('[data-index]');
    cards?.forEach(card => observer.observe(card));

    return () => {
      cards?.forEach(card => observer.unobserve(card));
    };
  }, []);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F1724] mb-4">
            Choose Your Subject
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start your learning journey with our interactive subjects designed to make education fun and engaging.
          </p>
        </div>

        {/* Subjects Grid */}
        <div 
          ref={galleryRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {subjectsData.map((subject, index) => (
            <div key={subject.id} data-index={index}>
              <SubjectCard
                subject={subject}
                index={index}
                isVisible={visibleCards[index]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsGallery;