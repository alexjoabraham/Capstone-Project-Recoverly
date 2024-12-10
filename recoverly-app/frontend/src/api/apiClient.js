import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const isAdminRoute = config.url.includes('/admins') || config.url.includes('/admin-dashboard') || config.url.includes('/email-list') || config.url.includes('/admin-lost-items') || config.url.includes('/admin-claim-requests'); 
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
