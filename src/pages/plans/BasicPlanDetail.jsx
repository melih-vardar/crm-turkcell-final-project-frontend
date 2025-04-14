import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft } from 'react-icons/ai';
import { getBasicPlanById, deleteBasicPlan } from '../../api/plans';

const BasicPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { data: basicPlan, isLoading, error } = useQuery(['basicPlan', id], () => getBasicPlanById(id));
  
  const handleDelete = async () => {
    try {
      await deleteBasicPlan(id);
      navigate('/plans');
    } catch (err) {
      console.error('Failed to delete basic plan:', err);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };
  
  const getPlanTypeBadge = (planType) => {
    const typeMap = {
      MOBILE: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Mobil' },
      INTERNET: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'İnternet' },
      TV_PACKAGE: { bg: 'bg-red-100', text: 'text-red-800', label: 'TV Paketi' },
      COMBO: { bg: 'bg-green-100', text: 'text-green-800', label: 'Combo' }
    };
    
    const { bg, text, label } = typeMap[planType] || { bg: 'bg-gray-100', text: 'text-gray-800', label: planType };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Temel plan yükleniyor...</div>;
  }
  
  if (error || !basicPlan) {
    return <div className="text-red-500">Temel plan yüklenirken hata oluştu</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/plans" className="text-gray-500 hover:text-gray-700">
            <AiOutlineArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{basicPlan.name}</h1>
          {getPlanTypeBadge(basicPlan.planType)}
        </div>
        <div className="flex space-x-2">
          <Link to={`/plans/basic/${id}/edit`} className="btn btn-outline-primary flex items-center">
            <AiOutlineEdit className="mr-2" />
            Düzenle
          </Link>
          <button 
            onClick={() => setIsDeleteModalOpen(true)} 
            className="btn btn-outline-danger flex items-center"
          >
            <AiOutlineDelete className="mr-2" />
            Sil
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Temel Plan Bilgileri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">ID</label>
              <div className="mt-1 text-sm">{basicPlan.id}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">İsim</label>
              <div className="mt-1 text-sm">{basicPlan.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Açıklama</label>
              <div className="mt-1 text-sm">{basicPlan.description}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Plan Türü</label>
              <div className="mt-1 text-sm">{getPlanTypeBadge(basicPlan.planType)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Oluşturulma Tarihi</label>
              <div className="mt-1 text-sm">
                {new Date(basicPlan.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Özellikler</h2>
          {basicPlan.features && basicPlan.features.length > 0 ? (
            <ul className="space-y-2">
              {basicPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-2 text-xs">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Bu temel planın özellikleri bulunmamaktadır.</p>
          )}
          
          <div className="mt-6">
            <Link to={`/plans/add?basicPlanId=${basicPlan.id}`} className="btn btn-primary w-full">
              Bu Temel Plandan Yeni Aktif Plan Oluştur
            </Link>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Planı Sil</h3>
            <p className="text-sm text-gray-500 mb-4">
              Bu temel planı silmek üzeresiniz. Bu işlem geri alınamaz. 
              Bu temel plana bağlı tüm aktif planlar da silinecektir. Devam etmek istiyor musunuz?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline-secondary"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicPlanDetail; 