import React, { useState, useRef, useEffect } from 'react';
import './filtro.css';
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

  // Fechar o menu ao clicar fora
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

  // Função de filtragem (case-insensitive)
  const filtrarOpcoes = () => {
    if (!termoPesquisa) return opcoes;
    
    return opcoes.filter(opcao => 
      opcao.label.toLowerCase().includes(termoPesquisa.toLowerCase())
    );
  };

  const opcoesFiltradas = filtrarOpcoes();

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
          {/* Campo de pesquisa - Só mostra se prop for true e houver opções */}
          {mostrarPesquisa && opcoes.length > 5 && (
            <div className="container-pesquisa">
              <Search size={16} className="icone-pesquisa" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
                className="input-pesquisa"
                onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar no input
              />
        </div>
      )}

      {/* Lista de opções filtradas */}
          {opcoesFiltradas.length > 0 ? (
            opcoesFiltradas.map((opcao) => (
              <div
                key={opcao.value}
                className={`item-opcao ${opcaoSelecionada === opcao.value ? 'selecionada' : ''}`}
                onClick={() => selecionarOpcao(opcao.value)}
              >
                {opcao.label}
              </div>
            ))
          ) : (
            // Feedback quando nenhum resultado for encontrado
            <div className="nenhum-resultado">
              Nenhuma opção encontrada para "{termoPesquisa}"
            </div>
          )}
          </div>
        )}
    </div>
  );
};

export default Filtro;