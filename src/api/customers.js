import axiosInstance from './axios';

// Get all customers
export const getAllCustomers = async () => {
  const response = await axiosInstance.get('/api/customers');
  return response.data;
};

// Get customer by ID
export const getCustomerById = async (id) => {
  const response = await axiosInstance.get(`/api/customers/${id}`);
  return response.data;
};

// Create customer
export const createCustomer = async (customerData) => {
  const response = await axiosInstance.post('/api/customers', customerData);
  return response.data;
};

// Update customer
export const updateCustomer = async (id, customerData) => {
  const response = await axiosInstance.put(`/api/customers/${id}`, customerData);
  return response.data;
};

// Delete customer
export const deleteCustomer = async (id) => {
  await axiosInstance.delete(`/api/customers/${id}`);
  return true;
}; 