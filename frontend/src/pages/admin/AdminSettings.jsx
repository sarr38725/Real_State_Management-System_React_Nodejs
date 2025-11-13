import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CogIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  GlobeAltIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useUI } from '../../context/UIContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AdminSettings = () => {
  const { showToast } = useUI();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'RealEstate',
    siteDescription: 'Your trusted real estate platform',
    contactEmail: 'admin@realestate.com',
    supportPhone: '(555) 123-4567',
    commissionRate: '5',
    featuredPropertyFee: '99',
    maxImagesPerProperty: '10',
    autoApproveProperties: false,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const settingSections = [
    {
      title: 'General Settings',
      icon: CogIcon,
      fields: [
        { key: 'siteName', label: 'Site Name', type: 'text' },
        { key: 'siteDescription', label: 'Site Description', type: 'textarea' },
        { key: 'contactEmail', label: 'Contact Email', type: 'email' },
        { key: 'supportPhone', label: 'Support Phone', type: 'tel' }
      ]
    },
    {
      title: 'Financial Settings',
      icon: CurrencyDollarIcon,
      fields: [
        { key: 'commissionRate', label: 'Commission Rate (%)', type: 'number' },
        { key: 'featuredPropertyFee', label: 'Featured Property Fee ($)', type: 'number' }
      ]
    },
    {
      title: 'Property Settings',
      icon: DocumentTextIcon,
      fields: [
        { key: 'maxImagesPerProperty', label: 'Max Images Per Property', type: 'number' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure platform-wide settings and preferences
        </p>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center mb-6">
              <section.icon className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field) => (
                <div key={field.key}>
                  {field.type === 'textarea' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <textarea
                        rows={3}
                        value={settings[field.key]}
                        onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <Input
                      label={field.label}
                      type={field.type}
                      value={settings[field.key]}
                      onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Toggle Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center mb-6">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Auto-approve Properties</h3>
                <p className="text-sm text-gray-500">Automatically approve new property listings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoApproveProperties}
                  onChange={(e) => setSettings({...settings, autoApproveProperties: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Send email notifications to users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-500">Send SMS notifications to users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">Put the site in maintenance mode</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" loading={loading} size="lg">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;