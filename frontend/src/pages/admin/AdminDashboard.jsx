import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../../context/PropertyContext';
import { useSchedule } from '../../context/ScheduleContext';
import { useAuth } from '../../context/AuthContext';
import {
  UserGroupIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { properties, featuredProperties } = useProperties();
  const { schedules } = useSchedule();
  const { user } = useAuth();

  // Calculate real stats from Firebase data
  const totalProperties = properties.length;
  const featuredCount = featuredProperties.length;
  const approvedProperties = properties.filter(p => p.status === 'approved').length;
  const pendingProperties = properties.filter(p => p.status === 'pending').length;
  const totalSchedules = schedules.length;
  const pendingSchedules = schedules.filter(s => s.status === 'pending').length;

  const stats = [
    {
      name: 'Total Properties',
      value: totalProperties.toString(),
      change: '+0%',
      changeType: 'increase',
      icon: HomeIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Approved Properties',
      value: approvedProperties.toString(),
      change: '+0%',
      changeType: 'increase',
      icon: HomeIcon,
      color: 'bg-emerald-500'
    },
    {
      name: 'Featured Properties',
      value: featuredCount.toString(),
      change: '+0%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Total Schedules',
      value: totalSchedules.toString(),
      change: '+0%',
      changeType: 'increase',
      icon: CalendarIcon,
      color: 'bg-orange-500'
    },
    {
      name: 'Pending Schedules',
      value: pendingSchedules.toString(),
      change: '+0%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'bg-red-500'
    }
  ];

  // Generate recent activities from Firebase data
  const propertyActivities = properties
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2)
    .map((property, index) => ({
      id: property.id,
      type: 'property_listed',
      message: `New property "${property.title}" listed in ${property.location?.city || 'Unknown'}`,
      time: new Date(property.createdAt).toLocaleDateString(),
      color: 'bg-emerald-100 text-emerald-800'
    }));

  const scheduleActivities = schedules
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2)
    .map((schedule, index) => ({
      id: schedule.id,
      type: 'schedule_created',
      message: `New viewing scheduled for "${schedule.propertyTitle}"`,
      time: new Date(schedule.createdAt).toLocaleDateString(),
      color: 'bg-blue-100 text-blue-800'
    }));

  const recentActivities = [...propertyActivities, ...scheduleActivities]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of platform performance and activities
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <div className={`ml-2 flex items-center text-sm ${
                    stat.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'increase' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${activity.color}`}>
                  {activity.type.replace('_', ' ')}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <UserGroupIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
            </button>
            <button
              onClick={() => navigate('/admin/properties')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all"
            >
              <HomeIcon className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Review Properties</p>
            </button>
            <button
              onClick={() => navigate('/admin/schedules')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all"
            >
              <ChartBarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">View Reports</p>
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all"
            >
              <CurrencyDollarIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Financial Overview</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;