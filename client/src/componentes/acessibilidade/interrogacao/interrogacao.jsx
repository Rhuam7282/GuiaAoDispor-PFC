import React, { useState, useRef, useEffect } from 'react';

const Interrogacao = ({ children }) => {
  const [mostrarConteudo, setMostrarConteudo] = useState(false);
  const [posicao, setPosicao] = useState({ x: 0, y: 0 });
  const botaoRef = useRef(null);
  const conteudoRef = useRef(null);
  
  const alternarVisibilidade = (e) => {
    if (botaoRef.current) {
      const rect = botaoRef.current.getBoundingClientRect();
      setPosicao({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
      });
    }
    setMostrarConteudo(!mostrarConteudo);
  };

  useEffect(() => {
    const lidarCliqueFora = (evento) => {
      if (conteudoRef.current && !conteudoRef.current.contains(evento.target)) {
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
      <button 
        ref={botaoRef}
        className="interogacao" 
        onClick={alternarVisibilidade}
        aria-label="Mostrar informações adicionais"
      >
        ?
      </button>
      
      {mostrarConteudo && (
        <div 
          ref={conteudoRef}
          className="cartaoDestaque variacao3 conteudo-interrogacao"
          style={{
            position: 'fixed',
            top: `${posicao.y}px`,
            left: `${posicao.x}px`,
            transform: 'translate(-100%, -100%)'
          }}
        >
          <div 
            className="conteudo-editavel" 
            contentEditable
            suppressContentEditableWarning={true}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Interrogacao;