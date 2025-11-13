import React from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, HomeIcon, KeyIcon } from '@heroicons/react/24/outline';

const HowItWorks = () => {
  const steps = [
    {
      icon: MagnifyingGlassIcon,
      title: 'Search Properties',
      description: 'Browse our extensive database of properties using advanced filters to find exactly what you\'re looking for.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: HomeIcon,
      title: 'Schedule Viewing',
      description: 'Book property viewings at your convenience and get detailed information from our expert agents.',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: KeyIcon,
      title: 'Close the Deal',
      description: 'Complete your purchase with our seamless process and comprehensive support from start to finish.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Finding your perfect property is simple with our streamlined process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative text-center"
            >
              <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                <step.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-8"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;