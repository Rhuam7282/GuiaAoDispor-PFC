import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contextos/autenticacao';
import './BotoesAcao.css';

const BotoesAcao = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleEntrarAnonimo = () => {
    navigate('/qualificados');
  };

  const handleFazerLogin = () => {
    navigate('/cadastro');
  };

  if (isAuthenticated()) {
    return null;
  }

  return (
    <div className="secaoBotoesAcao">
      <div className="containerBotoesAcao">
        <div className="textoMotivacional">
          <h3>Pronto para começar?</h3>
          <p>Escolha como deseja acessar nossa plataforma e descubra as possibilidades</p>
        </div>
        
        <div className="grupoBotoes">
          <button 
            onClick={handleEntrarAnonimo} 
            className="botaoAcesso botaoSecundario"
            onMouseEnter={() => setHoveredButton('anonimo')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div className="conteudoBotao">
              <span className="iconeBotao">🚀</span>
              <div className="textoBotao">
                <span className="tituloBotao">Acessar Diretamente</span>
                <span className="descricaoBotao">Explore sem compromisso</span>
              </div>
            </div>
            {hoveredButton === 'anonimo' && (
              <div className="tooltipBotao">
                Navegue pela plataforma e conheça nossos profissionais sem precisar criar uma conta
              </div>
            )}
          </button>

          <button 
            onClick={handleFazerLogin} 
            className="botaoAcesso botaoPrimario"
            onMouseEnter={() => setHoveredButton('login')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div className="conteudoBotao">
              <span className="iconeBotao">🔐</span>
              <div className="textoBotao">
                <span className="tituloBotao">Fazer Login</span>
                <span className="descricaoBotao">Acesso completo</span>
              </div>
            </div>
            {hoveredButton === 'login' && (
              <div className="tooltipBotao">
                Crie sua conta ou faça login para acessar todos os recursos e conectar-se com profissionais
              </div>
            )}
          </button>
        </div>

        <div className="beneficiosAcesso">
          <div className="beneficioItem">
            <span className="iconeBeneficio">✅</span>
            <span className="textoBeneficio">100% Gratuito</span>
          </div>
          <div className="beneficioItem">
            <span className="iconeBeneficio">🛡️</span>
            <span className="textoBeneficio">Seguro e Confiável</span>
          </div>
          <div className="beneficioItem">
            <span className="iconeBeneficio">⚡</span>
            <span className="textoBeneficio">Acesso Imediato</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotoesAcao;
