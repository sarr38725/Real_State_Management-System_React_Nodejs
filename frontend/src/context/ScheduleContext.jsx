import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import scheduleService from '../services/scheduleService';

const ScheduleContext = createContext();

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }) => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserSchedules();
    }
  }, [user]);

  const loadAllSchedules = async () => {
    setLoading(true);
    try {
      const result = await scheduleService.getAllSchedules();
      console.log('getAllSchedules result:', result);
      if (result.success && result.data) {
        const formattedSchedules = result.data.map(schedule => {
          let scheduledDate;
          try {
            const dateTimeString = `${schedule.visit_date}T${schedule.visit_time}`;
            scheduledDate = new Date(dateTimeString).toISOString();
          } catch (error) {
            scheduledDate = `${schedule.visit_date} ${schedule.visit_time}`;
          }

          return {
            id: schedule.id,
            propertyId: schedule.property_id,
            propertyTitle: schedule.propertyTitle || 'Unknown Property',
            propertyAddress: schedule.propertyAddress || 'Unknown Address',
            userId: schedule.user_id,
            userName: schedule.userName || 'Unknown User',
            userEmail: schedule.userEmail || 'Unknown Email',
            scheduledDate: scheduledDate,
            contactMethod: schedule.contact_method || 'email',
            message: schedule.message || '',
            status: schedule.status,
            createdAt: schedule.created_at
          };
        });
        console.log('Formatted schedules:', formattedSchedules);
        setSchedules(formattedSchedules);
      } else {
        console.warn('No schedules loaded or unsuccessful result');
        setSchedules([]);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSchedules = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await scheduleService.getUserSchedules();
      if (result.success) {
        const formattedSchedules = result.data.map(schedule => ({
          id: schedule.id,
          propertyId: schedule.property_id,
          propertyTitle: schedule.propertyTitle,
          propertyAddress: schedule.propertyAddress,
          propertyCity: schedule.propertyCity,
          scheduledDate: `${schedule.visit_date} ${schedule.visit_time}`,
          message: schedule.message,
          status: schedule.status,
          createdAt: schedule.created_at
        }));
        setSchedules(formattedSchedules);
      } else {
        setSchedules([]);
      }
    } catch (error) {
      console.error('Error loading user schedules:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (scheduleData) => {
    if (!user) {
      return { success: false, error: 'User must be logged in' };
    }

    try {
      const result = await scheduleService.createSchedule(scheduleData);
      if (result.success) {
        await loadUserSchedules();
      }
      return result;
    } catch (error) {
      console.error('Error creating schedule:', error);
      return { success: false, error: error.message };
    }
  };

  const updateScheduleStatus = async (scheduleId, status) => {
    try {
      const result = await scheduleService.updateScheduleStatus(scheduleId, status);
      if (result.success) {
        setSchedules(prev =>
          prev.map(schedule =>
            schedule.id === scheduleId
              ? { ...schedule, status }
              : schedule
          )
        );
      }
      return result;
    } catch (error) {
      console.error('Error updating schedule status:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteSchedule = async (scheduleId) => {
    try {
      const result = await scheduleService.deleteSchedule(scheduleId);
      if (result.success) {
        setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
      }
      return result;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    schedules,
    loading,
    loadAllSchedules,
    loadUserSchedules,
    createSchedule,
    updateScheduleStatus,
    deleteSchedule
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
