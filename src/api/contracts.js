import axiosInstance from './axios';

// Test endpoint
export const testContractEndpoint = async () => {
  try {
    const response = await axiosInstance.get('/api/contracts/test');
    console.log('Test endpoint response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Test endpoint error:', error);
    throw error;
  }
};

// Create new contract
export const createContract = async (contractData) => {
  // ContractCreateDTO yapısına göre veri oluştur
  const contractCreateDTO = {
    customerId: contractData.customerId,
    planId: contractData.planId,
    startDate: contractData.startDate,
    endDate: contractData.endDate,
    planName: contractData.planName
  };
  
  console.log('API tarafında gönderilecek veri:', contractCreateDTO);
  
  const response = await axiosInstance.post('/api/contracts', contractCreateDTO, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Get contract by ID
export const getContractById = async (id) => {
  const response = await axiosInstance.get(`/api/contracts/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Get detailed contract by ID
export const getContractDetailedById = async (id) => {
  const response = await axiosInstance.get(`/api/contracts/${id}/detailed`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Get contracts by customer ID
export const getContractsByCustomerId = async (customerId) => {
  const response = await axiosInstance.get(`/api/contracts/customer/${customerId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Get detailed contracts by customer ID
export const getDetailedContractsByCustomerId = async (customerId) => {
  const response = await axiosInstance.get(`/api/contracts/customer/${customerId}/detailed`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Update contract
export const updateContract = async (id, contractData) => {
  // DTO yapısına göre veri oluştur
  const contractUpdateDTO = {
    customerId: contractData.customerId,
    planName: contractData.planName,
    planId: contractData.planId,
    startDate: contractData.startDate,
    endDate: contractData.endDate
  };
  
  console.log('API tarafında güncellenecek veri:', contractUpdateDTO);
  
  const response = await axiosInstance.put(`/api/contracts/${id}`, contractUpdateDTO, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Delete contract
export const deleteContract = async (id) => {
  await axiosInstance.delete(`/api/contracts/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return true;
}; 