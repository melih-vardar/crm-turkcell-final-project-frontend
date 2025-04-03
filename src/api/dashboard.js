import axiosInstance from './axios';

// Get dashboard statistics
export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/analytics-service/api/dashboard/stats');
  return response.data;
};

// Get recent activities
export const getRecentActivities = async (limit = 10) => {
  const response = await axiosInstance.get(`/analytics-service/api/dashboard/activities?limit=${limit}`);
  return response.data;
};

// Get revenue chart data
export const getRevenueChartData = async (period = 'monthly') => {
  const response = await axiosInstance.get(`/analytics-service/api/dashboard/revenue-chart?period=${period}`);
  return response.data;
};

// Get customer growth chart data
export const getCustomerGrowthData = async (period = 'monthly') => {
  const response = await axiosInstance.get(`/analytics-service/api/dashboard/customer-growth?period=${period}`);
  return response.data;
};

// Get plan distribution data
export const getPlanDistributionData = async () => {
  const response = await axiosInstance.get('/analytics-service/api/dashboard/plan-distribution');
  return response.data;
}; 