import axiosInstance from './axios';

// Get all tickets
export const getAllTickets = async () => {
  const response = await axiosInstance.get('/customer-support-service/api/tickets');
  return response.data;
};

// Get ticket by ID
export const getTicketById = async (id) => {
  const response = await axiosInstance.get(`/customer-support-service/api/tickets/${id}`);
  return response.data;
};

// Get customer tickets
export const getCustomerTickets = async (customerId) => {
  const response = await axiosInstance.get(`/customer-support-service/api/tickets/customer/${customerId}`);
  return response.data;
};

// Create ticket
export const createTicket = async (ticketData) => {
  const response = await axiosInstance.post('/customer-support-service/api/tickets', ticketData);
  return response.data;
};

// Update ticket
export const updateTicket = async (id, ticketData) => {
  const response = await axiosInstance.put(`/customer-support-service/api/tickets/${id}`, ticketData);
  return response.data;
};

// Add ticket comment
export const addTicketComment = async (id, commentData) => {
  const response = await axiosInstance.post(`/customer-support-service/api/tickets/${id}/comments`, commentData);
  return response.data;
};

// Close ticket
export const closeTicket = async (id) => {
  const response = await axiosInstance.put(`/customer-support-service/api/tickets/${id}/close`);
  return response.data;
};

// Reopen ticket
export const reopenTicket = async (id) => {
  const response = await axiosInstance.put(`/customer-support-service/api/tickets/${id}/reopen`);
  return response.data;
}; 