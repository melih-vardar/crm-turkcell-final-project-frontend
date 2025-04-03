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
import CustomerList from './pages/customers/CustomerList';

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
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/:id" element={<div>Customer Detail</div>} />
              <Route path="/customers/add" element={<div>Add Customer</div>} />
              <Route path="/plans" element={<div>Plans List</div>} />
              <Route path="/plans/:id" element={<div>Plan Detail</div>} />
              <Route path="/billing" element={<div>Billing List</div>} />
              <Route path="/support" element={<div>Support</div>} />
              <Route path="/analytics" element={<div>Analytics</div>} />
              <Route path="/settings" element={<div>Settings</div>} />
              <Route path="/profile" element={<div>Profile</div>} />
            </Route>
            
            {/* Redirect root to dashboard or login */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 