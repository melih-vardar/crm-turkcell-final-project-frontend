import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { AiOutlinePlus, AiOutlineSearch, AiOutlineFileText, AiOutlineEdit, AiOutlineEye, AiOutlineDelete, AiOutlineCreditCard } from 'react-icons/ai';
import { getCustomerBills, processPayment, deleteBill, getBillById } from '../../api/billing';
import { getAllCustomers } from '../../api/customers';

const BillList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Fetch customers for filtering
  const { data: customers, isLoading: customersLoading } = useQuery('customers', getAllCustomers);
  
  // Fetch bills - only if customer ID is selected
  const { data: bills = [], isLoading: billsLoading, error: billsError, refetch } = useQuery(
    ['bills', selectedCustomer],
    () => selectedCustomer ? getCustomerBills(selectedCustomer) : Promise.resolve([]),
    {
      enabled: !!selectedCustomer // Only run the query if selectedCustomer has a value
    }
  );
  
  // Filter bills based on search term and status
  const filteredBills = bills.filter(bill => {
    const matchesSearchTerm = 
      bill.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.amount?.toString().includes(searchTerm);
    
    const matchesStatus = selectedStatus ? bill.status === selectedStatus : true;
    
    return matchesSearchTerm && matchesStatus;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handlePaymentModal = (bill) => {
    setCurrentBill(bill);
    setPaymentAmount(bill.amount.toString());
    setPaymentModalOpen(true);
  };
  
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);
    
    try {
      // Backend API'sine göre billId ile ödeme işlemini gerçekleştir
      await processPayment(currentBill.id, {
        amount: parseFloat(paymentAmount),
        paymentMethod,
        // Mock card details for demo
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123'
      });
      
      setPaymentModalOpen(false);
      
      // Müşteri seçiliyse, fatura listesini güncelle
      if (selectedCustomer) {
        refetch();
      }
    } catch (err) {
      setError('Ödeme işlemi başarısız oldu: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteBill = async (id) => {
    if (window.confirm('Bu faturayı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteBill(id);
        
        // Müşteri seçiliyse, fatura listesini güncelle
        if (selectedCustomer) {
          refetch();
        }
      } catch (err) {
        console.error('Failed to delete bill:', err);
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };
  
  const formatPrice = (price) => {
    return `₺${Number(price).toFixed(2)}`;
  };
  
  const getStatusBadge = (status) => {
    const statusMap = {
      PAID: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ödendi' },
      UNPAID: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Ödenmedi' },
      OVERDUE: { bg: 'bg-red-100', text: 'text-red-800', label: 'Gecikmiş' },
      PENDING: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Beklemede' },
      PARTIAL: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Kısmi Ödendi' }
    };
    
    const { bg, text, label } = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };
  
  if (customersLoading) {
    return <div className="flex items-center justify-center h-64">Müşteriler yükleniyor...</div>;
  }
  
  if (selectedCustomer && billsLoading) {
    return <div className="flex items-center justify-center h-64">Faturalar yükleniyor...</div>;
  }
  
  if (selectedCustomer && billsError) {
    return <div className="text-red-500">Faturalar yüklenirken hata oluştu: {billsError.message}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Faturalar</h1>
        <div className="flex space-x-2">
          {selectedCustomer && (
            <button
              onClick={() => setSelectedCustomer('')}
              className="btn btn-secondary flex items-center"
            >
              Tüm Faturalar
            </button>
          )}
          <Link to="/bills/create" className="btn btn-primary flex items-center">
            <AiOutlinePlus className="mr-2" />
            Yeni Fatura
          </Link>
        </div>
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
            placeholder="Fatura ara..."
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
            <option value="">Müşteri Seçin</option>
            {customers?.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="md:w-1/5">
          <select
            className="input w-full"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Tüm Durumlar</option>
            <option value="PAID">Ödendi</option>
            <option value="UNPAID">Ödenmedi</option>
            <option value="OVERDUE">Gecikmiş</option>
            <option value="PENDING">Beklemede</option>
            <option value="PARTIAL">Kısmi Ödendi</option>
          </select>
        </div>
      </div>
      
      {/* No Customer Selected Message */}
      {!selectedCustomer && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            Fatura listesini görmek için lütfen müşteri seçin.
          </p>
        </div>
      )}
      
      {/* Bills Table */}
      {selectedCustomer && (
        <div className="overflow-x-auto card p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatura</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Ödeme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBills.length > 0 ? (
                currentBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          <AiOutlineFileText size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            #{bill.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {bill.customer?.firstName} {bill.customer?.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {bill.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatPrice(bill.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(bill.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(bill.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <Link to={`/bills/${bill.id}`} className="text-blue-600 hover:text-blue-900">
                          <AiOutlineEye size={20} />
                        </Link>
                        <Link to={`/bills/${bill.id}/edit`} className="text-amber-600 hover:text-amber-900">
                          <AiOutlineEdit size={20} />
                        </Link>
                        {bill.status !== 'PAID' && (
                          <button 
                            onClick={() => handlePaymentModal(bill)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <AiOutlineCreditCard size={20} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteBill(bill.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Bu müşteriye ait fatura bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Önceki</span>
              &larr;
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === i + 1
                    ? 'z-10 border-primary bg-primary-50 text-primary'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Sonraki</span>
              &rarr;
            </button>
          </nav>
        </div>
      )}
      
      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Ödeme İşlemi
                </h3>
                
                {error && (
                  <div className="mt-3 p-2 bg-red-100 text-red-800 rounded">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleProcessPayment} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fatura</label>
                    <div className="mt-1 text-gray-900">
                      #{currentBill?.id} - {currentBill?.description}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">Ödeme Tutarı</label>
                    <input
                      type="number"
                      id="paymentAmount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      max={currentBill?.amount}
                      required
                      className="mt-1 input w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Ödeme Yöntemi</label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 input w-full"
                    >
                      <option value="CREDIT_CARD">Kredi Kartı</option>
                      <option value="BANK_TRANSFER">Banka Transferi</option>
                      <option value="CASH">Nakit</option>
                    </select>
                  </div>
                  
                  {paymentMethod === 'CREDIT_CARD' && (
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Kart Numarası</label>
                        <input
                          type="text"
                          id="cardNumber"
                          placeholder="**** **** **** ****"
                          className="mt-1 input w-full"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Son Kullanma Tarihi</label>
                          <input
                            type="text"
                            id="expiryDate"
                            placeholder="MM/YY"
                            className="mt-1 input w-full"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                          <input
                            type="text"
                            id="cvv"
                            placeholder="***"
                            className="mt-1 input w-full"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Modal Actions */}
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="btn btn-primary sm:col-start-2"
                    >
                      {isProcessing ? 'İşleniyor...' : 'Ödeme Yap'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentModalOpen(false)}
                      className="btn btn-secondary sm:col-start-1 mt-3 sm:mt-0"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillList; 