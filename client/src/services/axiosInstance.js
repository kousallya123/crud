import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_URL,
});


const includedRoutes = ['/dashboard', 'user']; // Add the routes without parameters

axiosInstance.interceptors.request.use(
  async (config) => {
    const isIncludedRoute = includedRoutes.some((route) => config.url.startsWith(route));
    if (isIncludedRoute) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers['Authorization'] = ` ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry && includedRoutes.some((route) => originalRequest.url.startsWith(route))) {
      originalRequest._retry = true;

      toast.error('Session expired. Please log in again.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
