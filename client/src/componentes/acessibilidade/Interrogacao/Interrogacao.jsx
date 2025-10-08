
import React, { useState, useRef, useEffect } from 'react';
import 'Interrogacao.css';


const Interrogacao = ({ children }) => {
  
  const [mostrarConteudo, setMostrarConteudo] = useState(false);
  
  
  const conteudoRef = useRef(null);
  const botaoRef = useRef(null);
  
  
  const alternarVisibilidade = () => {
    setMostrarConteudo(!mostrarConteudo);
  };

  
  useEffect(() => {
    const lidarCliqueFora = (evento) => {
      
      if (conteudoRef.current && 
          !conteudoRef.current.contains(evento.target) && 
          !botaoRef.current.contains(evento.target)) {
        setMostrarConteudo(false);
      }
    };

    
    if (mostrarConteudo) {
      document.addEventListener('mousedown', lidarCliqueFora);
    }
    
    
    return () => {
      document.removeEventListener('mousedown', lidarCliqueFora);
    };
  }, [mostrarConteudo]);

  return (
    <>
      {}
      <button 
        ref={botaoRef}
        className={`interogacao ${mostrarConteudo ? 'fechar' : ''} cartaoDestaque variacao1`}
        onClick={alternarVisibilidade}
        aria-label={mostrarConteudo ? "Fechar informações" : "Mostrar informações adicionais"}
      >
        {}
        {mostrarConteudo ? '✕' : '?'}
      </button>
      
      {}
      {mostrarConteudo && (
        <div 
          ref={conteudoRef}
          className="conteudo-interrogacao cartaoDestaque variacao3"
        >
          {}
          {children}
        </div>
      )}
    </>
  );
};


export default Interrogacao;

