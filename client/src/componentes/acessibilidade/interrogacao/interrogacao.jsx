/* Componente de Interrogação - Tooltip informativo que aparece ao clicar no botão de interrogação */
import React, { useState, useRef, useEffect } from 'react';
import './interrogacao.css';

/* Componente principal que renderiza um botão de interrogação com tooltip */
const Interrogacao = ({ children }) => {
  /* Estado para controlar se o conteúdo do tooltip está visível */
  const [mostrarConteudo, setMostrarConteudo] = useState(false);
  
  /* Referências para o conteúdo do tooltip e o botão, usadas para detectar cliques fora */
  const conteudoRef = useRef(null);
  const botaoRef = useRef(null);
  
  /* Função para alternar a visibilidade do tooltip */
  const alternarVisibilidade = () => {
    setMostrarConteudo(!mostrarConteudo);
  };

  /* Hook para detectar cliques fora do tooltip e fechá-lo automaticamente */
  useEffect(() => {
    const lidarCliqueFora = (evento) => {
      /* Verifica se o clique foi fora do conteúdo e do botão */
      if (conteudoRef.current && 
          !conteudoRef.current.contains(evento.target) && 
          !botaoRef.current.contains(evento.target)) {
        setMostrarConteudo(false);
      }
    };

    /* Adiciona o listener apenas quando o tooltip está visível */
    if (mostrarConteudo) {
      document.addEventListener('mousedown', lidarCliqueFora);
    }
    
    /* Remove o listener quando o componente é desmontado ou tooltip é fechado */
    return () => {
      document.removeEventListener('mousedown', lidarCliqueFora);
    };
  }, [mostrarConteudo]);

  return (
    <>
      {/* Botão de interrogação - posicionado fixo no canto superior direito */}
      <button 
        ref={botaoRef}
        className={`interogacao ${mostrarConteudo ? 'fechar' : ''} cartaoDestaque variacao1`}
        onClick={alternarVisibilidade}
        aria-label={mostrarConteudo ? "Fechar informações" : "Mostrar informações adicionais"}
      >
        {/* Alterna entre ? e ✕ dependendo do estado */}
        {mostrarConteudo ? '✕' : '?'}
      </button>
      
      {/* Conteúdo do tooltip - renderizado condicionalmente quando visível */}
      {mostrarConteudo && (
        <div 
          ref={conteudoRef}
          className="conteudo-interrogacao cartaoDestaque variacao3"
        >
          {/* Renderiza o conteúdo passado como children */}
          {children}
        </div>
      )}
    </>
  );
};

/* Exporta o componente para uso em outras partes da aplicação */
export default Interrogacao;

