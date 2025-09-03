import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contextos/autenticacao';

const BotaoAcao = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const aoClicarBotao = () => {
    if (isAuthenticated()) {
      navigate('/qualificados');
    } else {
      navigate('/cadastro');
    }
  };

  return (
    <button onClick={aoClicarBotao} className="botaoPrimario">
      {isAuthenticated() ? 'Ver Qualificados' : 'Venha fazer parte'}
    </button>
  );
};

export default BotaoAcao;

