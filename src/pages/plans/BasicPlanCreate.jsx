import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { createBasicPlan } from '../../api/plans';

const BasicPlanCreate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      name: '',
      planType: '',
      description: ''
    }
  });

  const createMutation = useMutation(createBasicPlan, {
    onSuccess: () => {
      navigate('/plans');
    },
    onError: (err) => {
      console.error('Temel plan oluşturulurken hata:', err);
      setError(err.response?.data?.message || 'Temel plan oluşturulamadı');
    }
  });

  const onSubmit = (data) => {
    setError('');
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/plans" className="text-gray-500 hover:text-gray-700">
            <AiOutlineArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Yeni Temel Plan Oluştur</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="text-red-700">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Temel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label" htmlFor="name">
                Plan Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                className="form-input w-full"
                {...register("name", { 
                  required: "Plan adı boş olamaz", 
                  minLength: { 
                    value: 2, 
                    message: "Plan adı en az 2 karakter olmalıdır" 
                  },
                  maxLength: { 
                    value: 100, 
                    message: "Plan adı en fazla 100 karakter olabilir" 
                  }
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="form-label" htmlFor="planType">
                Plan Türü <span className="text-red-500">*</span>
              </label>
              <select
                id="planType"
                className="form-select w-full"
                {...register("planType", { 
                  required: "Plan türü seçilmelidir" 
                })}
              >
                <option value="">Seçiniz</option>
                <option value="MOBILE">Mobil</option>
                <option value="INTERNET">İnternet</option>
                <option value="TV">TV</option>
                <option value="LANDLINE">Sabit Hat</option>
              </select>
              {errors.planType && (
                <p className="text-red-500 text-sm mt-1">{errors.planType.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="form-label" htmlFor="description">
                Açıklama <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                className="form-textarea w-full"
                rows="3"
                {...register("description", { 
                  required: "Açıklama boş olamaz", 
                  minLength: { 
                    value: 10, 
                    message: "Açıklama en az 10 karakter olmalıdır" 
                  },
                  maxLength: { 
                    value: 500, 
                    message: "Açıklama en fazla 500 karakter olabilir" 
                  }
                })}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/plans')}
            className="btn btn-secondary"
            disabled={isSubmitting || createMutation.isLoading}
          >
            İptal
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || createMutation.isLoading}
          >
            {createMutation.isLoading ? 'Oluşturuluyor...' : 'Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicPlanCreate; 