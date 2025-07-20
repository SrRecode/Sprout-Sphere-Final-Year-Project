import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PlantCareContext = createContext();

export const usePlantCare = () => {
  const context = useContext(PlantCareContext);
  if (!context) {
    throw new Error('usePlantCare must be used within a PlantCareProvider');
  }
  return context;
};

export const PlantCareProvider = ({ children }) => {
  const [careSchedules, setCareSchedules] = useState(() => {
    const savedSchedules = localStorage.getItem('plantCareSchedules');
    return savedSchedules ? JSON.parse(savedSchedules) : [];
  });

  const [reminders, setReminders] = useState(() => {
    const savedReminders = localStorage.getItem('plantCareReminders');
    return savedReminders ? JSON.parse(savedReminders) : [];
  });

  // Save schedules and reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('plantCareSchedules', JSON.stringify(careSchedules));
  }, [careSchedules]);

  useEffect(() => {
    localStorage.setItem('plantCareReminders', JSON.stringify(reminders));
  }, [reminders]);

  const addCareSchedule = (schedule) => {
    setCareSchedules(prev => [...prev, { ...schedule, id: Date.now() }]);
    toast.success('Care schedule added successfully');
  };

  const updateCareSchedule = (scheduleId, updates) => {
    setCareSchedules(prev =>
      prev.map(schedule =>
        schedule.id === scheduleId ? { ...schedule, ...updates } : schedule
      )
    );
    toast.success('Care schedule updated successfully');
  };

  const deleteCareSchedule = (scheduleId) => {
    setCareSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
    toast.success('Care schedule deleted successfully');
  };

  const addReminder = (reminder) => {
    setReminders(prev => [...prev, { ...reminder, id: Date.now() }]);
    toast.success('Reminder added successfully');
  };

  const updateReminder = (reminderId, updates) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === reminderId ? { ...reminder, ...updates } : reminder
      )
    );
    toast.success('Reminder updated successfully');
  };

  const deleteReminder = (reminderId) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
    toast.success('Reminder deleted successfully');
  };

  const markReminderComplete = (reminderId) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === reminderId
          ? { ...reminder, completed: true, completedAt: new Date().toISOString() }
          : reminder
      )
    );
    toast.success('Reminder marked as complete');
  };

  const value = {
    careSchedules,
    reminders,
    addCareSchedule,
    updateCareSchedule,
    deleteCareSchedule,
    addReminder,
    updateReminder,
    deleteReminder,
    markReminderComplete
  };

  return (
    <PlantCareContext.Provider value={value}>
      {children}
    </PlantCareContext.Provider>
  );
};

export default PlantCareContext; 