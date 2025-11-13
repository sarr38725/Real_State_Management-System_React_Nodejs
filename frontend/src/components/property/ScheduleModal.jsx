import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useSchedule } from '../../context/ScheduleContext';
import { useUI } from '../../context/UIContext';
import Button from '../common/Button';
import Input from '../common/Input';

const ScheduleModal = ({ isOpen, onClose, property }) => {
  const { user, loading: authLoading } = useAuth(); // 
  const { createSchedule } = useSchedule();
  const { showToast } = useUI();

  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    message: '',
    contactMethod: 'phone'
  });
  const [submitting, setSubmitting] = useState(false);

  // reset form whenever modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        scheduledDate: '',
        scheduledTime: '',
        message: '',
        contactMethod: 'phone'
      });
      setSubmitting(false);
    } else {
      console.log('ScheduleModal opened with property:', property);
    }
  }, [isOpen, property]);

  const today = new Date().toISOString().split('T')[0];

  // 🔒 Don't render login-required while auth state is loading
  if (authLoading) return null;

  // 🚪 Login required variant (only when we know user is really absent)
  if (!user) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-500/75" onClick={onClose} />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block p-6 text-left align-bottom bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <h3 className="mb-2 text-lg font-medium text-gray-900">Login Required</h3>
                <p className="mb-6 text-gray-600">Please login to schedule a property viewing.</p>
                <div className="flex justify-end space-x-3">
                  <Button variant="secondary" onClick={onClose}>Cancel</Button>
                  <Button onClick={() => (window.location.href = '/login')}>Login</Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    if (!property || !property.id) {
      showToast('Property information is missing. Please try again.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        property_id: property.id,
        visit_date: formData.scheduledDate,
        visit_time: formData.scheduledTime,
        message: formData.message || null
      };

      console.log('Sending schedule request:', payload);

      const res = await createSchedule(payload);
      if (res?.success) {
        showToast('Viewing scheduled successfully! Agent will contact you soon.', 'success');
        onClose();
      } else {
        showToast(res?.error || 'Failed to schedule viewing', 'error');
      }
    } catch (error) {
      console.error('Schedule error:', error);
      showToast('Failed to schedule viewing. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500/75" onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative inline-block px-4 pt-5 pb-4 text-left align-bottom bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
            >
              <button onClick={onClose} className="absolute text-gray-400 rounded-md top-3 right-3 hover:text-gray-600 focus:ring-2 focus:ring-blue-500">
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="sm:flex sm:items-start">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="w-full mt-3 sm:mt-0 sm:ml-4">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">Schedule Property Viewing</h3>

                  <div className="p-3 mb-4 rounded-lg bg-gray-50">
                    <h4 className="font-medium text-gray-900">{property?.title}</h4>
                    <p className="text-sm text-gray-600">
                      {property?.location?.address}{property?.location?.city ? `, ${property.location.city}` : ''}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Preferred Date" type="date" required min={today}
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} />
                      <Input label="Preferred Time" type="time" required
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })} />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Contact Method</label>
                      <select
                        value={formData.contactMethod}
                        onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="phone">Phone Call</option>
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Message (Optional)</label>
                      <textarea rows={3} value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any specific requirements or questions..." />
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                      <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                      <Button type="submit" loading={submitting}>Schedule Viewing</Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleModal;
