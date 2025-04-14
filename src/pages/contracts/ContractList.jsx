import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { AiOutlinePlus, AiOutlineSearch, AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { getAllCustomers } from '../../api/customers';
import { createContract, deleteContract } from '../../api/contracts';

const ContractList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  
  // Fetch contracts - Mock data for now as the API might not be ready
  const { data: contracts, isLoading: contractsLoading, error: contractsError, refetch } = useQuery('contracts', async () => {
    // This would be replaced with real API call
    return [
      { id: '1', customerId: '1', planId: '1', startDate: '2023-01-15', endDate: '2024-01-15', status: 'ACTIVE', customer: { firstName: 'Ahmet', lastName: 'Yılmaz' }, plan: { name: 'Premium Plan' } },
      { id: '2', customerId: '2', planId: '2', startDate: '2023-02-20', endDate: '2024-02-20', status: 'ACTIVE', customer: { firstName: 'Ayşe', lastName: 'Demir' }, plan: { name: 'Standard Plan' } },
      { id: '3', customerId: '3', planId: '3', startDate: '2023-03-10', endDate: '2023-09-10', status: 'TERMINATED', customer: { firstName: 'Mehmet', lastName: 'Kaya' }, plan: { name: 'Basic Plan' } },
      { id: '4', customerId: '4', planId: '1', startDate: '2023-05-05', endDate: '2024-05-05', status: 'ACTIVE', customer: { firstName: 'Fatma', lastName: 'Şahin' }, plan: { name: 'Premium Plan' } },
      { id: '5', customerId: '5', planId: '2', startDate: '2023-06-12', endDate: '2024-06-12', status: 'SUSPENDED', customer: { firstName: 'Ali', lastName: 'Öztürk' }, plan: { name: 'Standard Plan' } },
    ];
  });
  
  // Fetch customers for filtering
  const { data: customers, isLoading: customersLoading } = useQuery('customers', getAllCustomers);
  
  // Filter contracts based on search term and selected customer
  const filteredContracts = contracts?.filter(contract => {
    const matchesSearchTerm = 
      contract.customer?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customer?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.plan?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCustomer = selectedCustomer ? contract.customerId === selectedCustomer : true;
    
    return matchesSearchTerm && matchesCustomer;
  }) || [];
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContracts = filteredContracts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  
  const handleDeleteContract = async (id) => {
    if (window.confirm('Bu sözleşmeyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteContract(id);
        refetch();
      } catch (err) {
        console.error('Sözleşme silinemedi:', err);
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
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
  
  if (contractsLoading || customersLoading) {
    return <div className="flex items-center justify-center h-64">Sözleşmeler yükleniyor...</div>;
  }
  
  if (contractsError) {
    return <div className="text-red-500">Sözleşmeler yüklenirken hata oluştu: {contractsError.message}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sözleşmeler</h1>
        <Link to="/contracts/add" className="btn btn-primary flex items-center">
          <AiOutlinePlus className="mr-2" />
          Yeni Sözleşme
        </Link>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AiOutlineSearch className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            className="input pl-10 w-full"
            placeholder="Sözleşme ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:w-1/4">
          <select
            className="input w-full"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">Tüm Müşteriler</option>
            {customers?.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Contracts Table */}
      <div className="overflow-x-auto card p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlangıç Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bitiş Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentContracts.length > 0 ? (
              currentContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                        <span className="font-bold">{contract.customer?.firstName.charAt(0)}{contract.customer?.lastName.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contract.customer?.firstName} {contract.customer?.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.plan?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(contract.startDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(contract.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/contracts/${contract.id}`} className="text-primary hover:text-primary-dark">
                        <AiOutlineEye size={18} />
                      </Link>
                      <Link to={`/contracts/${contract.id}/edit`} className="text-amber-500 hover:text-amber-600">
                        <AiOutlineEdit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDeleteContract(contract.id)}
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
                  Sözleşme bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {filteredContracts.length} sözleşmeden {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredContracts.length)} arası gösteriliyor
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Önceki
            </button>
            {[...Array(totalPages)].map((_, i) => (
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
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

export default ContractList; 