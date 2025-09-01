/* Contexto de Autenticação - Gerencia estado de login do usuário */
import React, { createContext, useContext, useState, useEffect } from 'react';

/* Criação do contexto de autenticação */
const AuthContext = createContext();

/* Hook personalizado para usar o contexto de autenticação */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

/* Provider do contexto de autenticação */
export const AuthProvider = ({ children }) => {
  /* Estado para armazenar informações do usuário logado */
  const [user, setUser] = useState(null);
  
  /* Estado para controlar se está carregando */
  const [loading, setLoading] = useState(true);

  /* Função para verificar se usuário está logado */
  const isAuthenticated = () => {
    return user !== null;
  };

  /* Função para fazer login do usuário */
  const login = (userData) => {
    setUser(userData);
    /* Salva dados do usuário no localStorage */
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  };

  /* Função para fazer logout do usuário */
  const logout = () => {
    setUser(null);
    /* Remove dados do localStorage */
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  /* Função para obter dados do usuário do localStorage */
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

  /* Effect para recuperar dados do usuário ao carregar a aplicação */
  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  /* Valores fornecidos pelo contexto */
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

