import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AiOutlineMenu, AiOutlineBell, AiOutlineUser, AiOutlineSearch } from 'react-icons/ai';

const Navbar = ({ openSidebar }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 lg:hidden"
                onClick={openSidebar}
              >
                <AiOutlineMenu size={24} />
              </button>
              <Link to="/" className="ml-4 lg:ml-0">
                <h1 className="text-xl font-bold text-primary hidden md:block">Turkcell CRM</h1>
                <h1 className="text-xl font-bold text-primary md:hidden">CRM</h1>
              </Link>
            </div>
          </div>
          
          {/* Search bar (visible on medium screens and up) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-auto px-4">
            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineSearch className="text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Notification bell */}
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:text-primary">
              <AiOutlineBell size={20} />
            </button>
            
            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {user?.username?.charAt(0).toUpperCase() || <AiOutlineUser />}
                  </div>
                </button>
              </div>
              
              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Settings
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AiOutlineSearch className="text-gray-400" />
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
            placeholder="Search"
            type="search"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 