import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedProperties from '../components/home/FeaturedProperties';
import HowItWorks from '../components/home/HowItWorks';

const HomePage = () => {
  return (
    <div className="pt-16">
      <Hero />
      <FeaturedProperties />
      <HowItWorks />
    </div>
  );
};

export default HomePage;