import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { AiOutlinePlus, AiOutlineSearch, AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { getAllCustomers, deleteCustomer } from '../../api/customers';

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const { data, isLoading, error, refetch } = useQuery('customers', getAllCustomers, {
    // Mock data for development
    initialData: [
      { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '5551234567', address: '123 Main St' },
      { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '5559876543', address: '456 Elm St' },
      { id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', phone: '5552223333', address: '789 Oak St' },
      { id: '4', firstName: 'Alice', lastName: 'Williams', email: 'alice@example.com', phone: '5554445555', address: '321 Pine St' },
      { id: '5', firstName: 'Mike', lastName: 'Brown', email: 'mike@example.com', phone: '5556667777', address: '654 Maple St' },
    ]
  });
  
  // Filter customers based on search term
  const filteredCustomers = data?.filter(customer => 
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  ) || [];
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  
  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete customer:', err);
      }
    }
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading customers...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error loading customers: {error.message}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <Link to="/customers/add" className="btn btn-primary flex items-center">
          <AiOutlinePlus className="mr-2" />
          Add Customer
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AiOutlineSearch className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          className="input pl-10 w-full"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Customers Table */}
      <div className="overflow-x-auto card p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                        {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/customers/${customer.id}`} className="text-primary hover:text-primary-dark">
                        <AiOutlineEye size={18} />
                      </Link>
                      <Link to={`/customers/${customer.id}/edit`} className="text-amber-500 hover:text-amber-600">
                        <AiOutlineEdit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDeleteCustomer(customer.id)}
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
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No customers found
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} customers
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
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
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList; 