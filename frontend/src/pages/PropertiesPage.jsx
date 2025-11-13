import React, { useState, useEffect, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function parsePriceRange(range) {
  if (!range) return { minPrice: null, maxPrice: null };
  const clean = String(range).trim();
  if (!clean) return { minPrice: null, maxPrice: null };

  if (clean.endsWith('+')) {
    const min = Number(clean.replace('+', ''));
    return { minPrice: Number.isFinite(min) ? min : null, maxPrice: null };
  }
  const [minRaw, maxRaw] = clean.split('-');
  const min = Number(minRaw);
  const max = Number(maxRaw);
  return {
    minPrice: Number.isFinite(min) ? min : null,
    maxPrice: Number.isFinite(max) ? max : null
  };
}

const TYPES = [
  { value: '', label: 'All Types' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'villa', label: 'Villa' },
];

const PRICE_RANGES = [
  { value: '', label: 'All Prices' },
  { value: '0-500000', label: 'Up to $500K' },
  { value: '500000-1000000', label: '$500K – $1M' },
  { value: '1000000-2000000', label: '$1M – $2M' },
  { value: '2000000+', label: '$2M+' },
];

const PropertiesPage = () => {
  const { properties, loading, loadProperties } = useProperties();

  const [filters, setFilters] = useState({
    type: '',
    priceRange: '',
    location: ''
  });

  // derive query-friendly filters
  const parsed = useMemo(() => {
    const { minPrice, maxPrice } = parsePriceRange(filters.priceRange);
    return {
      type: filters.type || null,
      location: filters.location?.trim() || null,
      minPrice,
      maxPrice,
    };
  }, [filters]);

  // debounce so we don't query on every keystroke
  const [debounced, setDebounced] = useState(parsed);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(parsed), 300);
    return () => clearTimeout(t);
  }, [parsed]);

  // load properties when debounced filters change
  useEffect(() => {
    loadProperties(debounced); // memoized in context
  }, [debounced, loadProperties]);

  const resetFilters = () => {
    setFilters({ type: '', priceRange: '', location: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Browse Properties</h1>
          <p className="text-xl text-gray-600">Discover your perfect home from our extensive collection</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 mb-8 bg-white rounded-lg shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <select
              id="filter-type"
              name="filter-type"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TYPES.map(opt => (
                <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              id="filter-price-range"
              name="filter-price-range"
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PRICE_RANGES.map(opt => (
                <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <input
              id="filter-location"
              name="filter-location"
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
            >
              Reset filters
            </button>
          </div>
        </motion.div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No properties found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
