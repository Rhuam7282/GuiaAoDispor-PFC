import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './autenticacao.jsx';

const AuthRedirect = ({ 
  redirecionarSeAutenticado = false, 
  destinoAutenticado = '/qualificados',
  destinoNaoAutenticado = '/',
  children 
}) => {
  const { estaAutenticado, carregando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!carregando) {
      if (redirecionarSeAutenticado && estaAutenticado()) {
        navigate(destinoAutenticado, { replace: true });
      } else if (!redirecionarSeAutenticado && !estaAutenticado()) {
        navigate(destinoNaoAutenticado, { replace: true });
      }
    }
  }, [estaAutenticado, carregando, redirecionarSeAutenticado, destinoAutenticado, destinoNaoAutenticado, navigate]);

  if (carregando) {
    return <div>Carregando...</div>;
  }

  if (redirecionarSeAutenticado && estaAutenticado()) {
    return null;
  }

  if (!redirecionarSeAutenticado && !estaAutenticado()) {
    return null;
  }

  return children;
};

export default AuthRedirect;
