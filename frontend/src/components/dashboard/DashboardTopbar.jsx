import React from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const DashboardTopbar = () => {
  const { toggleSidebar, showToast } = useUI();
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        showToast('Signed out successfully', 'success');
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        showToast(result.error || 'Failed to sign out', 'error');
      }
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Failed to sign out: ' + error.message, 'error');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userData?.displayName?.[0] || 'U'}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {userData?.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {userData?.role || 'buyer'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;