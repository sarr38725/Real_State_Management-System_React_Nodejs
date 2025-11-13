import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProperties } from '../../context/PropertyContext';
import { useUI } from '../../context/UIContext';
import {
  CheckCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  HomeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSales = () => {
  const { properties, updatePropertyStatus, loading, loadProperties } = useProperties();
  const { showToast } = useUI();
  const [filter, setFilter] = useState('available');
  const [soldProperties, setSoldProperties] = useState([]);
  const [stats, setStats] = useState({
    thisMonth: { count: 0, total: 0 },
    thisYear: { count: 0, total: 0 },
    allTime: { count: 0, total: 0 }
  });

  useEffect(() => {
    loadProperties({});
  }, [loadProperties]);

  useEffect(() => {
    const sold = properties.filter(p => p.status === 'sold' || p.status === 'rented');
    setSoldProperties(sold);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthSales = sold.filter(p => {
      const soldDate = new Date(p.updatedAt || p.createdAt);
      return soldDate.getMonth() === currentMonth && soldDate.getFullYear() === currentYear;
    });

    const yearSales = sold.filter(p => {
      const soldDate = new Date(p.updatedAt || p.createdAt);
      return soldDate.getFullYear() === currentYear;
    });

    setStats({
      thisMonth: {
        count: monthSales.length,
        total: monthSales.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
      },
      thisYear: {
        count: yearSales.length,
        total: yearSales.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
      },
      allTime: {
        count: sold.length,
        total: sold.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
      }
    });
  }, [properties]);

  const handleMarkAsSold = async (propertyId, listingType) => {
    try {
      const newStatus = listingType === 'rent' ? 'rented' : 'sold';
      await updatePropertyStatus(propertyId, newStatus);
      showToast(`Property marked as ${newStatus} successfully!`, 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update property status', 'error');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredProperties = properties.filter(p => {
    if (filter === 'available') {
      return p.status === 'available';
    } else if (filter === 'sold') {
      return p.status === 'sold' || p.status === 'rented';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
        <p className="mt-2 text-gray-600">
          Track property sales and manage sold properties
        </p>
      </motion.div>

      {/* Sales Statistics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white shadow-sm rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">This Month</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">{stats.thisMonth.count}</p>
            <p className="text-sm text-gray-600">Properties Sold</p>
            <p className="text-lg font-semibold text-blue-600">
              {formatCurrency(stats.thisMonth.total)}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white shadow-sm rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-emerald-50">
              <ChartBarIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">This Year</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">{stats.thisYear.count}</p>
            <p className="text-sm text-gray-600">Properties Sold</p>
            <p className="text-lg font-semibold text-emerald-600">
              {formatCurrency(stats.thisYear.total)}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-white shadow-sm rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">All Time</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">{stats.allTime.count}</p>
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-lg font-semibold text-purple-600">
              {formatCurrency(stats.allTime.total)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Sold Properties Summary Table */}
      {soldProperties.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-white shadow-sm rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Sales History</h2>
            <Badge variant="success">{soldProperties.length} Total Sales</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sale Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sale Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {soldProperties
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {property.images && property.images.length > 0 ? (
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <HomeIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {property.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {property.bedrooms} bed • {property.bathrooms} bath
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={property.listingType === 'sale' ? 'success' : 'info'} size="sm">
                          {property.listingType}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {property.location?.city}, {property.location?.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(property.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{property.agent?.name || 'N/A'}</div>
                        {property.agent?.email && (
                          <div className="text-xs text-gray-500">{property.agent.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="success"
                          size="sm"
                        >
                          {property.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                        {formatCurrency(property.price)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 bg-white shadow-sm rounded-2xl"
      >
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setFilter('available')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'available'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Available Properties ({properties.filter(p => p.status === 'available').length})
          </button>
          <button
            onClick={() => setFilter('sold')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'sold'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sold Properties ({soldProperties.length})
          </button>
        </div>

        {/* Properties List */}
        <div className="space-y-4">
          {filteredProperties.length === 0 ? (
            <div className="py-12 text-center">
              <HomeIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600">No properties found</p>
            </div>
          ) : (
            filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="object-cover w-20 h-20 rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-gray-100">
                      <HomeIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{property.title}</h3>
                    <p className="text-sm text-gray-600">
                      {property.location?.city}, {property.location?.state}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant={property.listingType === 'sale' ? 'success' : 'info'} size="sm">
                        {property.listingType}
                      </Badge>
                      <Badge
                        variant={
                          property.status === 'sold' || property.status === 'rented'
                            ? 'success'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {property.status}
                      </Badge>
                    </div>
                    {(property.status === 'sold' || property.status === 'rented') && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Sale Date:</span> {formatDate(property.updatedAt)}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Agent:</span> {property.agent?.name || 'N/A'}
                        </p>
                        {property.agent?.email && (
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Contact:</span> {property.agent.email}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(property.price)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </p>
                    {property.area && (
                      <p className="text-xs text-gray-400 mt-1">
                        {property.area} sqft
                      </p>
                    )}
                  </div>
                </div>

                {property.status === 'available' && (
                  <div className="ml-4">
                    <Button
                      onClick={() => handleMarkAsSold(property.id, property.listingType)}
                      variant="primary"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <CheckCircleSolidIcon className="w-4 h-4" />
                      <span>Mark as {property.listingType === 'rent' ? 'Rented' : 'Sold'}</span>
                    </Button>
                  </div>
                )}

                {(property.status === 'sold' || property.status === 'rented') && (
                  <div className="flex items-center ml-4 space-x-2 text-emerald-600">
                    <CheckCircleSolidIcon className="w-6 h-6" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSales;
