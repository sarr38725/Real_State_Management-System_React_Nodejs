import api from './api';

const scheduleService = {
  getAllSchedules: async () => {
    try {
      const response = await api.get('/schedules/all');
      return { success: true, data: response.data.schedules };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch schedules'
      };
    }
  },

  getUserSchedules: async () => {
    try {
      const response = await api.get('/schedules/user');
      return { success: true, data: response.data.schedules };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user schedules'
      };
    }
  },

  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/schedules', scheduleData);
      return { success: true, data: response.data.schedule };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create schedule'
      };
    }
  },

  updateScheduleStatus: async (scheduleId, status) => {
    try {
      const response = await api.patch(`/schedules/${scheduleId}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update schedule status'
      };
    }
  },

  deleteSchedule: async (scheduleId) => {
    try {
      const response = await api.delete(`/schedules/${scheduleId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete schedule'
      };
    }
  }
};

export default scheduleService;
