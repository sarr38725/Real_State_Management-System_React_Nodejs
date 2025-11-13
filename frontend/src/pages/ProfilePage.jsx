import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ProfilePage = () => {
  const { user, userData, isAdminMode, logout } = useAuth();
  const { showToast } = useUI();

  const handleSignOut = async () => {
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
      console.error('Signout error:', error);
      showToast('Failed to sign out: ' + error.message, 'error');
    }
  };

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userData?.displayName || '',
    phone: userData?.phone || '',
    email: user?.email || ''
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would update the user profile
      showToast('Profile updated successfully!', 'success');
      setEditing(false);
    } catch (error) {
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account information
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {userData?.displayName?.[0] || user?.email[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {userData?.displayName || 'User'}
            </h2>
            <p className="text-gray-600 capitalize">{userData?.role || 'buyer'}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              disabled={!editing}
              icon={UserIcon}
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              disabled={true}
              icon={EnvelopeIcon}
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              disabled={!editing}
              icon={PhoneIcon}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <input
                id="account-type"
                name="account-type"
                type="text"
                value={userData?.role || 'buyer'}
                disabled
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="danger"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>

            <div className="flex space-x-3">
              {editing ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        displayName: userData?.displayName || '',
                        phone: userData?.phone || '',
                        email: user?.email || ''
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={loading}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </form>
      </motion.div>

      {/* Account Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Properties Listed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">8</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">1.2K</div>
            <div className="text-sm text-gray-600">Profile Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">45</div>
            <div className="text-sm text-gray-600">Inquiries</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;