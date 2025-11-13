import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, MapPinIcon, HomeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Badge from '../common/Badge';
import { getImageUrl } from '../../utils/imageHelper';

const PropertyCard = ({ property, onFavorite, isFavorited = false }) => {
  const {
    id,
    title,
    price,
    location,
    images,
    type,
    bedrooms,
    bathrooms,
    area,
    featured,
    status,
    createdAt
  } = property;

  const hasImage = images && images.length > 0 && images[0];
  const imageUrl = hasImage ? getImageUrl(images[0]) : null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {hasImage ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No Image Available</p>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {status === 'sold' && <Badge variant="danger" size="sm">SOLD</Badge>}
          {status === 'rented' && <Badge variant="warning" size="sm">RENTED</Badge>}
          {featured && status === 'available' && <Badge variant="featured" size="sm">Featured</Badge>}
          <Badge variant="info" size="sm">{type}</Badge>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onFavorite?.(id);
          }}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
        >
          {isFavorited ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <Link to={`/properties/${id}`} className="block p-6">
        <div className="space-y-4">
          {/* Price and Title */}
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatPrice(price)}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">
              {location?.address}, {location?.city}, {location?.state}
            </span>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <HomeIcon className="h-4 w-4 mr-1" />
                {bedrooms} bed
              </span>
              <span>{bathrooms} bath</span>
              <span>{area} sqft</span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center text-xs text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Listed {formatDate(createdAt)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;