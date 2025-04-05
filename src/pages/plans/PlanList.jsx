import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { AiOutlinePlus, AiOutlineSearch, AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { getAllPlans, deletePlan } from '../../api/plans';

const PlanList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const { data, isLoading, error, refetch } = useQuery('plans', getAllPlans, {
    // Mock data for development
    initialData: [
      { id: '1', name: 'Basic Plan', description: 'Basic features included', price: 49.99, duration: 'Monthly', features: ['Feature 1', 'Feature 2'] },
      { id: '2', name: 'Standard Plan', description: 'All basic features plus more', price: 99.99, duration: 'Monthly', features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'] },
      { id: '3', name: 'Premium Plan', description: 'All features included', price: 149.99, duration: 'Monthly', features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5', 'Feature 6'] },
      { id: '4', name: 'Enterprise Plan', description: 'Custom solutions for large companies', price: 499.99, duration: 'Monthly', features: ['All Features', 'Priority Support', 'Dedicated Account Manager'] },
      { id: '5', name: 'Annual Basic', description: 'Basic plan, yearly billing', price: 539.89, duration: 'Yearly', features: ['Feature 1', 'Feature 2'] },
    ]
  });
  
  // Filter plans based on search term
  const filteredPlans = data?.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.duration.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  
  const handleDeletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await deletePlan(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete plan:', err);
      }
    }
  };
  
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading plans...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error loading plans: {error.message}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Plans</h1>
        <Link to="/plans/add" className="btn btn-primary flex items-center">
          <AiOutlinePlus className="mr-2" />
          Add Plan
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
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Plans Table */}
      <div className="overflow-x-auto card p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPlans.length > 0 ? (
              currentPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <span className="font-bold">{plan.name.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {plan.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {plan.features?.length} features
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(plan.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {plan.description}
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
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No plans found
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPlans.length)} of {filteredPlans.length} plans
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

export default PlanList; 