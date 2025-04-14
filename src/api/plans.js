import axiosInstance from './axios';

// Basic Plan API Functions
export const getBasicPlans = async () => {
  const response = await axiosInstance.get('/api/basic-plans');
  return response.data;
};

export const getBasicPlanById = async (id) => {
  const response = await axiosInstance.get(`/api/basic-plans/${id}`);
  return response.data;
};

export const createBasicPlan = async (basicPlanData) => {
  const basicPlanCreateDTO = {
    name: basicPlanData.name,
    description: basicPlanData.description,
    planType: basicPlanData.planType
  };
  
  const response = await axiosInstance.post('/api/basic-plans', basicPlanCreateDTO);
  return response.data;
};

export const updateBasicPlan = async (id, basicPlanData) => {
  const basicPlanUpdateDTO = {
    name: basicPlanData.name,
    description: basicPlanData.description,
    planType: basicPlanData.planType
  };
  
  const response = await axiosInstance.put(`/api/basic-plans/${id}`, basicPlanUpdateDTO);
  return response.data;
};

export const deleteBasicPlan = async (id) => {
  await axiosInstance.delete(`/api/basic-plans/${id}`);
  return true;
};

// Plan API Functions
export const getAllPlans = async () => {
  const response = await axiosInstance.get('/api/plans');
  return response.data;
};

export const getPlanById = async (id) => {
  const response = await axiosInstance.get(`/api/plans/${id}`);
  return response.data;
};

export const createPlan = async (planData) => {
  const planCreateDTO = {
    basicPlanId: planData.basicPlanId,
    price: parseFloat(planData.price),
    durationInMonths: parseInt(planData.durationInMonths)
  };
  
  const response = await axiosInstance.post('/api/plans', planCreateDTO);
  return response.data;
};

export const updatePlan = async (id, planData) => {
  const planUpdateDTO = {
    basicPlanId: planData.basicPlanId,
    price: parseFloat(planData.price),
    durationInMonths: parseInt(planData.durationInMonths)
  };
  
  const response = await axiosInstance.put(`/api/plans/${id}`, planUpdateDTO);
  return response.data;
};

export const deletePlan = async (id) => {
  await axiosInstance.delete(`/api/plans/${id}`);
  return true;
};

export const getPlanByName = async (name) => {
  const response = await axiosInstance.get(`/api/plans/name/${name}`);
  return response.data;
};

export const getPlanByNameAndDuration = async (name, durationInMonths) => {
  const response = await axiosInstance.get(`/api/plans/name/${name}/duration/${durationInMonths}`);
  return response.data;
}; 