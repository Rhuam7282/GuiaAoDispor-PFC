import React, { useState, useRef, useEffect } from 'react';
import './Filtro.css';
import { ChevronDown, Search } from 'lucide-react';

const Filtro = ({ 
  titulo = 'Filtros:', 
  opcoes = [], 
  opcaoSelecionada, 
  aoMudar,
  classeAdicional = '',
  mostrarPesquisa = true
}) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const menuRef = useRef(null);

  const alternarMenu = () => {
    setMenuAberto(!menuAberto);
    setTermoPesquisa(''); 
  };

  const selecionarOpcao = (valor) => {
    aoMudar(valor);
    setMenuAberto(false);
  };

  useEffect(() => {
    const cliqueFora = (evento) => {
      if (menuRef.current && !menuRef.current.contains(evento.target)) {
        setMenuAberto(false);
        setTermoPesquisa('');
      }
    };

    document.addEventListener('mousedown', cliqueFora);
    return () => document.removeEventListener('mousedown', cliqueFora);
  }, []);

  const filtrarOpcoes = () => {
    if (!termoPesquisa) return opcoes;
    
    return opcoes.filter(opcao => 
      opcao.label.toLowerCase().includes(termoPesquisa.toLowerCase())
    );
  };

  const opcoesFiltradas = filtrarOpcoes();

  return (
    <div 
      className={`cartao cartaoTextoEsquerda ${classeAdicional}`} 
      ref={menuRef}
    >
      <div 
        className="controleSeletor"
        onClick={alternarMenu}
      >
        <span className="rotuloSeletor">{titulo}</span>
        <div className="opcaoSelecionada">
          {opcoes.find(op => op.value === opcaoSelecionada)?.label || 'Selecione'}
        </div>
        <ChevronDown 
          className={`iconeSeta ${menuAberto ? 'aberto' : ''}`} 
          size={16} 
        />
      </div>
      
      {menuAberto && (
        <div className="listaOpcoes">
          {}
          {mostrarPesquisa && opcoes.length > 5 && (
            <div className="containerPesquisa">
              <Search size={16} className="iconePesquisa" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
                className="inputPesquisa"
              />
        </div>
      )}

      {}
          {opcoesFiltradas.length > 0 ? (
            opcoesFiltradas.map((opcao) => (
              <div
                key={opcao.value}
                className={`itemOpcao ${opcaoSelecionada === opcao.value ? 'selecionada' : ''}`}
                onClick={() => selecionarOpcao(opcao.value)}
              >
                {opcao.label}
              </div>
            ))
          ) : (
            <div className="nenhumResultado">
              {`Nenhuma opção encontrada para "${termoPesquisa}"`}
            </div>
          )}
          </div>
        )}
    </div>
  );
};

export default Filtro;