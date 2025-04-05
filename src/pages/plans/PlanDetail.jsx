import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft } from 'react-icons/ai';
import { getPlanById, deletePlan } from '../../api/plans';

const PlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const { data: plan, isLoading } = useQuery(
    ['plan', id],
    () => getPlanById(id),
    {
      onError: (err) => {
        setError('Failed to load plan data');
        console.error(err);
      }
    }
  );
  
  const handleDeletePlan = async () => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await deletePlan(id);
        navigate('/plans');
      } catch (err) {
        setError('Failed to delete plan');
        console.error(err);
      }
    }
  };
  
  const formatPrice = (price) => {
    if (!price) return '$0.00';
    return `$${Number(price).toFixed(2)}`;
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading plan details...</div>;
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="text-red-700">{error}</div>
        </div>
        <Link to="/plans" className="btn bg-white border border-gray-300 text-gray-700 flex items-center">
          <AiOutlineArrowLeft className="mr-2" />
          Back to Plans
        </Link>
      </div>
    );
  }
  
  if (!plan) {
    return <div className="text-center">Plan not found</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Plan Details
        </h1>
        <div className="flex space-x-2">
          <Link to={`/plans/${id}/edit`} className="btn btn-secondary flex items-center">
            <AiOutlineEdit className="mr-2" />
            Edit
          </Link>
          <button onClick={handleDeletePlan} className="btn btn-danger flex items-center">
            <AiOutlineDelete className="mr-2" />
            Delete
          </button>
        </div>
      </div>
      
      <Link to="/plans" className="btn bg-white border border-gray-300 text-gray-700 flex items-center inline-flex">
        <AiOutlineArrowLeft className="mr-2" />
        Back to Plans
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="text-xl font-bold">{plan.name?.substring(0, 2).toUpperCase() || 'PL'}</span>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
              <p className="text-gray-500">{plan.duration} Plan</p>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Price</h3>
              <p className="mt-1 text-xl font-bold text-primary">{formatPrice(plan.price)}</p>
              <p className="text-sm text-gray-500">{plan.duration} billing</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-gray-900 whitespace-pre-line">{plan.description || 'No description provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Features</h2>
          {plan.features && plan.features.length > 0 ? (
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 inline-flex mt-1 items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="ml-3 text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-4">No features specified</p>
          )}
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Subscribers</h2>
          <Link to={`/plans/${id}/subscribers`} className="text-primary text-sm">View All</Link>
        </div>
        <div className="text-center text-gray-500 py-8">No subscribers to display</div>
      </div>
    </div>
  );
};

export default PlanDetail; 