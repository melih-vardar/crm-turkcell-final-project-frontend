import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main Pages
import Dashboard from './pages/dashboard/Dashboard';

// Customer Pages
import CustomerList from './pages/customers/CustomerList';
import CustomerDetail from './pages/customers/CustomerDetail';
import CustomerForm from './pages/customers/CustomerForm';

// Plan Pages
import PlanList from './pages/plans/PlanList';
import PlanDetail from './pages/plans/PlanDetail';
import PlanForm from './pages/plans/PlanForm';
import BasicPlanCreate from './pages/plans/BasicPlanCreate';
import BasicPlanDetail from './pages/plans/BasicPlanDetail';
import BasicPlanEdit from './pages/plans/BasicPlanEdit';

// Contract Pages
import ContractList from './pages/contracts/ContractList';
import ContractDetail from './pages/contracts/ContractDetail';
import ContractForm from './pages/contracts/ContractForm';

// Bill Pages
import BillList from './pages/bills/BillList';
import BillCreate from './pages/bills/BillCreate';

// Support Pages
import TicketList from './pages/support/TicketList';

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            
            {/* Protected routes */}
            <Route 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Customer routes */}
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/add" element={<CustomerForm />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/customers/:id/edit" element={<CustomerForm />} />
              <Route path="/customers/:id/bills" element={<BillList />} />
              
              {/* Plan routes */}
              <Route path="/plans" element={<PlanList />} />
              <Route path="/plans/add" element={<PlanForm />} />
              <Route path="/plans/:id" element={<PlanDetail />} />
              <Route path="/plans/:id/edit" element={<PlanForm />} />
              
              {/* Basic Plan routes */}
              <Route path="/plans/basic/add" element={<BasicPlanCreate />} />
              <Route path="/plans/basic/:id" element={<BasicPlanDetail />} />
              <Route path="/plans/basic/:id/edit" element={<BasicPlanEdit />} />
              
              {/* Contract routes */}
              <Route path="/contracts" element={<ContractList />} />
              <Route path="/contracts/add" element={<ContractForm />} />
              <Route path="/contracts/:id" element={<ContractDetail />} />
              <Route path="/contracts/:id/edit" element={<ContractForm />} />
              
              {/* Bill routes */}
              <Route path="/bills" element={<BillList />} />
              <Route path="/bills/create" element={<BillCreate />} />
              <Route path="/bills/:id" element={<div>Bill Detail</div>} />
              <Route path="/bills/add" element={<div>New Bill</div>} />
              
              {/* Support routes */}
              <Route path="/support/tickets" element={<TicketList />} />
              <Route path="/support/tickets/:id" element={<div>Ticket Detail</div>} />
              <Route path="/support/tickets/add" element={<div>New Ticket</div>} />
              
              <Route path="/analytics" element={<div>Analytics</div>} />
              <Route path="/settings" element={<div>Settings</div>} />
              <Route path="/profile" element={<div>Profile</div>} />
            </Route>
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 