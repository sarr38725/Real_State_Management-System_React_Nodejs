import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { useSchedule } from '../context/ScheduleContext';
import { HomeIcon, HeartIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const { userData, user } = useAuth();
  const { properties } = useProperties();
  const { schedules } = useSchedule();

  // Calculate real stats from Firebase data
  const userProperties = properties.filter(p => p.ownerId === user?.uid);
  const userSchedules = schedules.filter(s => s.userId === user?.uid);
  const totalListings = userProperties.length;
  const activeListings = userProperties.filter(p => p.status === 'approved').length;
  
  // Mock data for favorites and views (these would come from separate collections)
  const favoritesCount = 8; // This would come from favorites collection
  const totalSchedules = userSchedules.length; // User's schedules

  const stats = [
    {
      name: 'Properties Listed',
      value: totalListings.toString(),
      icon: HomeIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Favorites',
      value: favoritesCount.toString(),
      icon: HeartIcon,
      color: 'bg-red-500'
    },
    {
      name: 'Views This Month',
      value: totalSchedules.toString(),
      icon: UserIcon,
      color: 'bg-emerald-500'
    },
    {
      name: 'Active Listings',
      value: activeListings.toString(),
      icon: PlusIcon,
      color: 'bg-purple-500'
    }
  ];

  // Generate recent activities from user's properties
  const propertyActivities = userProperties
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2)
    .map(property => ({
      id: property.id,
      title: `Property "${property.title}" listed`,
      time: new Date(property.createdAt).toLocaleDateString(),
      status: property.status
    }));

  const scheduleActivities = userSchedules
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2)
    .map(schedule => ({
      id: schedule.id,
      title: `Viewing scheduled for "${schedule.propertyTitle}"`,
      time: new Date(schedule.createdAt).toLocaleDateString(),
      status: schedule.status
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
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userData?.displayName || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your real estate portfolio
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
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* My Schedules Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Schedules</h2>
          <Link to="/properties" className="text-blue-600 hover:text-blue-800 text-sm">
            Browse Properties
          </Link>
        </div>
        <div className="space-y-3">
          {userSchedules.length > 0 ? (
            userSchedules.slice(0, 3).map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{schedule.propertyTitle}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(schedule.scheduledDate).toLocaleDateString()} at {new Date(schedule.scheduledDate).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  schedule.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 
                  schedule.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {schedule.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No schedules yet</p>
              <p className="text-sm text-gray-400 mt-1">Browse properties and schedule viewings</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mr-4 ${
                  activity.status === 'approved' ? 'bg-emerald-500' : 
                  activity.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activities</p>
              <p className="text-sm text-gray-400 mt-1">Start by adding your first property</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;