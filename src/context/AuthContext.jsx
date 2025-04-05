import { createContext, useState, useEffect } from 'react';
import { loginWithEmail, getUserInfo, logout } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getUserInfo();
          setUser(userData);
        } catch (err) {
          localStorage.removeItem('token');
          setError(err.message);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginWithEmail(email, password);
      
      // Yanıt içinde token var mı kontrol et ve localStorage'a kaydet
      if (response.token) {
        localStorage.setItem('token', response.token);
      } else if (response.accessToken) {
        localStorage.setItem('token', response.accessToken);
      }
      
      // Kullanıcı bilgisini state'e kaydet
      if (response.user) {
        setUser(response.user);
      } else {
        // Eğer response'da user yoksa, getUserInfo ile almayı dene
        try {
          const userData = await getUserInfo();
          setUser(userData);
        } catch (userErr) {
          console.error("Failed to get user info after login:", userErr);
        }
      }
      
      setError(null);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await logout();
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout: logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 