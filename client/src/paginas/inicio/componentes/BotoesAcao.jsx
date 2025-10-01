import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contextos/Autenticacao';
import './BotoesAcao.css';

const BotoesAcao = () => {
  const navigate = useNavigate();
  const { estaAutenticado } = useAuth();
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleEntrarAnonimo = () => {
    console.log('🚀 Acessando diretamente (anonimo)');
    navigate('/qualificados');
  };

  const handleFazerLogin = () => {
    console.log('🔐 Redirecionando para cadastro/login');
    navigate('/cadastro');
  };

  // CORREÇÃO: Não esconder os botões mesmo se autenticado
  // Apenas ajustar o comportamento se necessário

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
              <span className="iconeBotao">🚀 </span>
              <div className="textoBotao">
                <span className="tituloBotao">Acessar Diretamente </span>
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
              <span className="iconeBotao">🔐 </span>
              <div className="textoBotao">
                <span className="tituloBotao">Fazer Login </span>
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
      </div>
    </div>
  );
};

export default BotoesAcao;