import axios from 'axios';

// .env dosyasından API URL'ini al veya varsayılan değer kullan
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

console.log('Using API base URL:', baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized hatası - token süresi dolmuş veya geçersiz
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized error, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // 405 Method Not Allowed hatası
    if (error.response && error.response.status === 405) {
      console.error('API Method Not Allowed hatası:', error.config.method, error.config.url);
    }

    // JpaSystemException ve AttributeConverter hataları için loglama
    if (error.response && error.response.data) {
      // Eğer response.data bir string ise
      if (typeof error.response.data === 'string' && 
          (error.response.data.includes('JpaSystemException') || 
           error.response.data.includes('AttributeConverter'))) {
        console.error('JPA/AttributeConverter hatası:', error.response.data);
      }
      // Eğer response.data bir obje ve message alanı varsa
      else if (error.response.data.message && 
               typeof error.response.data.message === 'string' &&
               (error.response.data.message.includes('JpaSystemException') || 
                error.response.data.message.includes('AttributeConverter'))) {
        console.error('JPA/AttributeConverter hatası:', error.response.data.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 