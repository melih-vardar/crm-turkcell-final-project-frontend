import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  AiOutlinePlus, 
  AiOutlineSearch, 
  AiOutlineEdit, 
  AiOutlineDelete, 
  AiOutlineEye, 
  AiOutlineFileText,
  AiOutlineClose,
  AiOutlineReload
} from 'react-icons/ai';
import { getAllTickets, getCustomerTickets, deleteTicket, closeTicket, reopenTicket } from '../../api/support';
import { getAllCustomers } from '../../api/customers';

const TicketList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Fetch tickets - using the customer param if selected
  const { data: tickets, isLoading: ticketsLoading, error: ticketsError, refetch } = useQuery(
    ['tickets', selectedCustomer],
    () => selectedCustomer ? getCustomerTickets(selectedCustomer) : getAllTickets(),
    {
      // Mock data for development
      initialData: [
        { 
          id: '1', 
          customerId: '1', 
          title: 'İnternet bağlantım çok yavaş',
          description: 'Son birkaç gündür internet bağlantım çok yavaşladı. Online derslerime katılmakta zorluk çekiyorum.',
          priority: 'HIGH',
          category: 'TECHNICAL',
          status: 'OPEN',
          createdAt: '2023-05-05T10:30:00',
          updatedAt: '2023-05-05T11:15:00',
          assignedTo: 'Mehmet Tekniker',
          customer: { firstName: 'Ahmet', lastName: 'Yılmaz' }
        },
        { 
          id: '2', 
          customerId: '2', 
          title: 'Fatura itirazı',
          description: 'Son faturamda kullanmadığım hizmetler için ücretlendirme yapılmış. Kontrol edilmesini talep ediyorum.',
          priority: 'MEDIUM',
          category: 'BILLING',
          status: 'IN_PROGRESS',
          createdAt: '2023-05-06T09:15:00',
          updatedAt: '2023-05-06T14:20:00',
          assignedTo: 'Ayşe Muhasebe',
          customer: { firstName: 'Ayşe', lastName: 'Demir' }
        },
        { 
          id: '3', 
          customerId: '3', 
          title: 'Paket değişikliği yapmak istiyorum',
          description: 'Mevcut paketim ihtiyaçlarımı karşılamıyor. Daha yüksek bir pakete geçmek istiyorum.',
          priority: 'LOW',
          category: 'SALES',
          status: 'CLOSED',
          createdAt: '2023-05-01T15:45:00',
          updatedAt: '2023-05-03T10:10:00',
          assignedTo: 'Ali Satış',
          customer: { firstName: 'Mehmet', lastName: 'Kaya' } 
        },
        { 
          id: '4', 
          customerId: '4', 
          title: 'Yeni hizmet aktivasyonu',
          description: 'TV paketi de eklemek istiyorum mevcut internet paketimin yanına. Nasıl bir yol izlemeliyim?',
          priority: 'MEDIUM',
          category: 'GENERAL',
          status: 'PENDING',
          createdAt: '2023-05-07T11:05:00',
          updatedAt: '2023-05-07T11:05:00',
          assignedTo: null,
          customer: { firstName: 'Fatma', lastName: 'Şahin' }
        },
        { 
          id: '5', 
          customerId: '5', 
          title: 'Modemim arızalandı',
          description: 'Modemim tamamen çalışmayı durdurdu. Değişim talep ediyorum.',
          priority: 'HIGH',
          category: 'TECHNICAL',
          status: 'IN_PROGRESS',
          createdAt: '2023-05-08T08:30:00',
          updatedAt: '2023-05-08T09:45:00',
          assignedTo: 'Mehmet Tekniker',
          customer: { firstName: 'Ali', lastName: 'Öztürk' }
        }
      ]
    }
  );
  
  // Fetch customers for filtering
  const { data: customers, isLoading: customersLoading } = useQuery('customers', getAllCustomers);
  
  // Filter tickets based on search term and filters
  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearchTerm = 
      ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? ticket.category === selectedCategory : true;
    const matchesStatus = selectedStatus ? ticket.status === selectedStatus : true;
    
    return matchesSearchTerm && matchesCategory && matchesStatus;
  }) || [];
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleDeleteTicket = async (id) => {
    if (window.confirm('Bu destek talebini silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTicket(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete ticket:', err);
      }
    }
  };
  
  const handleCloseTicket = async (id) => {
    try {
      await closeTicket(id);
      refetch();
    } catch (err) {
      console.error('Failed to close ticket:', err);
    }
  };
  
  const handleReopenTicket = async (id) => {
    try {
      await reopenTicket(id);
      refetch();
    } catch (err) {
      console.error('Failed to reopen ticket:', err);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR');
  };
  
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Az önce';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} saat önce`;
    } else {
      const diffInDays = diffInHours / 24;
      if (diffInDays < 30) {
        return `${Math.floor(diffInDays)} gün önce`;
      } else {
        return formatDate(dateString);
      }
    }
  };
  
  const getPriorityBadge = (priority) => {
    const priorityMap = {
      HIGH: { bg: 'bg-red-100', text: 'text-red-800', label: 'Yüksek' },
      MEDIUM: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Orta' },
      LOW: { bg: 'bg-green-100', text: 'text-green-800', label: 'Düşük' }
    };
    
    const { bg, text, label } = priorityMap[priority] || { bg: 'bg-gray-100', text: 'text-gray-800', label: priority };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };
  
  const getStatusBadge = (status) => {
    const statusMap = {
      OPEN: { bg: 'bg-green-100', text: 'text-green-800', label: 'Açık' },
      IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'İşlemde' },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Beklemede' },
      CLOSED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Kapalı' }
    };
    
    const { bg, text, label } = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };
  
  const getCategoryBadge = (category) => {
    const categoryMap = {
      TECHNICAL: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Teknik' },
      BILLING: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Fatura' },
      SALES: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Satış' },
      GENERAL: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Genel' }
    };
    
    const { bg, text, label } = categoryMap[category] || { bg: 'bg-gray-100', text: 'text-gray-800', label: category };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };
  
  if (ticketsLoading || customersLoading) {
    return <div className="flex items-center justify-center h-64">Destek talepleri yükleniyor...</div>;
  }
  
  if (ticketsError) {
    return <div className="text-red-500">Destek talepleri yüklenirken hata oluştu</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Destek Talepleri</h1>
        <div className="flex space-x-2">
          {selectedCustomer && (
            <button
              onClick={() => setSelectedCustomer('')}
              className="btn btn-secondary flex items-center"
            >
              Tüm Talepler
            </button>
          )}
          <Link to="/support/new" className="btn btn-primary flex items-center">
            <AiOutlinePlus className="mr-2" />
            Yeni Talep
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
            placeholder="Destek talebi ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:w-1/5">
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
        
        <div className="md:w-1/5">
          <select
            className="input w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tüm Kategoriler</option>
            <option value="TECHNICAL">Teknik</option>
            <option value="BILLING">Fatura</option>
            <option value="SALES">Satış</option>
            <option value="GENERAL">Genel</option>
          </select>
        </div>
        
        <div className="md:w-1/5">
          <select
            className="input w-full"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Tüm Durumlar</option>
            <option value="OPEN">Açık</option>
            <option value="IN_PROGRESS">İşlemde</option>
            <option value="PENDING">Beklemede</option>
            <option value="CLOSED">Kapalı</option>
          </select>
        </div>
      </div>
      
      {/* Tickets Table */}
      <div className="overflow-x-auto card p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talep Kodu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Öncelik</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Güncelleme</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTickets.length > 0 ? (
              currentTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <AiOutlineFileText size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{ticket.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ticket.customer?.firstName} {ticket.customer?.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">
                      {ticket.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCategoryBadge(ticket.category)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(ticket.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(ticket.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatTimeAgo(ticket.updatedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <Link to={`/support/${ticket.id}`} className="text-blue-600 hover:text-blue-900">
                        <AiOutlineEye size={20} />
                      </Link>
                      <Link to={`/support/${ticket.id}/edit`} className="text-amber-600 hover:text-amber-900">
                        <AiOutlineEdit size={20} />
                      </Link>
                      {ticket.status !== 'CLOSED' ? (
                        <button 
                          onClick={() => handleCloseTicket(ticket.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Talebi Kapat"
                        >
                          <AiOutlineClose size={20} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleReopenTicket(ticket.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Talebi Yeniden Aç"
                        >
                          <AiOutlineReload size={20} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Talebi Sil"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  Filtreleme kriterlerine uygun talep bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
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
    </div>
  );
};

export default TicketList; 