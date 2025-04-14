import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { createBill } from '../../api/billing';
import { getAllCustomers, getCustomerContracts } from '../../api/customers';

const BillCreate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      customerId: '',
      contractId: '',
    }
  });
  
  const watchedCustomerId = watch('customerId');
  
  // Fetch customers for dropdown
  const { data: customers, isLoading: customersLoading } = useQuery('customers', getAllCustomers, {
    onError: (err) => {
      setError('Müşteri listesi yüklenirken hata oluştu');
      console.error(err);
    }
  });
  
  // Fetch contracts for selected customer
  const { data: contracts, isLoading: contractsLoading } = useQuery(
    ['contracts', watchedCustomerId],
    () => getCustomerContracts(watchedCustomerId),
    {
      enabled: !!watchedCustomerId,
      onError: (err) => {
        setError('Sözleşme listesi yüklenirken hata oluştu');
        console.error(err);
      }
    }
  );
  
  const onSubmit = async (data) => {
    setError('');
    setIsSubmitting(true);
    
    try {
      await createBill(data.customerId, data.contractId);
      navigate('/bills');
    } catch (err) {
      setError(err.response?.data?.message || 'Fatura oluşturulurken hata oluştu');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Yeni Fatura Oluştur</h1>
        <button
          onClick={() => navigate('/bills')}
          className="btn btn-ghost flex items-center"
        >
          <AiOutlineArrowLeft className="mr-2" /> Geri Dön
        </button>
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
              <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                Müşteri
              </label>
              <select
                id="customerId"
                className="input w-full mt-1"
                {...register("customerId", { required: "Müşteri seçimi zorunludur" })}
                disabled={customersLoading || isSubmitting}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option value="">Müşteri Seçin</option>
                {customers?.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-red-500 text-sm mt-1">{errors.customerId.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contractId" className="block text-sm font-medium text-gray-700">
                Sözleşme
              </label>
              <select
                id="contractId"
                className="input w-full mt-1"
                {...register("contractId", { required: "Sözleşme seçimi zorunludur" })}
                disabled={!watchedCustomerId || contractsLoading || isSubmitting}
              >
                <option value="">Sözleşme Seçin</option>
                {contracts?.map(contract => (
                  <option key={contract.id} value={contract.id}>
                    {contract.contractNumber || `Sözleşme #${contract.id}`} - {contract.plan?.name || 'Plan bilgisi yok'}
                  </option>
                ))}
              </select>
              {errors.contractId && (
                <p className="text-red-500 text-sm mt-1">{errors.contractId.message}</p>
              )}
              
              {!watchedCustomerId && (
                <p className="text-gray-500 text-sm mt-1">Lütfen önce müşteri seçin</p>
              )}
              
              {watchedCustomerId && contracts?.length === 0 && (
                <p className="text-amber-500 text-sm mt-1">Bu müşteriye ait sözleşme bulunamadı</p>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500 mb-4">
              Fatura bilgileri, seçilen sözleşmeye göre otomatik olarak oluşturulacaktır.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/bills')}
                disabled={isSubmitting}
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Oluşturuluyor...' : 'Fatura Oluştur'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillCreate; 