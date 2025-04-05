import axiosInstance from './axios';

// Get all invoices
export const getAllInvoices = async () => {
  const response = await axiosInstance.get('/api/invoices');
  return response.data;
};

// Get invoice by ID
export const getInvoiceById = async (id) => {
  const response = await axiosInstance.get(`/api/invoices/${id}`);
  return response.data;
};

// Get customer invoices
export const getCustomerInvoices = async (customerId) => {
  const response = await axiosInstance.get(`/api/invoices/customer/${customerId}`);
  return response.data;
};

// Create invoice
export const createInvoice = async (invoiceData) => {
  const response = await axiosInstance.post('/api/invoices', invoiceData);
  return response.data;
};

// Update invoice
export const updateInvoice = async (id, invoiceData) => {
  const response = await axiosInstance.put(`/api/invoices/${id}`, invoiceData);
  return response.data;
};

// Mark invoice as paid
export const markInvoiceAsPaid = async (id) => {
  const response = await axiosInstance.put(`/api/invoices/${id}/pay`);
  return response.data;
};

// Delete invoice
export const deleteInvoice = async (id) => {
  await axiosInstance.delete(`/api/invoices/${id}`);
  return true;
}; 