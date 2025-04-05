import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';
import { createPlan, getPlanById, updatePlan } from '../../api/plans';

const PlanForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      duration: 'Monthly',
      features: [{ text: '' }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features'
  });
  
  const { data: plan, isLoading } = useQuery(
    ['plan', id],
    () => getPlanById(id),
    {
      enabled: isEdit,
      onError: (err) => {
        setError('Failed to load plan data');
        console.error(err);
      },
      onSuccess: (data) => {
        // Mevcut özellikleri doğru formatta ayarla
        const formattedFeatures = data.features?.map(feature => ({ text: feature })) || [{ text: '' }];
        reset({
          ...data,
          features: formattedFeatures
        });
      }
    }
  );
  
  const onSubmit = async (data) => {
    setError('');
    setIsSubmitting(true);
    
    // Özellik dizisini düzenle (boş değerleri filtrele ve format değiştir)
    const formattedFeatures = data.features
      .filter(feature => feature.text.trim() !== '')
      .map(feature => feature.text.trim());
    
    // Plan verilerini hazırla
    const planData = {
      ...data,
      price: parseFloat(data.price),
      features: formattedFeatures
    };
    
    try {
      if (isEdit) {
        await updatePlan(id, planData);
      } else {
        await createPlan(planData);
      }
      navigate('/plans');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save plan');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isEdit && isLoading) {
    return <div className="flex items-center justify-center h-64">Loading plan data...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Edit Plan' : 'Add New Plan'}
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="text-red-700">{error}</div>
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Plan Name
              </label>
              <input
                id="name"
                type="text"
                className="input w-full mt-1"
                {...register("name", { required: "Plan name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  className="input pl-7 w-full"
                  {...register("price", { 
                    required: "Price is required",
                    min: { value: 0, message: "Price cannot be negative" },
                    pattern: { 
                      value: /^\d+(\.\d{1,2})?$/, 
                      message: "Please enter a valid price" 
                    } 
                  })}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <select
              id="duration"
              className="input w-full mt-1"
              {...register("duration", { required: "Duration is required" })}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Semi-Annual">Semi-Annual</option>
              <option value="Yearly">Yearly</option>
            </select>
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="input w-full mt-1"
              {...register("description", { 
                required: "Description is required" 
              })}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Features
              </label>
              <button
                type="button"
                onClick={() => append({ text: '' })}
                className="text-primary hover:text-primary-dark flex items-center text-sm"
              >
                <AiOutlinePlus className="mr-1" />
                Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center">
                  <input
                    type="text"
                    className="input w-full"
                    placeholder={`Feature ${index + 1}`}
                    {...register(`features.${index}.text`)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">Add the features that are included in this plan</p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/plans')}
              className="btn bg-white border border-gray-300 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Plan' : 'Add Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanForm; 