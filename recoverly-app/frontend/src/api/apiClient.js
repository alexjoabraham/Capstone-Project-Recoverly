import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const isAdminRoute = config.url.includes('/admins') || config.url.includes('/admin-dashboard');
    const tokenKey = isAdminRoute ? 'adminToken' : 'userToken';

    const token = localStorage.getItem(tokenKey);
    console.log('Intercepting Request:', config.url, 'Token Key:', tokenKey, 'Token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    console.error('Axios Request Interceptor Error:', error); 
    return Promise.reject(error);
  }
);

export default apiClient;
