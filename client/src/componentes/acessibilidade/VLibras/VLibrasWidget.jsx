import React, { useEffect, useRef, useState } from 'react';

const VLibrasWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Carrega o plugin oficial do VLibras
    const loadVLibras = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        setIsLoaded(true);
        return;
      }

      // Adiciona o script principal do VLibras
      const script = document.createElement('script');
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      script.onload = () => {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        setIsLoaded(true);
      };
      
      document.head.appendChild(script);
    };

    loadVLibras();

    return () => {
      // Limpeza opcional se necessário
    };
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* Botão de acionamento do VLibras */}
      <div vw="true" className="enabled">
        <div vw-access-button="true" className="active" 
             style={{
               position: 'fixed',
               bottom: '20px',
               right: '20px',
               zIndex: 10000,
               backgroundColor: '#007bff',
               color: 'white',
               border: 'none',
               borderRadius: '50%',
               width: '60px',
               height: '60px',
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center'
             }}
             onClick={toggleVisibility}
             title="VLibras - Tradutor de Libras">
          <span style={{ fontSize: '24px' }}>🤟</span>
        </div>
        
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>

      {/* Mensagem de carregamento */}
      {!isLoaded && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          Carregando VLibras...
        </div>
      )}
    </>
  );
};

export default VLibrasWidget;