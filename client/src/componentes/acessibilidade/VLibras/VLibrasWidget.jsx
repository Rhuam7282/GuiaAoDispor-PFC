/* Componente VLibras Widget - Integração com o tradutor de Libras do governo brasileiro */
import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';

/* Componente principal que renderiza o widget VLibras para tradução em Libras */
const VLibrasWidget = forwardRef(({ onStatusChange, isVisible: propIsVisible }, ref) => {
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const unityLoaderScriptRef = useRef(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    translateText,
    translatePageContent,
    restartVlibras: initializeVLibras, // Expose the restart function
  }));

  const updateStatus = useCallback((status, message, progress, error = null) => {
    onStatusChange({ status, message, progress, error });
    setLoadingProgress(progress);
    if (status === 'success') setIsLoaded(true);
    else setIsLoaded(false);
    setLoadError(error);
  }, [onStatusChange]);

  const initializeVLibras = useCallback(() => {
    updateStatus('loading', 'Inicializando VLibras...', 10);
    setLoadAttempts(prev => prev + 1);
    setLoadError(null); // Clear previous errors

    // Cleanup previous script if exists
    if (unityLoaderScriptRef.current && unityLoaderScriptRef.current.parentNode) {
      unityLoaderScriptRef.current.parentNode.removeChild(unityLoaderScriptRef.current);
      unityLoaderScriptRef.current = null;
    }
    // Clear previous player instance
    if (playerRef.current) {
        playerRef.current = null; // Let garbage collector handle it
    }

    // Check if UnityLoader.js is already present, if so, remove it to ensure a fresh load
    let existingScript = document.querySelector('script[src="/target/UnityLoader.js"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = '/target/UnityLoader.js';
    script.async = true;
    unityLoaderScriptRef.current = script; // Keep reference to this script

    script.onload = () => {
      updateStatus('loading', 'UnityLoader.js carregado, inicializando Player...', 50);
      if (window.VLibras && window.VLibras.Player && wrapperRef.current) {
        try {
          // Ensure that the target wrapper is ready
          if (!wrapperRef.current.querySelector('canvas')) { // Check if canvas already exists
            playerRef.current = new window.VLibras.Player({
              target: { name: 'rnp_webgl', path: '/target' }
            });

            playerRef.current.on('load', function () {
              console.log('VLibras Player carregado com sucesso');
              updateStatus('success', 'VLibras Player carregado com sucesso!', 100);
            });

            playerRef.current.on('error', function (err) {
              console.error('Erro no VLibras Player:', err);
              updateStatus('error', `Erro no Player VLibras: ${err.message || 'Desconhecido'}`, 0, err);
            });
            
            playerRef.current.load(wrapperRef.current);
          } else {
              console.log('VLibras Player já parece estar carregado no wrapper.');
              updateStatus('success', 'VLibras Player já ativo!', 100);
          }

        } catch (error) {
          console.error('Erro ao inicializar VLibras Player:', error);
          updateStatus('error', `Falha ao inicializar Player VLibras: ${error.message}`, 0, error);
        }
      } else {
        updateStatus('error', 'VLibras Player API ou wrapper não disponíveis.', 0, new Error('API/Wrapper not found'));
      }
    };

    script.onerror = (e) => {
      console.error('Erro ao carregar UnityLoader.js', e);
      updateStatus('error', 'Falha ao carregar UnityLoader.js. Verifique o caminho ou a conexão.', 0, e);
    };

    document.body.appendChild(script);

  }, [updateStatus, loadAttempts]); // Added loadAttempts to re-trigger if needed

  useEffect(() => {
    // Initial load when component mounts
    initializeVLibras();

    return () => {
      // Cleanup: remove the script if the component unmounts
      if (unityLoaderScriptRef.current && unityLoaderScriptRef.current.parentNode) {
        unityLoaderScriptRef.current.parentNode.removeChild(unityLoaderScriptRef.current);
      }
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy(); // Attempt to destroy player instance
      }
    };
  }, [initializeVLibras]);

  /* Função para traduzir texto usando o player VLibras */
  const translateText = (text) => {
    if (playerRef.current && isLoaded) {
      try {
        playerRef.current.translate(text);
      } catch (error) {
        console.error('Erro ao traduzir texto:', error);
      }
    } else {
        console.warn('VLibras Player não está pronto para traduzir.');
    }
  };

  /* Função para traduzir o título da página (exemplo de uso) */
  const translatePageContent = () => {
    const pageTitle = document.querySelector('h1')?.textContent;
    if (pageTitle) {
      translateText(pageTitle);
    } else {
        console.warn('Nenhum título H1 encontrado para traduzir.');
    }
  };

  return (
    // O container do VLibras só será renderizado se propIsVisible for true
    propIsVisible && (
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          width: '320px', // Set a fixed width for the wrapper
          height: '240px', // Set a fixed height for the wrapper
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
          <h4 style={{ margin: 0, color: '#007bff' }}>VLibras Player</h4>
          {/* O botão de fechar será gerenciado pelo componente pai agora */}
        </div>
        
        <div
          ref={wrapperRef}
          id="vlibras-player-wrapper" // Add an ID for easier identification if needed
          style={{
            width: '300px',
            height: '200px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden', // Ensure content inside doesn't overflow
          }}
        >
          {!isLoaded && !loadError && <p>Carregando VLibras...</p>}
          {loadError && <p style={{ color: 'red' }}>Erro: {loadError.message}</p>}
          {/* O player Unity WebGL será renderizado aqui */}
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
    )
  );
});

/* Exporta o componente para uso em outras partes da aplicação */
export default VLibrasWidget;