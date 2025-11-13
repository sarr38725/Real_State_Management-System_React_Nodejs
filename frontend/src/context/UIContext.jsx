import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [modals, setModals] = useState({});

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const openModal = useCallback((modalId, props = {}) => {
    setModals(prev => ({ ...prev, [modalId]: { open: true, props } }));
  }, []);

  const closeModal = useCallback((modalId) => {
    setModals(prev => ({ ...prev, [modalId]: { open: false, props: {} } }));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const value = {
    theme,
    sidebarOpen,
    toasts,
    modals,
    showToast,
    removeToast,
    openModal,
    closeModal,
    toggleTheme,
    toggleSidebar
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};