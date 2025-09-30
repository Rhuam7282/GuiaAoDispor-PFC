// client/src/componentes/Autenticacao/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@Contextos/Autenticacao.jsx';

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

  if (requerAutenticacao && !estaAutenticado()) {
    return (
      <Navigate 
        to={redirecionarPara} 
        state={{ de: localizacao.pathname }} 
        replace 
      />
    );
  }

  if (!requerAutenticacao && estaAutenticado()) {
    return <Navigate to="/qualificados" replace />;
  }

  return children;
};

export default ProtectedRoute;