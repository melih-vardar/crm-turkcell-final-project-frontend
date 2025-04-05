import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft, AiOutlineUser } from 'react-icons/ai';
import { getCustomerById, deleteCustomer } from '../../api/customers';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const { data: customer, isLoading } = useQuery(
    ['customer', id],
    () => getCustomerById(id),
    {
      onError: (err) => {
        setError('Failed to load customer data');
        console.error(err);
      }
    }
  );
  
  const handleDeleteCustomer = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        navigate('/customers');
      } catch (err) {
        setError('Failed to delete customer');
        console.error(err);
      }
    }
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading customer details...</div>;
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="text-red-700">{error}</div>
        </div>
        <Link to="/customers" className="btn bg-white border border-gray-300 text-gray-700 flex items-center">
          <AiOutlineArrowLeft className="mr-2" />
          Back to Customers
        </Link>
      </div>
    );
  }
  
  if (!customer) {
    return <div className="text-center">Customer not found</div>;
  }
  
  // Adres bilgisi kontrolü
  const addressDisplay = customer.address || 'No address provided';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Customer Details
        </h1>
        <div className="flex space-x-2">
          <Link to={`/customers/${id}/edit`} className="btn btn-secondary flex items-center">
            <AiOutlineEdit className="mr-2" />
            Edit
          </Link>
          <button onClick={handleDeleteCustomer} className="btn btn-danger flex items-center">
            <AiOutlineDelete className="mr-2" />
            Delete
          </button>
        </div>
      </div>
      
      <Link to="/customers" className="btn bg-white border border-gray-300 text-gray-700 flex items-center inline-flex">
        <AiOutlineArrowLeft className="mr-2" />
        Back to Customers
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <AiOutlineUser size={40} />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{customer.firstName} {customer.lastName}</h2>
              <p className="text-gray-500">{customer.email}</p>
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-gray-900">{customer.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1 text-gray-900">{customer.phone || 'No phone number provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1 text-gray-900 whitespace-pre-line">{addressDisplay}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Subscription Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Plan</h3>
              <p className="mt-1 text-gray-900">{customer.plan || 'No active plan'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  customer.status === 'Active' ? 'bg-green-100 text-green-800' : 
                  customer.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {customer.status || 'Inactive'}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Customer Since</h3>
              <p className="mt-1 text-gray-900">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Link to={`/customers/${id}/activity`} className="text-primary text-sm">View All</Link>
        </div>
        <div className="text-center text-gray-500 py-8">No recent activity</div>
      </div>
    </div>
  );
};

export default CustomerDetail; 