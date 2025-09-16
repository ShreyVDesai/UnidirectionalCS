import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // backend URL
});

// attach JWT automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
  console.log('[API REQUEST]', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});
api.interceptors.response.use(
  response => {
    console.log('[API RESPONSE]', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error('[API ERROR]', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);


export default api;
