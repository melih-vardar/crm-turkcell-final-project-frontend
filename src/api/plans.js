import axiosInstance from './axios';

// Get all plans
export const getAllPlans = async () => {
  const response = await axiosInstance.get('/api/plans');
  return response.data;
};

// Get plan by ID
export const getPlanById = async (id) => {
  const response = await axiosInstance.get(`/api/plans/${id}`);
  return response.data;
};

// Create plan
export const createPlan = async (planData) => {
  const response = await axiosInstance.post('/api/plans', planData);
  return response.data;
};

// Update plan
export const updatePlan = async (id, planData) => {
  const response = await axiosInstance.put(`/api/plans/${id}`, planData);
  return response.data;
};

// Delete plan
export const deletePlan = async (id) => {
  await axiosInstance.delete(`/api/plans/${id}`);
  return true;
}; 