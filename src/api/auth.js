import axiosInstance from './axios';

export const loginWithEmail = async (email, password) => {
  const response = await axiosInstance.post('/api/auth/login-with-email', { email, password });
  return response.data;
};

export const loginWithUsername = async (username, password) => {
  const response = await axiosInstance.post('/api/auth/login', { username, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await axiosInstance.post('/api/auth/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post('/api/auth/logout');
  return response.data;
};

export const getUserInfo = async () => {
  const response = await axiosInstance.get('/api/users/me');
  return response.data;
}; 