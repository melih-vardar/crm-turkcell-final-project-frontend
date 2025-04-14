import axiosInstance from './axios';

// Get all tickets
export const getAllTickets = async () => {
  const response = await axiosInstance.get('/api/customer-support/tickets');
  return response.data;
};

// Get ticket by ID
export const getTicketById = async (id) => {
  const response = await axiosInstance.get(`/api/customer-support/tickets/${id}`);
  return response.data;
};

// Get customer tickets
export const getCustomerTickets = async (customerId) => {
  const response = await axiosInstance.get(`/api/customer-support/tickets?customerId=${customerId}`);
  return response.data;
};

// Create ticket
export const createTicket = async (ticketData) => {
  const response = await axiosInstance.post('/api/customer-support/tickets', ticketData);
  return response.data;
};

// Update ticket
export const updateTicket = async (id, ticketData) => {
  const response = await axiosInstance.put(`/api/customer-support/tickets/${id}`, ticketData);
  return response.data;
};

// Delete ticket
export const deleteTicket = async (id) => {
  await axiosInstance.delete(`/api/customer-support/tickets/${id}`);
  return true;
};

// Add ticket comment
export const addTicketComment = async (id, commentData) => {
  const response = await axiosInstance.post(`/api/customer-support/tickets/${id}/comments`, commentData);
  return response.data;
};

// Close ticket
export const closeTicket = async (id) => {
  const response = await axiosInstance.put(`/api/customer-support/tickets/${id}`, {
    status: 'CLOSED'
  });
  return response.data;
};

// Reopen ticket
export const reopenTicket = async (id) => {
  const response = await axiosInstance.put(`/api/customer-support/tickets/${id}`, {
    status: 'OPEN'
  });
  return response.data;
}; 