import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contextos/Autenticacao';
import './BotoesAcao.css';

const BotoesAcao = () => {
  const navigate = useNavigate();
  const { estaAutenticado } = useAuth();

  const handleEntrarAnonimo = () => {
    navigate('/qualificados');
  };

  // const handleFazerLogin = () => {
  //   navigate('/login'); // Corrigido para /login em vez de /cadastro
  // };

  const handleCadastro = () => {
    navigate('/cadastro'); // Adicionado cadastro separado
  };

  if (estaAutenticado()) {
    return null;
  }

  return (
    <div className="containerBotoesAcao">
      <div className="textoMotivacional">
        <h3>Pronto para começar?</h3>
        <p>Escolha como deseja acessar nossa plataforma e descubra as possibilidades</p>
      </div>
      
      <div className="grupoBotoes">
        <button 
          onClick={handleEntrarAnonimo} 
          className="botaoAcesso botaoSecundario"
        >
          <div className="conteudoBotao">
            <span className="iconeBotao">🚀</span>
            <div className="textoBotao">
              <span className="tituloBotao">Acessar Diretamente</span>
              <span className="descricaoBotao">Explore sem compromisso</span>
            </div>
          </div>
        </button>

        {/* <button 
          onClick={handleFazerLogin} 
          className="botaoAcesso botaoPrimario"
        >
          <div className="conteudoBotao">
            <span className="iconeBotao">🔐</span>
            <div className="textoBotao">
              <span className="tituloBotao">Fazer Login</span>
              <span className="descricaoBotao">Acesso completo</span>
            </div>
          </div>
        </button> */}

        <button 
          onClick={handleCadastro} 
          className="botaoAcesso"
          style={{
            backgroundColor: 'var(--corVerde)',
            color: 'var(--corBranco)'
          }}
        >
          <div className="conteudoBotao">
            <span className="iconeBotao">📝</span>
            <div className="textoBotao">
              <span className="tituloBotao">Cadastrar</span>
              <span className="descricaoBotao">Crie sua conta</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default BotoesAcao;