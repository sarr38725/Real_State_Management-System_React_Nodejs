import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const response = await authService.getProfile();
          const currentUser = response.user;
          setUser(currentUser);
          setUserData({
            displayName: currentUser.full_name,
            role: currentUser.role,
            email: currentUser.email,
            phone: currentUser.phone || '',
            avatar: currentUser.profile_image || '',
            createdAt: currentUser.created_at,
          });
          setIsAdminMode(currentUser.role === 'admin');
        } catch (error) {
          authService.logout();
          setUser(null);
          setUserData(null);
          setIsAdminMode(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const currentUser = response.user;
      setUser(currentUser);
      setUserData({
        displayName: currentUser.full_name,
        role: currentUser.role,
        email: currentUser.email,
        phone: currentUser.phone || '',
        avatar: currentUser.profile_image || '',
      });
      setIsAdminMode(currentUser.role === 'admin');
      return { success: true, user: currentUser };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const signUp = async (email, password, additionalData) => {
    try {
      const response = await authService.register({
        email,
        password,
        full_name: additionalData.displayName || additionalData.full_name,
        phone: additionalData.phone || '',
        role: additionalData.role || 'user',
      });
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logout = async () => {
    try {
      authService.logout();
      setUser(null);
      setUserData(null);
      setIsAdminMode(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const hasRole = (role) => {
    return userData?.role === role;
  };

  const isAdmin = () => hasRole('admin');
  const isSeller = () => hasRole('agent');
  const isBuyer = () => hasRole('user');

  const value = {
    user,
    userData,
    loading,
    isAdminMode,
    hasRole,
    isAdmin,
    isSeller,
    isBuyer,
    login,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
