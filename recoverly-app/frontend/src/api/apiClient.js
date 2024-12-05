import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const isAdminRoute = config.url.startsWith('/admins');
    const tokenKey = isAdminRoute ? 'adminToken' : 'userToken';

    const token = localStorage.getItem(tokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request errors
);

export default apiClient;
