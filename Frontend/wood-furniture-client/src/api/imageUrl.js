// Helper function to construct full image URL from backend relative path
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    
    const baseUrl = import.meta.env.VITE_API_URL.replace('http://localhost:5059/api', '');
    return `${baseUrl}/${imagePath}`;
};
