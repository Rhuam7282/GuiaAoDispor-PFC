import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contextos/autenticacao';
import './BotoesAcao.css';

const BotoesAcao = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleEntrarAnonimo = () => {
    // Lógica para entrada anônima - acesso direto sem login
    navigate('/qualificados'); // Redireciona para a página principal
  };

  const handleFazerLogin = () => {
    // Redireciona para a página de login
    navigate('/cadastro');
  };

  // Se o usuário estiver autenticado, não mostra os botões
  if (isAuthenticated()) {
    return null;
  }

  return (
    <div className="containerBotoesAcao">
      <button onClick={handleEntrarAnonimo} className="botaoSecundario">
        Acessar Diretamente
      </button>
      <button onClick={handleFazerLogin} className="botaoPrimario">
        Fazer Login
      </button>
    </div>
  );
};

export default BotoesAcao;