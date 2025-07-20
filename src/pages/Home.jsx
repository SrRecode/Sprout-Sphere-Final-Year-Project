import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import QuickPlantIdentifier from '../components/QuickPlantIdentifier';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <QuickPlantIdentifier />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home; 