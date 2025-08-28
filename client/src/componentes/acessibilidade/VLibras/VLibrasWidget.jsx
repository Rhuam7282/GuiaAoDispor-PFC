import React, { useEffect, useRef, useState } from 'react';

const VLibrasWidget = () => {
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o script UnityLoader.js já foi carregado
    if (document.querySelector('script[src="/target/UnityLoader.js"]')) {
      // Se já foi carregado, inicializa o player VLibras diretamente
      if (window.VLibras && window.VLibras.Player && wrapperRef.current) {
        try {
          playerRef.current = new window.VLibras.Player({
            target: { name: 'rnp_webgl', path: '/target' }
          });

          playerRef.current.on('load', function () {
            console.log('VLibras Player carregado com sucesso');
            setIsLoaded(true);
          });

          playerRef.current.load(wrapperRef.current);
        } catch (error) {
          console.error('Erro ao inicializar VLibras Player:', error);
        }
      }
      return;
    }

    // Carrega o UnityLoader.js se ainda não foi carregado
    const script = document.createElement('script');
    script.src = '/target/UnityLoader.js';
    script.async = true;
    script.onload = () => {
      // Após o carregamento do UnityLoader.js, inicializa o player VLibras
      if (window.VLibras && window.VLibras.Player && wrapperRef.current) {
        try {
          playerRef.current = new window.VLibras.Player({
            target: { name: 'rnp_webgl', path: '/target' }
          });

          playerRef.current.on('load', function () {
            console.log('VLibras Player carregado com sucesso');
            setIsLoaded(true);
          });

          playerRef.current.load(wrapperRef.current);
        } catch (error) {
          console.error('Erro ao inicializar VLibras Player:', error);
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="/target/UnityLoader.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const translateText = (text) => {
    if (playerRef.current && isLoaded) {
      try {
        playerRef.current.translate(text);
      } catch (error) {
        console.error('Erro ao traduzir texto:', error);
      }
    }
  };

  // Exemplo de uso: traduzir texto da página
  const translatePageContent = () => {
    const pageTitle = document.querySelector('h1')?.textContent;
    if (pageTitle) {
      translateText(pageTitle);
    }
  };

  return (
    <>
      {/* Botão para mostrar/ocultar o player */}
      <button
        onClick={toggleVisibility}
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
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}
        title="VLibras - Tradutor de Libras"
      >
        🤟
      </button>

      {/* Player VLibras */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: 'white',
            border: '2px solid #007bff',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}
          >
            <h4 style={{ margin: 0, color: '#007bff' }}>VLibras</h4>
            <button
              onClick={toggleVisibility}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
          
          <div
            ref={wrapperRef}
            style={{
              width: '300px',
              height: '200px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!isLoaded && <p>Carregando VLibras...</p>}
          </div>

          {isLoaded && (
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={translatePageContent}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Traduzir Título da Página
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VLibrasWidget;


