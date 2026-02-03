import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Parent',
      content: 'My daughter went from struggling with math to actually enjoying it! The AI tutor explains things so patiently.',
      rating: 5,
      avatar: 'S'
    },
    {
      name: 'Alex R.',
      role: 'Student, Age 14',
      content: 'Finally, a learning app that doesn\'t feel like homework. The videos are actually fun to watch!',
      rating: 5,
      avatar: 'A'
    },
    {
      name: 'Mrs. Johnson',
      role: 'Teacher',
      content: 'I recommend COTEACHERS to all my students. The progress tracking helps me understand where they need extra support.',
      rating: 5,
      avatar: 'J'
    }
  ];

  return (
    <section className="py-20 bg-primary-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-text font-inter mb-4">
            What families are saying
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-3xl mx-auto">
            Join thousands of happy learners and parents
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 font-poppins leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-bio to-accent-math text-white rounded-full flex items-center justify-center font-semibold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-primary-text font-inter">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;