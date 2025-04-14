import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { createPlan, getPlanById, updatePlan, getBasicPlans, getBasicPlanById } from '../../api/plans';

const PlanForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = !!id;
  
  // URLden basicPlanId'yi alın (örneğin ?basicPlanId=123)
  const queryParams = new URLSearchParams(location.search);
  const initialBasicPlanId = queryParams.get('basicPlanId');
  
  const [error, setError] = useState('');
  const [selectedBasicPlan, setSelectedBasicPlan] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      basicPlanId: initialBasicPlanId || '',
      price: '',
      durationInMonths: '1',
    }
  });
  
  const watchedBasicPlanId = watch('basicPlanId');
  
  // Temel planları getir
  const { 
    data: basicPlans = [], 
    isLoading: isBasicPlansLoading 
  } = useQuery('basicPlans', getBasicPlans, {
    onError: (err) => {
      console.error('Temel planlar yüklenirken hata oluştu:', err);
      setError('Temel planlar yüklenemedi');
    }
  });
  
  // Seçilen temel planı getir
  const { 
    data: basicPlanDetails, 
    isLoading: isBasicPlanDetailsLoading 
  } = useQuery(
    ['basicPlan', watchedBasicPlanId],
    () => getBasicPlanById(watchedBasicPlanId),
    {
      enabled: !!watchedBasicPlanId,
      onSuccess: (data) => {
        setSelectedBasicPlan(data);
      },
      onError: (err) => {
        console.error('Temel plan detayları yüklenirken hata oluştu:', err);
      }
    }
  );
  
  // Düzenleme modu için planı getir
  const { data: plan, isLoading: isPlanLoading } = useQuery(
    ['plan', id],
    () => getPlanById(id),
    {
      enabled: isEdit,
      onError: (err) => {
        setError('Plan yüklenemedi');
        console.error(err);
      },
      onSuccess: (data) => {
        if (data) {
          setValue('basicPlanId', data.basicPlan?.id || '');
          setValue('price', data.price);
          setValue('durationInMonths', data.durationInMonths);
          setSelectedBasicPlan(data.basicPlan);
        }
      }
    }
  );
  
  const onSubmit = async (data) => {
    setError('');
    
    try {
      const planData = {
        basicPlanId: data.basicPlanId,
        price: parseFloat(data.price),
        durationInMonths: parseInt(data.durationInMonths)
      };
      
      if (isEdit) {
        await updatePlan(id, planData);
      } else {
        await createPlan(planData);
      }
      navigate('/plans');
    } catch (err) {
      setError(err.response?.data?.message || 'Plan kaydedilemedi');
      console.error(err);
    }
  };
  
  if ((isEdit && isPlanLoading) || isBasicPlansLoading) {
    return <div className="flex items-center justify-center h-64">Veriler yükleniyor...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Planı Düzenle' : 'Yeni Plan Oluştur'}
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="text-red-700">{error}</div>
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="basicPlanId" className="block text-sm font-medium text-gray-700">
              Temel Plan <span className="text-red-500">*</span>
            </label>
            <select
              id="basicPlanId"
              className="form-select w-full mt-1"
              {...register("basicPlanId", { 
                required: "Temel plan seçilmelidir" 
              })}
              disabled={isEdit}
            >
              <option value="">Temel Plan Seçin</option>
              {basicPlans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - {plan.planType}
                </option>
              ))}
            </select>
            {errors.basicPlanId && (
              <p className="text-red-500 text-sm mt-1">{errors.basicPlanId.message}</p>
            )}
          </div>
          
          {selectedBasicPlan && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-700 mb-2">Seçilen Temel Plan Detayları</h3>
              <p><strong>Ad:</strong> {selectedBasicPlan.name}</p>
              <p><strong>Tür:</strong> {selectedBasicPlan.planType}</p>
              <p><strong>Açıklama:</strong> {selectedBasicPlan.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Fiyat <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₺</span>
                </div>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  className="form-input pl-7 w-full"
                  {...register("price", { 
                    required: "Fiyat zorunludur",
                    min: { 
                      value: 0.01, 
                      message: "Fiyat 0'dan büyük olmalıdır" 
                    },
                    max: { 
                      value: 10000, 
                      message: "Fiyat en fazla 10.000 TL olabilir" 
                    },
                    validate: value => parseFloat(value) > 0 || "Fiyat 0'dan büyük olmalıdır"
                  })}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="durationInMonths" className="block text-sm font-medium text-gray-700">
                Süre (Ay) <span className="text-red-500">*</span>
              </label>
              <select
                id="durationInMonths"
                className="form-select w-full mt-1"
                {...register("durationInMonths", { 
                  required: "Süre seçilmelidir",
                  min: {
                    value: 1,
                    message: "Süre en az 1 ay olmalıdır"
                  },
                  max: {
                    value: 24,
                    message: "Süre en fazla 24 ay olabilir"
                  }
                })}
              >
                <option value="1">1 Ay</option>
                <option value="3">3 Ay</option>
                <option value="6">6 Ay</option>
                <option value="12">12 Ay</option>
                <option value="24">24 Ay</option>
              </select>
              {errors.durationInMonths && (
                <p className="text-red-500 text-sm mt-1">{errors.durationInMonths.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/plans')}
              className="btn bg-white border border-gray-300 text-gray-700"
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanForm; 