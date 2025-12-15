import axios from "axios";

// استبدل الرابط ده برابط API الحقيقي
const api = axios.create({
  baseURL: "http://elgzeera.runasp.net/api", // <-- رابط الـ API الكامل
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor for better error handling
api.interceptors.request.use(
  (config) => {
    // يمكنك إضافة أي auth token هنا إذا احتجت
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
