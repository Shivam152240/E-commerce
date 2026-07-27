export const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image")) {
    return url;
  }
  const path = url.startsWith("/") ? url : `/${url}`;
  const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';
  return `${baseUrl}${path}`;
};
