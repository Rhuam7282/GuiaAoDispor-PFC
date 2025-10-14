// client/src/componentes/Autenticacao/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@Contextos/autenticacao.jsx';

const ProtectedRoute = ({ children, requerAutenticacao = true, redirecionarPara = '/' }) => {
  const { estaAutenticado, carregando } = useAuth();
  const localizacao = useLocation();

  if (carregando) {
    return (
      <div className="container-carregamento">
        <div className="spinner-grande"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // Se a rota requer autenticação e usuário não está autenticado
  if (requerAutenticacao && !estaAutenticado()) {
    return (
      <Navigate 
        to={redirecionarPara} 
        state={{ de: localizacao.pathname }} 
        replace 
      />
    );
  }

  // Se a rota NÃO requer autenticação (como cadastro/login) e usuário ESTÁ autenticado
  if (!requerAutenticacao && estaAutenticado()) {
    // Redirecionar autenticados que tentam acessar cadastro para o perfil
    if (localizacao.pathname === '/cadastro') {
      return <Navigate to="/perfil" replace />;
    }
    return <Navigate to="/qualificados" replace />;
  }

  return children;
};

export default ProtectedRoute;