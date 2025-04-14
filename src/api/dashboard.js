import axiosInstance from './axios';

// Get customer behavior analytics
export const getCustomerBehaviorAnalytics = async () => {
  const response = await axiosInstance.get('/api/analytics/customer-behavior');
  return response.data;
};

// Get customer support behavior analytics
export const getCustomerSupportBehaviorAnalytics = async () => {
  const response = await axiosInstance.get('/api/analytics/customer-support-behavior');
  return response.data;
};

// Get user creation analytics
export const getUserCreationAnalytics = async () => {
  const response = await axiosInstance.get('/api/analytics/user-behavior/user-create-analytics');
  return response.data;
};

// Get login analytics
export const getLoginAnalytics = async () => {
  const response = await axiosInstance.get('/api/analytics/user-behavior/login-analytics');
  return response.data;
}; 