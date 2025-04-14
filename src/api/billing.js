import axiosInstance from './axios';

// Get bill by ID
export const getBillById = async (id) => {
  const response = await axiosInstance.get(`/api/bills/${id}`);
  return response.data;
};

// Get customer bills
export const getCustomerBills = async (customerId) => {
  const response = await axiosInstance.get(`/api/bills/customer/${customerId}`);
  return response.data;
};

// Get unpaid bills
export const getUnpaidBills = async () => {
  const response = await axiosInstance.get('/api/v1/bills/unpaid');
  return response.data;
};

// Create bill
export const createBill = async (customerId, contractId) => {
  const response = await axiosInstance.post(`/api/bills/${customerId}/${contractId}`);
  return response.data;
};

// Update bill
export const updateBill = async (billId, billData) => {
  const response = await axiosInstance.put(`/api/bills/${billId}`, billData);
  return response.data;
};

// Delete bill
export const deleteBill = async (billId) => {
  await axiosInstance.delete(`/api/bills/${billId}`);
  return true;
};

// Process payment
export const processPayment = async (billId, paymentData) => {
  const response = await axiosInstance.post(`/api/payments/${billId}`, paymentData);
  return response.data;
};

// Get payment by ID
export const getPaymentById = async (id) => {
  const response = await axiosInstance.get(`/api/payments/${id}`);
  return response.data;
};

// Get bill payment
export const getBillPayment = async (billId) => {
  const response = await axiosInstance.get(`/api/payments/paymentByBill/${billId}`);
  return response.data;
};

// Get all payments
export const getAllPayments = async () => {
  const response = await axiosInstance.get('/api/payments');
  return response.data;
};

// Get payments by status
export const getPaymentsByStatus = async (status) => {
  const response = await axiosInstance.get(`/api/payments/status?status=${status}`);
  return response.data;
};

// Get payments by method
export const getPaymentsByMethod = async (method) => {
  const response = await axiosInstance.get(`/api/payments/method/${method}`);
  return response.data;
};

// Get payment methods
export const getPaymentMethods = async () => {
  const response = await axiosInstance.get('/api/v1/payments/methods');
  return response.data;
}; 