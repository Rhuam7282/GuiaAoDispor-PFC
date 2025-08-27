import React, { useEffect, useRef, useState } from 'react';

const VLibrasWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const initVLibras = () => {
      if (window.VLibras) {
        playerRef.current = new window.VLibras.Player({
          targetPath: '/target',
          translator: 'https://traducao2-dth.vlibras.gov.br/dl/translate'
        });
        
        const wrapper = document.createElement('div');
        wrapper.id = 'vlibras-wrapper';
        document.body.appendChild(wrapper);

        playerRef.current.load(wrapper);
        setIsLoaded(true);
      }
    };

    if (!document.querySelector('script[src="/vlibras.js"]')) {
      const script = document.createElement('script');
      script.src = '/vlibras.js';
      script.async = true;
      script.onload = initVLibras;
      document.body.appendChild(script);
    } else {
      initVLibras();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, []);

  const translateText = (text) => {
    if (playerRef.current && isLoaded) {
      playerRef.current.translate(text);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
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
            width: '300px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>VLibras</h4>
            <button onClick={() => setIsVisible(false)} style={{ background: 'none', border: 'none', fontSize: '18px' }}>
              ✕
            </button>
          </div>
          <div id="vlibras-player" style={{ height: '200px', margin: '10px 0' }}></div>
          <button
            onClick={() => translateText(document.title)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Traduzir Página
          </button>
        </div>
      )}
    </>
  );
};

export default VLibrasWidget;