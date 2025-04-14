import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft, AiOutlineMail, AiOutlinePhone, AiOutlineFileText, AiOutlineCalendar } from 'react-icons/ai';
import { getContractById, deleteContract } from '../../api/contracts';
import { getCustomerById } from '../../api/customers';
import { getPlanById } from '../../api/plans';

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  // Fetch contract details
  const { data: contract, isLoading: contractLoading, error: contractError } = useQuery(
    ['contract', id],
    () => getContractById(id),
    {
      // Mock data for development
      initialData: {
        id: '1',
        customerId: '1',
        planId: '1',
        startDate: '2023-01-15',
        endDate: '2024-01-15',
        status: 'ACTIVE',
        notes: 'Bu müşteri premium plan için 12 aylık sözleşme imzaladı. İndirimli fiyat uygulandı.',
        paymentMethod: 'Kredi Kartı',
        autoRenewal: true,
        contractNumber: 'CT-2023-0001'
      },
      onError: (err) => {
        setError('Sözleşme bilgileri yüklenirken hata oluştu');
        console.error(err);
      }
    }
  );
  
  // Fetch customer details
  const { data: customer, isLoading: customerLoading } = useQuery(
    ['customer', contract?.customerId],
    () => getCustomerById(contract?.customerId),
    {
      enabled: !!contract?.customerId,
      // Mock data for development
      initialData: {
        id: '1',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        phone: '+90 555 123 4567',
        address: 'Atatürk Cad. No:123 Ankara'
      }
    }
  );
  
  // Fetch plan details
  const { data: plan, isLoading: planLoading } = useQuery(
    ['plan', contract?.planId],
    () => getPlanById(contract?.planId),
    {
      enabled: !!contract?.planId,
      // Mock data for development
      initialData: {
        id: '1',
        name: 'Premium Plan',
        description: 'Tüm özellikleri içeren premium paket',
        price: 199.99,
        duration: 'Monthly',
        features: ['Sınırsız konuşma', 'Sınırsız internet', '5 ek hat', 'Uluslararası dolaşım']
      }
    }
  );
  
  const handleDeleteContract = async () => {
    if (window.confirm('Bu sözleşmeyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteContract(id);
        navigate('/contracts');
      } catch (err) {
        setError('Sözleşme silinemedi');
        console.error(err);
      }
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };
  
  const formatPrice = (price) => {
    if (!price) return '₺0.00';
    return `₺${Number(price).toFixed(2)}`;
  };
  
  const getStatusBadge = (status) => {
    const statusMap = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aktif' },
      TERMINATED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Feshedilmiş' },
      SUSPENDED: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Askıda' },
      EXPIRED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Süresi Dolmuş' },
      PENDING: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Beklemede' }
    };
    
    const { bg, text, label } = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };
  
  if (contractLoading || customerLoading || planLoading) {
    return <div className="flex items-center justify-center h-64">Sözleşme bilgileri yükleniyor...</div>;
  }
  
  if (error || contractError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="text-red-700">{error || contractError.message}</div>
        </div>
        <Link to="/contracts" className="btn bg-white border border-gray-300 text-gray-700 flex items-center">
          <AiOutlineArrowLeft className="mr-2" />
          Sözleşmelere Dön
        </Link>
      </div>
    );
  }
  
  if (!contract) {
    return <div className="text-center">Sözleşme bulunamadı</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Sözleşme Detayları - {contract.contractNumber}
        </h1>
        <div className="flex space-x-2">
          <Link to={`/contracts/${id}/edit`} className="btn btn-secondary flex items-center">
            <AiOutlineEdit className="mr-2" />
            Düzenle
          </Link>
          <button onClick={handleDeleteContract} className="btn btn-danger flex items-center">
            <AiOutlineDelete className="mr-2" />
            Sil
          </button>
        </div>
      </div>
      
      <Link to="/contracts" className="btn bg-white border border-gray-300 text-gray-700 flex items-center inline-flex">
        <AiOutlineArrowLeft className="mr-2" />
        Sözleşmelere Dön
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sözleşme Bilgileri */}
        <div className="card md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <AiOutlineFileText className="mr-2 text-primary" />
            Sözleşme Bilgileri
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Durum</h3>
                <div className="mt-1">{getStatusBadge(contract.status)}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sözleşme Numarası</h3>
                <p className="mt-1 text-gray-900">{contract.contractNumber}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Başlangıç Tarihi</h3>
                <div className="mt-1 text-gray-900 flex items-center">
                  <AiOutlineCalendar className="mr-1 text-primary" />
                  {formatDate(contract.startDate)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Bitiş Tarihi</h3>
                <div className="mt-1 text-gray-900 flex items-center">
                  <AiOutlineCalendar className="mr-1 text-primary" />
                  {formatDate(contract.endDate)}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ödeme Yöntemi</h3>
                <p className="mt-1 text-gray-900">{contract.paymentMethod}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Otomatik Yenileme</h3>
                <p className="mt-1 text-gray-900">{contract.autoRenewal ? 'Evet' : 'Hayır'}</p>
              </div>
            </div>
            
            {contract.notes && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-500">Notlar</h3>
                <p className="mt-1 text-gray-900 whitespace-pre-line">{contract.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Müşteri Bilgileri */}
        <div className="card h-min">
          <h2 className="text-lg font-semibold mb-4">Müşteri Bilgileri</h2>
          
          {customer && (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                  <span className="font-bold">{customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-medium text-gray-900">{customer.firstName} {customer.lastName}</h3>
                  <Link to={`/customers/${customer.id}`} className="text-primary text-sm">Müşteri Detayı</Link>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center text-gray-900 mb-2">
                  <AiOutlineMail className="mr-2 text-gray-400" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center text-gray-900">
                  <AiOutlinePhone className="mr-2 text-gray-400" />
                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Plan Detayları */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <AiOutlineFileText className="mr-2 text-primary" />
          Plan Detayları
        </h2>
        
        {plan && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-base font-medium text-gray-900">{plan.name}</h3>
              <p className="text-xl font-bold text-primary mt-2">{formatPrice(plan.price)} <span className="text-sm font-normal text-gray-500">/ {plan.duration}</span></p>
              <Link to={`/plans/${plan.id}`} className="btn btn-outline-primary mt-4 w-full">Plan Detayları</Link>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Açıklama</h3>
              <p className="text-gray-900 mb-4">{plan.description}</p>
              
              <h3 className="text-sm font-medium text-gray-500 mb-2">Özellikler</h3>
              <ul className="space-y-1">
                {plan.features?.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="flex-shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="ml-2 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Fatura Geçmişi */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Fatura Geçmişi</h2>
          <Link to={`/customers/${customer?.id}/bills`} className="text-primary text-sm">Tümünü Görüntüle</Link>
        </div>
        
        <div className="text-center text-gray-500 py-8">
          Henüz fatura bilgisi bulunmamaktadır
        </div>
      </div>
    </div>
  );
};

export default ContractDetail; 