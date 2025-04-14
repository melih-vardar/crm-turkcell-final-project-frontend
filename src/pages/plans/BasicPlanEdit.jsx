import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { getBasicPlanById, updateBasicPlan } from '../../api/plans';

const BasicPlanEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    planType: '',
    features: []
  });
  
  const [newFeature, setNewFeature] = useState('');
  
  const { data: basicPlan, isLoading, error } = useQuery(['basicPlan', id], () => getBasicPlanById(id), {
    onSuccess: (data) => {
      setFormData({
        name: data.name || '',
        description: data.description || '',
        planType: data.planType || '',
        features: data.features || []
      });
    }
  });
  
  const updateMutation = useMutation(
    (updatedPlan) => updateBasicPlan(id, updatedPlan),
    {
      onSuccess: () => {
        toast.success('Temel plan başarıyla güncellendi');
        queryClient.invalidateQueries(['basicPlan', id]);
        queryClient.invalidateQueries('basicPlans');
        navigate(`/plans/basic/${id}`);
      },
      onError: (error) => {
        toast.error(`Güncelleme hatası: ${error.message}`);
      }
    }
  );
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };
  
  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({ ...formData, features: updatedFeatures });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Temel plan yükleniyor...</div>;
  }
  
  if (error || !basicPlan) {
    return <div className="text-red-500">Temel plan yüklenirken hata oluştu</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          onClick={() => navigate(`/plans/basic/${id}`)} 
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <AiOutlineArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Temel Planı Düzenle</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label" htmlFor="planType">
                Plan Türü <span className="text-red-500">*</span>
              </label>
              <select
                id="planType"
                name="planType"
                value={formData.planType}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seçiniz</option>
                <option value="MOBILE">Mobil</option>
                <option value="INTERNET">İnternet</option>
                <option value="TV_PACKAGE">TV Paketi</option>
                <option value="COMBO">Combo</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="form-label" htmlFor="description">
                Açıklama
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                rows="3"
              />
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Plan Özellikleri</h2>
          
          <div className="flex mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="form-input flex-grow"
              placeholder="Yeni özellik ekle"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="btn btn-primary ml-2"
            >
              Ekle
            </button>
          </div>
          
          {formData.features.length > 0 ? (
            <ul className="space-y-2">
              {formData.features.map((feature, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Henüz özellik eklenmemiş</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/plans/basic/${id}`)}
            className="btn btn-outline-secondary"
          >
            İptal
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicPlanEdit; 