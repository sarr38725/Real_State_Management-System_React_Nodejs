const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getImageUrl = (imageId) => {
  if (!imageId) return null;

  if (typeof imageId === 'string' && (imageId.startsWith('http://') || imageId.startsWith('https://'))) {
    return imageId;
  }

  return `${API_BASE_URL}/images/${imageId}`;
};

export const getImageUrls = (images) => {
  if (!images || !Array.isArray(images)) return [];
  return images.map(img => getImageUrl(img)).filter(Boolean);
};
