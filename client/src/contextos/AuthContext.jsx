
import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};


export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  
  
  const [loading, setLoading] = useState(true);

  
  const isAuthenticated = () => {
    return user !== null;
  };

  
  const login = (userData) => {
    setUser(userData);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  };

  
  const logout = () => {
    setUser(null);
    
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  
  const getUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const isAuth = localStorage.getItem('isAuthenticated');
      
      if (storedUser && isAuth === 'true') {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
    }
    return null;
  };

  
  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    getUserFromStorage
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

