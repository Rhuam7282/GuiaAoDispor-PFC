// client/src/componentes/Autenticacao/AuthRedirect.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@Contextos/Autenticacao.jsx';

const AuthRedirect = ({ 
  redirecionarSeAutenticado = true, 
  destinoAutenticado = '/qualificados',
  destinoNaoAutenticado = '/'
}) => {
  const navigate = useNavigate();
  const { estaAutenticado, carregando } = useAuth();

  useEffect(() => {
    if (!carregando) {
      if (redirecionarSeAutenticado && estaAutenticado()) {
        navigate(destinoAutenticado, { replace: true });
      } else if (!redirecionarSeAutenticado && !estaAutenticado()) {
        navigate(destinoNaoAutenticado, { replace: true });
      }
    }
  }, [estaAutenticado, carregando, navigate, redirecionarSeAutenticado, destinoAutenticado, destinoNaoAutenticado]);

  if (carregando) {
    return (
      <div className="container-carregamento">
        <div className="spinner-grande"></div>
        <p>Redirecionando...</p>
      </div>
    );
  }

  return null;
};

export default AuthRedirect;