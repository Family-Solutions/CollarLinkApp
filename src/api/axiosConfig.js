import axios from 'axios';

const apiClient = axios.create({
  // Asegúrate de que este sea el puerto correcto de tu backend Spring Boot
  baseURL: 'https://collar-link-production.up.railway.app/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las cabeceras de todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;