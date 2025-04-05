import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  AiOutlineDashboard, 
  AiOutlineUser, 
  AiOutlineShoppingCart, 
  AiOutlineFileText,
  AiOutlineCustomerService,
  AiOutlineLineChart,
  AiOutlineSetting,
  AiOutlineLogout
} from 'react-icons/ai';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: <AiOutlineDashboard size={20} />, label: 'Dashboard' },
    { to: '/customers', icon: <AiOutlineUser size={20} />, label: 'Customers' },
    { to: '/plans', icon: <AiOutlineShoppingCart size={20} />, label: 'Plans' },
    { to: '/billing', icon: <AiOutlineFileText size={20} />, label: 'Billing' },
    { to: '/support', icon: <AiOutlineCustomerService size={20} />, label: 'Support' },
    { to: '/analytics', icon: <AiOutlineLineChart size={20} />, label: 'Analytics' },
    { to: '/settings', icon: <AiOutlineSetting size={20} />, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary">Turkcell CRM</h1>
          </div>

          {/* User info */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <AiOutlineUser size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.username || 'User'}</p>
                  <p className="text-xs font-medium text-gray-500 truncate">{user.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink 
                    to={item.to} 
                    className={({ isActive }) => 
                      `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    onClick={() => setIsOpen && setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={logout} 
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              <AiOutlineLogout size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 