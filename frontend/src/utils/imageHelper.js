const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SERVER_BASE_URL = API_BASE_URL.replace('/api', '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('/uploads')) {
    return `${SERVER_BASE_URL}${imagePath}`;
  }

  return `${SERVER_BASE_URL}/uploads/properties/${imagePath}`;
};

export const getImageUrls = (images) => {
  if (!images || !Array.isArray(images)) return [];
  return images.map(img => getImageUrl(img)).filter(Boolean);
};
