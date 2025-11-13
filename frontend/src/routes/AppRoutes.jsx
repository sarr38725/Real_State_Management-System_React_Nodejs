import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Layouts
import SiteLayout from '../layouts/SiteLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import HomePage from '../pages/HomePage';
import PropertiesPage from '../pages/PropertiesPage';
import PropertyDetailPage from '../pages/PropertyDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';

// Protected Pages
import DashboardPage from '../pages/DashboardPage';
import MyPropertiesPage from '../pages/MyPropertiesPage';
import AddPropertyPage from '../pages/AddPropertyPage';
import EditPropertyPage from '../pages/EditPropertyPage';
import FavoritesPage from '../pages/FavoritesPage';
import ProfilePage from '../pages/ProfilePage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminProperties from '../pages/admin/AdminProperties';
import AdminAddProperty from '../pages/admin/AdminAddProperty';
import AdminSchedules from '../pages/admin/AdminSchedules';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminSales from '../pages/admin/AdminSales';

import LoadingSpinner from '../components/common/LoadingSpinner';

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="properties" element={<MyPropertiesPage />} />
          <Route path="properties/add" element={
            <RoleRoute allowedRoles={['seller', 'admin']}>
              <AddPropertyPage />
            </RoleRoute>
          } />
          <Route path="properties/edit/:id" element={
            <RoleRoute allowedRoles={['seller', 'admin']}>
              <EditPropertyPage />
            </RoleRoute>
          } />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="properties/add" element={<AdminAddProperty />} />
          <Route path="properties/edit/:id" element={<EditPropertyPage />} />
          <Route path="schedules" element={<AdminSchedules />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;