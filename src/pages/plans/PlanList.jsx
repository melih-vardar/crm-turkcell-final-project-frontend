import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { AiOutlinePlus, AiOutlineSearch, AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { getAllPlans, deletePlan, getBasicPlans, deleteBasicPlan } from '../../api/plans';

const PlanList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('active'); // 'active' or 'basic'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Fetch active plans
  const { 
    data: plans = [], 
    isLoading: plansLoading, 
    error: plansError, 
    refetch: refetchPlans 
  } = useQuery('plans', getAllPlans, {
    onError: (err) => {
      console.error('Plan yüklenirken hata oluştu:', err);
    }
  });
  
  // Fetch basic plans
  const { 
    data: basicPlans = [], 
    isLoading: basicPlansLoading, 
    error: basicPlansError, 
    refetch: refetchBasicPlans 
  } = useQuery('basicPlans', getBasicPlans, {
    onError: (err) => {
      console.error('Temel plan yüklenirken hata oluştu:', err);
    }
  });
  
  // Filter plans based on search term
  const filteredPlans = plans?.filter(plan => 
    plan.basicPlan?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.basicPlan?.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.basicPlan?.planType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.price.toString().includes(searchTerm) ||
    plan.durationInMonths.toString().includes(searchTerm)
  ) || [];
  
  // Filter basic plans based on search term
  const filteredBasicPlans = basicPlans?.filter(basicPlan => 
    basicPlan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    basicPlan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    basicPlan.planType.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Calculate pagination for active plans
  const activePlansList = filteredPlans;
  const indexOfLastActivePlan = currentPage * itemsPerPage;
  const indexOfFirstActivePlan = indexOfLastActivePlan - itemsPerPage;
  const currentActivePlans = activePlansList.slice(indexOfFirstActivePlan, indexOfLastActivePlan);
  const totalActivePagesCount = Math.ceil(activePlansList.length / itemsPerPage);
  
  // Calculate pagination for basic plans
  const basicPlansList = filteredBasicPlans;
  const indexOfLastBasicPlan = currentPage * itemsPerPage;
  const indexOfFirstBasicPlan = indexOfLastBasicPlan - itemsPerPage;
  const currentBasicPlans = basicPlansList.slice(indexOfFirstBasicPlan, indexOfLastBasicPlan);
  const totalBasicPagesCount = Math.ceil(basicPlansList.length / itemsPerPage);
  
  const handleDeletePlan = async (id) => {
    console.log("Silinecek plan ID:", id);
    if (window.confirm('Bu planı silmek istediğinizden emin misiniz?')) {
      try {
        await deletePlan(id);
        refetchPlans();
      } catch (err) {
        console.error('Failed to delete plan:', err);
      }
    }
  };
  
  const handleDeleteBasicPlan = async (id) => {
    if (window.confirm('Bu temel planı silmek istediğinizden emin misiniz? Bu plan türüne bağlı tüm aktif planlar da silinecektir.')) {
      try {
        await deleteBasicPlan(id);
        refetchBasicPlans();
        refetchPlans(); // Aktif planları da yenile, çünkü silinen temel plana bağlı olanlar da silinmiş olabilir
      } catch (err) {
        console.error('Failed to delete basic plan:', err);
      }
    }
  };
  
  const formatPrice = (price) => {
    return `₺${price.toFixed(2)}`;
  };
  
  const formatDuration = (months) => {
    if (months === 1) return '1 Ay';
    if (months === 12) return '1 Yıl';
    if (months === 24) return '2 Yıl';
    return `${months} Ay`;
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
  
  if ((currentTab === 'active' && plansLoading) || (currentTab === 'basic' && basicPlansLoading)) {
    return <div className="flex items-center justify-center h-64">Planlar yükleniyor...</div>;
  }
  
  if ((currentTab === 'active' && plansError) || (currentTab === 'basic' && basicPlansError)) {
    return <div className="text-red-500">Planlar yüklenirken hata oluştu</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Plan Yönetimi</h1>
        <div className="space-x-2">
          {currentTab === 'basic' ? (
            <Link to="/plans/basic/add" className="btn btn-primary flex items-center">
              <AiOutlinePlus className="mr-2" />
              Yeni Temel Plan
            </Link>
          ) : (
            <Link to="/plans/add" className="btn btn-primary flex items-center">
              <AiOutlinePlus className="mr-2" />
              Yeni Aktif Plan
            </Link>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4">
          <button
            onClick={() => {
              setCurrentTab('active');
              setCurrentPage(1);
            }}
            className={`${
              currentTab === 'active'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
          >
            Aktif Planlar
          </button>
          <button
            onClick={() => {
              setCurrentTab('basic');
              setCurrentPage(1);
            }}
            className={`${
              currentTab === 'basic'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
          >
            Temel Planlar
          </button>
        </nav>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AiOutlineSearch className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          className="input pl-10 w-full"
          placeholder={currentTab === 'active' ? "Aktif plan ara..." : "Temel plan ara..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Active Plans Table */}
      {currentTab === 'active' && (
        <div className="overflow-x-auto card p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Süre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentActivePlans.length > 0 ? (
                currentActivePlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <span className="font-bold">{plan.basicPlan?.name.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {plan.basicPlan?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPlanTypeBadge(plan.basicPlan?.planType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(plan.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(plan.durationInMonths)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {plan.basicPlan?.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/plans/${plan.id}`} className="text-primary hover:text-primary-dark">
                          <AiOutlineEye size={18} />
                        </Link>
                        <Link to={`/plans/${plan.id}/edit`} className="text-amber-500 hover:text-amber-600">
                          <AiOutlineEdit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDeletePlan(plan.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <AiOutlineDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Aktif plan bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Basic Plans Table */}
      {currentTab === 'basic' && (
        <div className="overflow-x-auto card p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temel Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBasicPlans.length > 0 ? (
                currentBasicPlans.map((basicPlan) => (
                  <tr key={basicPlan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <span className="font-bold">{basicPlan.name.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {basicPlan.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPlanTypeBadge(basicPlan.planType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {basicPlan.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/plans/basic/${basicPlan.id}`} className="text-primary hover:text-primary-dark">
                          <AiOutlineEye size={18} />
                        </Link>
                        <Link to={`/plans/basic/${basicPlan.id}/edit`} className="text-amber-500 hover:text-amber-600">
                          <AiOutlineEdit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteBasicPlan(basicPlan.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <AiOutlineDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Temel plan bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {((currentTab === 'active' && totalActivePagesCount > 1) || (currentTab === 'basic' && totalBasicPagesCount > 1)) && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {currentTab === 'active' ? (
              `${activePlansList.length} plandan ${indexOfFirstActivePlan + 1} - ${Math.min(indexOfLastActivePlan, activePlansList.length)} arası gösteriliyor`
            ) : (
              `${basicPlansList.length} temel plandan ${indexOfFirstBasicPlan + 1} - ${Math.min(indexOfLastBasicPlan, basicPlansList.length)} arası gösteriliyor`
            )}
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Önceki
            </button>
            {[...Array(currentTab === 'active' ? totalActivePagesCount : totalBasicPagesCount)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`btn ${
                  currentPage === i + 1
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, currentTab === 'active' ? totalActivePagesCount : totalBasicPagesCount))}
              disabled={currentPage === (currentTab === 'active' ? totalActivePagesCount : totalBasicPagesCount)}
              className="btn bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanList; 