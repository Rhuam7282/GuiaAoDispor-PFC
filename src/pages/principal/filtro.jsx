import React, { useState, useRef, useEffect } from 'react';
import './filtro.css';
import { ChevronDown } from 'lucide-react';

const Filtro = ({ 
  titulo = 'Filtros:', 
  opcoes = [], 
  opcaoSelecionada, 
  aoMudar,
  classeAdicional = '' 
}) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  const alternarMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const selecionarOpcao = (valor) => {
    aoMudar(valor);
    setMenuAberto(false);
  };

  // Fechar o menu ao clicar fora
  useEffect(() => {
    const cliqueFora = (evento) => {
      if (menuRef.current && !menuRef.current.contains(evento.target)) {
        setMenuAberto(false);
      }
    };

    document.addEventListener('mousedown', cliqueFora);
    return () => document.removeEventListener('mousedown', cliqueFora);
  }, []);

  return (
    <div 
      className={`seletor-filtro ${classeAdicional}`} 
      ref={menuRef}
    >
      <div 
        className="controle-seletor"
        onClick={alternarMenu}
      >
        <span className="rotulo-seletor">{titulo}</span>
        <div className="opcao-selecionada">
          {opcoes.find(op => op.value === opcaoSelecionada)?.label || 'Selecione'}
        </div>
        <ChevronDown 
          className={`icone-seta ${menuAberto ? 'aberto' : ''}`} 
          size={16} 
        />
      </div>
      
      {menuAberto && (
        <div className="lista-opcoes">
          {opcoes.map((opcao) => (
            <div
              key={opcao.value}
              className={`item-opcao ${opcaoSelecionada === opcao.value ? 'selecionada' : ''}`}
              onClick={() => selecionarOpcao(opcao.value)}
            >
              {opcao.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filtro;