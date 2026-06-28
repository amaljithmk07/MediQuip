import axios from 'axios';
import Base_URL from '../components/Constant/constant';

const api = axios.create({
  baseURL: Base_URL,
  withCredentials: true, // Crucial for sending HttpOnly cookies
});

// Since tokens are in HttpOnly cookies, we don't need to manually inject them into headers.
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized, try to silently refresh the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Silent background token refresh
        await axios.post(`${Base_URL}/api/auth/refresh`, {}, { withCredentials: true });
        
        // If successful, retry the original failed request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (token expired/revoked), force logout
        if (typeof window !== 'undefined') {
          sessionStorage.clear();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // For non-401 errors, or if retry fails, return error
    return Promise.reject(error);
  }
);

export default api;
