import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import SearchPanel from './SearchPanel';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute bg-blue-500 rounded-full top-20 left-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bg-purple-500 rounded-full top-40 right-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bg-pink-500 rounded-full -bottom-8 left-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="relative px-4 pt-20 pb-32 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl"
          >
            Find Your
            <span className="block text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text">
              Dream Home
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-blue-100 md:text-2xl"
          >
            Discover exceptional properties with our comprehensive real estate platform. 
            From luxury homes to investment opportunities, we help you find the perfect match.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SearchPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;