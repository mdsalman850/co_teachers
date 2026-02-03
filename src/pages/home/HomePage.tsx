import React from 'react';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import SubjectsGallery from './components/SubjectsGallery';
import Footer from './components/Footer';
import CursorTrail from './components/CursorTrail';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FBF9]">
      <CursorTrail />
      <NavBar currentPath="/" />
      <main>
        <Hero />
        <SubjectsGallery />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;