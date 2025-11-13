import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { propertyService } from '../services/propertyService';
import { useAuth } from './AuthContext';

const PropertyContext = createContext();

export const useProperties = () => {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error('useProperties must be used within a PropertyProvider');
  return ctx;
};

export const PropertyProvider = ({ children }) => {
  const { user, isAdminMode } = useAuth();
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProperties = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const filterParams = {};

      if (filters.status !== undefined) {
        filterParams.status = filters.status;
      } else if (!isAdminMode) {
        filterParams.status = 'available';
      }

      if (filters.type) filterParams.property_type = filters.type;
      if (filters.location) filterParams.city = filters.location;
      if (filters.minPrice) filterParams.min_price = filters.minPrice;
      if (filters.maxPrice) filterParams.max_price = filters.maxPrice;
      if (filters.bedrooms) filterParams.bedrooms = filters.bedrooms;

      const response = await propertyService.getAllProperties(filterParams);
      const list = response.properties.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        type: p.property_type,
        listingType: p.listing_type,
        price: p.price,
        location: {
          address: p.address,
          city: p.city,
          state: p.state,
          zipCode: p.zip_code,
          country: p.country,
        },
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area_sqft,
        yearBuilt: p.year_built,
        status: p.status,
        featured: p.featured,
        images: p.images || [],
        agent: {
          name: p.agent_name,
          email: p.agent_email,
          phone: p.agent_phone,
        },
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at),
      }));

      setProperties(list);
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [isAdminMode]);

  const loadFeaturedProperties = useCallback(async () => {
    try {
      const response = await propertyService.getFeaturedProperties();
      const list = response.properties.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        type: p.property_type,
        listingType: p.listing_type,
        price: p.price,
        location: {
          address: p.address,
          city: p.city,
          state: p.state,
          zipCode: p.zip_code,
          country: p.country,
        },
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area_sqft,
        yearBuilt: p.year_built,
        status: p.status,
        featured: p.featured,
        images: p.images || [],
        agent: {
          name: p.agent_name,
          email: p.agent_email,
          phone: p.agent_phone,
        },
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at),
      }));

      setFeaturedProperties(list);
    } catch (error) {
      console.error('Error loading featured properties:', error);
      setFeaturedProperties([]);
    }
  }, []);

  const loadUserProperties = useCallback(async () => {
    if (!user) {
      console.error('User must be logged in to load user properties');
      return;
    }
    setLoading(true);
    try {
      const response = await propertyService.getAllProperties();
      const list = response.properties
        .filter(p => p.agent_id === user.id)
        .map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          type: p.property_type,
          listingType: p.listing_type,
          price: p.price,
          location: {
            address: p.address,
            city: p.city,
            state: p.state,
            zipCode: p.zip_code,
            country: p.country,
          },
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          area: p.area_sqft,
          yearBuilt: p.year_built,
          status: p.status,
          featured: p.featured,
          images: p.images || [],
          createdAt: new Date(p.created_at),
          updatedAt: new Date(p.updated_at),
        }));

      setProperties(list);
    } catch (error) {
      console.error('Error loading user properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addProperty = useCallback(async (propertyData, imageFiles = []) => {
    if (!user) return { success: false, error: 'User must be logged in to add properties' };

    try {
      let imageUrls = [];

      if (Array.isArray(imageFiles) && imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach(file => {
          formData.append('images', file);
        });

        const token = localStorage.getItem('token');
        const uploadResponse = await fetch('http://localhost:5000/api/upload/images', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload images');
        }

        const uploadData = await uploadResponse.json();
        imageUrls = uploadData.images || [];
      }

      const payload = {
        title: propertyData.title,
        description: propertyData.description,
        property_type: propertyData.type,
        listing_type: propertyData.listingType || 'sale',
        price: parseFloat(propertyData.price),
        address: propertyData.location.address,
        city: propertyData.location.city,
        state: propertyData.location.state,
        zip_code: propertyData.location.zipCode,
        country: propertyData.location.country || 'USA',
        bedrooms: parseInt(propertyData.bedrooms) || 0,
        bathrooms: parseInt(propertyData.bathrooms) || 0,
        area_sqft: parseInt(propertyData.area),
        year_built: parseInt(propertyData.yearBuilt) || null,
        featured: propertyData.featured || false,
        images: imageUrls,
      };

      const response = await propertyService.createProperty(payload);
      await loadProperties();

      return { success: true, id: response.propertyId };
    } catch (error) {
      console.error('Error adding property:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }, [user, loadProperties]);

  const editProperty = useCallback(async (id, propertyData, newImageFiles = []) => {
    if (!user) return { success: false, error: 'User must be logged in to edit properties' };

    try {
      let imageUrls = Array.isArray(propertyData.images) ? [...propertyData.images] : [];

      if (Array.isArray(newImageFiles) && newImageFiles.length > 0) {
        const formData = new FormData();
        newImageFiles.forEach(file => {
          formData.append('images', file);
        });

        const token = localStorage.getItem('token');
        const uploadResponse = await fetch('http://localhost:5000/api/upload/images', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload images');
        }

        const uploadData = await uploadResponse.json();
        imageUrls = [...imageUrls, ...(uploadData.images || [])];
      }

      const payload = {
        title: propertyData.title,
        description: propertyData.description,
        property_type: propertyData.type,
        listing_type: propertyData.listingType || 'sale',
        price: parseFloat(propertyData.price),
        address: propertyData.location.address,
        city: propertyData.location.city,
        state: propertyData.location.state,
        zip_code: propertyData.location.zipCode,
        country: propertyData.location.country || 'USA',
        bedrooms: parseInt(propertyData.bedrooms) || 0,
        bathrooms: parseInt(propertyData.bathrooms) || 0,
        area_sqft: parseInt(propertyData.area),
        year_built: parseInt(propertyData.yearBuilt) || null,
        status: propertyData.status || 'available',
        featured: propertyData.featured || false,
        images: imageUrls,
      };

      await propertyService.updateProperty(id, payload);
      await loadProperties();

      return { success: true };
    } catch (error) {
      console.error('Error updating property:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }, [user, loadProperties]);

  const removeProperty = useCallback(async (id) => {
    if (!user) return { success: false, error: 'User must be logged in to delete properties' };

    try {
      await propertyService.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      setFeaturedProperties(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting property:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }, [user]);

  const updatePropertyStatus = useCallback(async (id, status) => {
    if (!user) throw new Error('User must be logged in to update property status');

    try {
      const property = properties.find(p => p.id === id);
      if (!property) throw new Error('Property not found');

      const payload = {
        title: property.title,
        description: property.description,
        property_type: property.type,
        listing_type: property.listingType,
        price: property.price,
        address: property.location.address,
        city: property.location.city,
        state: property.location.state,
        zip_code: property.location.zipCode,
        country: property.location.country,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area_sqft: property.area,
        year_built: property.yearBuilt,
        status: status,
        featured: property.featured,
      };

      await propertyService.updateProperty(id, payload);
      await loadProperties();
    } catch (error) {
      console.error('Error updating property status:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  }, [user, properties, loadProperties]);

  useEffect(() => {
    loadProperties();
    loadFeaturedProperties();
  }, [loadProperties, loadFeaturedProperties]);

  const value = {
    properties,
    featuredProperties,
    loading,
    loadProperties,
    loadUserProperties,
    loadFeaturedProperties,
    addProperty,
    editProperty,
    removeProperty,
    updatePropertyStatus
  };

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};
