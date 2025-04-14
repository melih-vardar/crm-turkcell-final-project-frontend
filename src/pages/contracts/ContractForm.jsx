import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AiOutlineArrowLeft, AiOutlineCalendar } from 'react-icons/ai';
import { createContract, getContractById, updateContract, testContractEndpoint } from '../../api/contracts';
import { getAllCustomers } from '../../api/customers';
import { getAllPlans } from '../../api/plans';

const ContractForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [error, setError] = useState('');
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    reset,
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      customerId: '',
      planId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    }
  });
  
  // Watch selected plan and dates
  const watchedPlanId = watch('planId');
  const watchedCustomerId = watch('customerId');
  const watchedStartDate = watch('startDate');
  
  // Create contract mutation
  const createMutation = useMutation(createContract, {
    onSuccess: () => {
      navigate('/contracts');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Sözleşme oluşturulamadı');
      console.error('Sözleşme oluşturma hatası:', err);
    }
  });
  
  // Update contract mutation
  const updateMutation = useMutation(
    (data) => updateContract(id, data),
    {
      onSuccess: () => {
        navigate('/contracts');
      },
      onError: (err) => {
        setError(err.response?.data?.message || 'Sözleşme güncellenemedi');
        console.error('Sözleşme güncelleme hatası:', err);
      }
    }
  );
  
  // Fetch contract data for edit mode
  const { isLoading: contractLoading } = useQuery(
    ['contract', id],
    () => getContractById(id),
    {
      enabled: isEdit,
      onError: (err) => {
        setError('Sözleşme bilgileri yüklenirken hata oluştu');
        console.error(err);
      },
      onSuccess: (data) => {
        // Format dates for the form
        const formattedData = {
          customerId: data.customer?.id || '',
          planId: data.plan?.id || '',
          startDate: data.startDate ? data.startDate : '',
          endDate: data.endDate ? data.endDate : ''
        };
        reset(formattedData);
        setSelectedPlanDetails(data.plan);
      }
    }
  );
  
  // Fetch customers for dropdown
  const { data: customers = [], isLoading: customersLoading } = useQuery('customers', getAllCustomers, {
    onError: (err) => {
      setError('Müşteri listesi yüklenirken hata oluştu');
      console.error(err);
    }
  });
  
  // Fetch plans for dropdown
  const { data: plans = [], isLoading: plansLoading } = useQuery('plans', getAllPlans, {
    onError: (err) => {
      setError('Plan listesi yüklenirken hata oluştu');
      console.error(err);
    }
  });
  
  // Update selected plan when watchedPlanId changes
  useEffect(() => {
    if (watchedPlanId && plans.length > 0) {
      const plan = plans.find(p => p.id === watchedPlanId);
      if (plan) {
        console.log('Seçilen plan detayları:', plan);
        setSelectedPlanDetails(plan);
        
        // Plan seçildiğinde otomatik olarak bitiş tarihini hesapla
        if (watchedStartDate) {
          const startDate = new Date(watchedStartDate);
          const durationMonths = plan.durationInMonths || 1;
          
          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + durationMonths);
          
          // Format date to yyyy-mm-dd
          const formattedEndDate = endDate.toISOString().split('T')[0];
          setValue('endDate', formattedEndDate);
        }
      }
    }
  }, [watchedPlanId, plans, watchedStartDate, setValue]);
  
  // Update end date when start date changes (if a plan is selected)
  useEffect(() => {
    if (selectedPlanDetails && watchedStartDate) {
      const startDate = new Date(watchedStartDate);
      const durationMonths = selectedPlanDetails.durationInMonths || 1;
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + durationMonths);
      
      // Format date to yyyy-mm-dd
      const formattedEndDate = endDate.toISOString().split('T')[0];
      setValue('endDate', formattedEndDate);
    }
  }, [watchedStartDate, selectedPlanDetails, setValue]);
  
  // Get selected customer details
  const selectedCustomer = customers.find(customer => customer.id === watchedCustomerId);
  
  const onSubmit = async (data) => {
    setError('');
    
    try {
      // Eğer selectedPlanDetails yoksa hata göster
      if (!selectedPlanDetails) {
        setError('Lütfen geçerli bir plan seçin');
        return;
      }
      
      // Plan adını al
      const planName = selectedPlanDetails.name || 
                       selectedPlanDetails.basicPlan?.name || 
                       "Plan";

      console.log('Form data:', data);
      console.log('Selected plan details:', selectedPlanDetails);
      console.log('Plan ID from form:', data.planId);
      console.log('Plan ID from selected plan:', selectedPlanDetails.id);
      
      // ContractCreateDTO yapısına uygun veri oluştur
      const contractData = {
        customerId: data.customerId,
        planId: data.planId,
        startDate: data.startDate,
        endDate: data.endDate,
        planName: selectedPlanDetails.basicPlan ? selectedPlanDetails.basicPlan.name : selectedPlanDetails.premiumPlan.name
      };
      
      console.log('Gönderilen sözleşme verisi:', contractData);
      
      if (isEdit) {
        await updateMutation.mutateAsync(contractData);
      } else {
        await createMutation.mutateAsync(contractData);
      }
    } catch (err) {
      // Hata zaten mutation içinde işleniyor
      console.error(err);
    }
  };
  
  const handleTestEndpoint = async () => {
    try {
      const response = await testContractEndpoint();
      console.log('Test endpoint başarılı:', response);
    } catch (error) {
      console.error('Test endpoint hatası:', error);
      setError('Test endpoint hatası: ' + error.message);
    }
  };
  
  const isLoading = contractLoading || customersLoading || plansLoading || 
                   createMutation.isLoading || updateMutation.isLoading;
  
  if (isEdit && contractLoading) {
    return <div className="flex items-center justify-center h-64">Sözleşme bilgileri yükleniyor...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/contracts" className="text-gray-500 hover:text-gray-700">
            <AiOutlineArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Sözleşme Düzenle' : 'Yeni Sözleşme Oluştur'}
          </h1>
        </div>
        <button
          onClick={handleTestEndpoint}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Test Endpoint
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="text-red-700">{error}</div>
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Müşteri Seçimi */}
          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
              Müşteri <span className="text-red-500">*</span>
            </label>
            <select
              id="customerId"
              className="form-select w-full mt-1"
              {...register("customerId", { 
                required: "Müşteri seçimi zorunludur" 
              })}
              disabled={isEdit || isLoading}
            >
              <option value="">Müşteri Seçin</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName} - {customer.email}
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="text-red-500 text-sm mt-1">{errors.customerId.message}</p>
            )}
            
            {selectedCustomer && (
              <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Telefon:</strong> {selectedCustomer.phone}</p>
              </div>
            )}
          </div>
          
          {/* Plan Seçimi */}
          <div>
            <label htmlFor="planId" className="block text-sm font-medium text-gray-700">
              Plan <span className="text-red-500">*</span>
            </label>
            <select
              id="planId"
              className="form-select w-full mt-1"
              {...register("planId", { 
                required: "Plan seçimi zorunludur" 
              })}
              disabled={isLoading}
            >
              <option value="">Plan Seçin</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name || plan.basicPlan?.name} - {plan.price}₺/{plan.durationInMonths} ay
                </option>
              ))}
            </select>
            {errors.planId && (
              <p className="text-red-500 text-sm mt-1">{errors.planId.message}</p>
            )}
            
            {selectedPlanDetails && (
              <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
                <p><strong>Plan Adı:</strong> {selectedPlanDetails.name || selectedPlanDetails.basicPlan?.name}</p>
                <p><strong>Fiyat:</strong> {selectedPlanDetails.price}₺</p>
                <p><strong>Süre:</strong> {selectedPlanDetails.durationInMonths} ay</p>
                <p><strong>Açıklama:</strong> {selectedPlanDetails.description || selectedPlanDetails.basicPlan?.description}</p>
              </div>
            )}
          </div>
          
          {/* Tarih Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Başlangıç Tarihi <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="startDate"
                  className="form-input pl-10 w-full"
                  {...register("startDate", { 
                    required: "Başlangıç tarihi zorunludur",
                    pattern: {
                      value: /^\d{4}-\d{2}-\d{2}$/,
                      message: "Tarih formatı YYYY-AA-GG şeklinde olmalıdır"
                    }
                  })}
                  disabled={isLoading}
                />
              </div>
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                Bitiş Tarihi <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  className="form-input pl-10 w-full"
                  {...register("endDate", { 
                    required: "Bitiş tarihi zorunludur",
                    pattern: {
                      value: /^\d{4}-\d{2}-\d{2}$/,
                      message: "Tarih formatı YYYY-AA-GG şeklinde olmalıdır"
                    }
                  })}
                  disabled={isLoading}
                />
              </div>
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>
          
          {/* Form Düğmeleri */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/contracts')}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'İşlem yapılıyor...' : isEdit ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractForm; 