import api from './api';

export const propertyService = {
  async getAllProperties(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },

  async getPropertyById(id) {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  async createProperty(propertyData) {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  async updateProperty(id, propertyData) {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  async deleteProperty(id) {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  async getFeaturedProperties() {
    const response = await api.get('/properties?featured=true');
    return response.data;
  },
};
