import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { useProperties } from '../context/PropertyContext';
import { useUI } from '../context/UIContext';
import { propertyService } from '../services/propertyService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editProperty } = useProperties();
  const { showToast } = useUI();
  const isAdminRoute = window.location.pathname.includes('/admin/');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'house',
    bedrooms: '',
    bathrooms: '',
    area: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    amenities: [],
    featured: false
  });

  // --- IMAGE STATE ---
  const [images, setImages] = useState([]);                    // new local files (File[])
  const [existingImages, setExistingImages] = useState([]);    // URLs already saved
  const [removedExistingImages, setRemovedExistingImages] = useState([]); // URLs to delete on backend
  const [replaceMode, setReplaceMode] = useState(false);       // toggle: replace vs append

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'villa', label: 'Villa' },
    { value: 'townhouse', label: 'Townhouse' }
  ];

  const amenityOptions = [
    'Swimming Pool', 'Garage', 'Garden', 'Balcony', 'Fireplace',
    'Air Conditioning', 'Heating', 'Gym', 'Security System', 'Elevator'
  ];

  useEffect(() => {
    let isMounted = true;

    const loadProperty = async () => {
      try {
        const response = await propertyService.getPropertyById(id);
        if (!isMounted) return;

        const property = response.property || response;

        if (property && property.id) {
          setFormData({
            title: property.title || '',
            description: property.description || '',
            price: property.price?.toString() || '',
            type: property.property_type || property.type || 'house',
            bedrooms: property.bedrooms?.toString() || '',
            bathrooms: property.bathrooms?.toString() || '',
            area: property.area_sqft?.toString() || property.area?.toString() || '',
            address: property.address || '',
            city: property.city || '',
            state: property.state || '',
            zipCode: property.zip_code || property.zipCode || '',
            amenities: property.amenities || [],
            featured: property.featured || false
          });
          setExistingImages(property.images || []);
          setRemovedExistingImages([]); // reset any prior state
          setImages([]);                // reset new uploads
        } else {
          showToast('Property not found', 'error');
          navigate(isAdminRoute ? '/admin/properties' : '/dashboard/properties');
        }
      } catch (error) {
        console.error('Error loading property:', error);
        if (isMounted) {
          showToast('Failed to load property', 'error');
          navigate(isAdminRoute ? '/admin/properties' : '/dashboard/properties');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProperty();
    return () => { isMounted = false; };
  }, [id, navigate, showToast, isAdminRoute]);

  // --- IMAGE HELPERS ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (replaceMode) {
      // mark all current existing images for removal and clear them
      setRemovedExistingImages(prev => [...prev, ...existingImages]);
      setExistingImages([]);
      // replace new uploads (not append)
      setImages(files);
    } else {
      // append new uploads
      setImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) {
        setRemovedExistingImages(old => [...old, removed]);
      }
      return copy;
    });
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        type: formData.type,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        amenities: formData.amenities,
        featured: formData.featured,

        // keep what is currently shown as existing
        images: existingImages,

        // NEW metadata for backend
        imagesToRemove: removedExistingImages,
        replaceImages: replaceMode
      };

      const result = await editProperty(id, propertyData, images); // images = File[] to upload

      if (result?.success) {
        showToast('Property updated successfully!', 'success');
        navigate(isAdminRoute ? '/admin/properties' : '/dashboard/properties');
      } else {
        showToast(result?.error || 'Failed to update property', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update property. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
        <p className="mt-2 text-gray-600">Update your property listing</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Basic Information */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Property Title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Modern 3BR House with Garden"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your property..."
              />
            </div>

            <Input
              label="Price"
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0"
            />

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <Input
              label="Bedrooms"
              type="number"
              required
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              placeholder="0"
            />

            <Input
              label="Bathrooms"
              type="number"
              required
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              placeholder="0"
            />

            <Input
              label="Area (sq ft)"
              type="number"
              required
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="0"
            />
          </div>
        </div>

        {/* Location */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Location</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
              />
            </div>

            <Input
              label="City"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="City"
            />

            <Input
              label="State"
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="State"
            />

            <Input
              label="ZIP Code"
              required
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              placeholder="ZIP Code"
            />
          </div>
        </div>

        {/* Images */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Images</h2>

          {/* Replace / Append toggle */}
          <div className="flex items-center gap-2 mb-4">
            <input
              id="replace-mode"
              type="checkbox"
              checked={replaceMode}
              onChange={(e) => setReplaceMode(e.target.checked)}
              className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="replace-mode" className="text-sm text-gray-700">
              Replace existing images with new uploads
            </label>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-gray-700">Current Images</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {existingImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative">
                    <img
                      src={image}
                      alt={`Current ${index + 1}`}
                      className="object-cover w-full h-24 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute flex items-center justify-center w-6 h-6 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
                      aria-label="Remove existing image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload box */}
          <div className="p-6 text-center border-2 border-gray-300 border-dashed rounded-lg">
            <PhotoIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Upload additional images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Choose Files
                </span>
              </label>
            </div>
          </div>

          {/* New images preview */}
          {images.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-3 text-sm font-medium text-gray-700">New Images</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="object-cover w-full h-24 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute flex items-center justify-center w-6 h-6 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
                      aria-label="Remove new image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Amenities</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {amenityOptions.map(amenity => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Mark as Featured Property
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Featured properties get more visibility in search results
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(isAdminRoute ? '/admin/properties' : '/dashboard/properties')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Update Property
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default EditPropertyPage;
