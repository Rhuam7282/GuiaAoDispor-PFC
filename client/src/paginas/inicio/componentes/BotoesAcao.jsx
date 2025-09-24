import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contextos/autenticacao';
import BotaoAcao from './BotoesAcao';
import './BotoesAcao.css';

const BotoesAcao = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleEntrarAnonimo = () => {
    // Lógica para entrada anônima, talvez redirecionar para uma página específica ou definir um estado de usuário anônimo
    navigate('/qualificados'); // Exemplo: redireciona para a página de qualificados
  };

  return (
    <div className="containerBotoesAcao">
      <BotaoAcao />
      {!isAuthenticated() && (
        <button onClick={handleEntrarAnonimo} className="botaoSecundario">
          Entrar Anonimamente
        </button>
      )}
    </div>
  );
};

export default BotoesAcao;