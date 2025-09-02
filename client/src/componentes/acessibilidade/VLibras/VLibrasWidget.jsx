/* Componente VLibras Widget - Integração com o tradutor de Libras do governo brasileiro */
import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';

/* Componente principal que renderiza o widget VLibras para tradução em Libras */
const VLibrasWidget = forwardRef(({ onStatusChange, isVisible: propIsVisible }, ref) => {
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const unityLoaderScriptRef = useRef(null);
  const [isPlayerInitializing, setIsPlayerInitializing] = useState(false); // New state to prevent re-initialization

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    translateText,
    translatePageContent,
    restartVlibras: initializeVLibras, // Expose the restart function
  }));

  const updateStatus = useCallback((status, message, progress, error = null) => {
    // Adiciona verificação para garantir que onStatusChange é uma função antes de chamar
    if (typeof onStatusChange === 'function') {
      onStatusChange({ status, message, progress, error });
    } else {
      console.warn("onStatusChange is not a function. Cannot update parent component status.");
    }
    setLoadingProgress(progress);
    setIsLoaded(status === 'success');
    setLoadError(error);
  }, [onStatusChange]);

  const initializeVLibras = useCallback(() => {
    if (isPlayerInitializing) {
      console.log('VLibras Player já está em processo de inicialização.');
      return;
    }
    setIsPlayerInitializing(true);
    updateStatus('loading', 'Inicializando VLibras...', 10);
    setLoadError(null); // Clear previous errors

    // --- Cleanup Previous Instances ---
    // 1. Remove existing script if present
    if (unityLoaderScriptRef.current && unityLoaderScriptRef.current.parentNode) {
      unityLoaderScriptRef.current.parentNode.removeChild(unityLoaderScriptRef.current);
      unityLoaderScriptRef.current = null;
    }
    let existingScript = document.querySelector('script[src="/target/UnityLoader.js"]');
    if (existingScript) {
      existingScript.remove();
    }

    // 2. Destroy previous player instance
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      try {
        playerRef.current.destroy();
        console.log('VLibras Player anterior destruído.');
      } catch (e) {
        console.warn('Erro ao destruir VLibras Player anterior:', e);
      } finally {
        playerRef.current = null;
      }
    }
    // 3. Clear the wrapper content to ensure a clean slate for the new player
    if (wrapperRef.current) {
      wrapperRef.current.innerHTML = '';
    }
    // --- End Cleanup ---

    const script = document.createElement('script');
    script.src = '@/public/vlibras/UnityLoader.js'; // Ensure this path is correct relative to your public directory
    script.async = true;
    unityLoaderScriptRef.current = script; // Keep reference to this script

    script.onload = () => {
      updateStatus('loading', 'UnityLoader.js carregado, inicializando Player...', 50);
      // Give a small delay to ensure window.VLibras is fully available
      setTimeout(() => {
        if (window.VLibras && window.VLibras.Player && wrapperRef.current) {
          try {
            // Check if a canvas or other player elements already exist in the wrapper,
            // which might indicate a previous successful load or a problem.
            // Clear it again just in case the wrapper wasn't fully cleared or something re-rendered.
            if (wrapperRef.current.querySelector('canvas')) {
              console.warn('Canvas já existe no wrapper. Removendo para nova inicialização.');
              wrapperRef.current.innerHTML = ''; // Force clear
            }

            playerRef.current = new window.VLibras.Player({
              target: { name: 'rnp_webgl', path: '/target' }
            });

            playerRef.current.on('load', function () {
              console.log('VLibras Player carregado com sucesso');
              updateStatus('success', 'VLibras Player carregado com sucesso!', 100);
              setIsPlayerInitializing(false); // Reset initialization state on success
            });

            playerRef.current.on('error', function (err) {
              console.error('Erro no VLibras Player:', err);
              updateStatus('error', `Erro no Player VLibras: ${err.message || 'Desconhecido'}`, 0, err);
              setIsPlayerInitializing(false); // Reset initialization state on error
            });

            // Append the wrapper DOM element to the player, not directly call load on the wrapper.
            // The VLibras Player constructor usually handles injecting its content into the target.
            // If the VLibras.Player API requires explicitly calling .load(wrapperRef.current), keep it.
            // Assuming current VLibras API expects `target.path` for WebGL assets and injects into DOM.
            // It's common for these types of players to take a DOM element or ID for where to render.
            // Let's assume the current setup for `new window.VLibras.Player` is correct for the API.
            // If it still doesn't show, you might need to find a specific `.renderTo(wrapperRef.current)` or similar.

            // The .load() method is typically what starts the WebGL app.
            if (typeof playerRef.current.load === 'function') {
              playerRef.current.load(wrapperRef.current);
            } else {
              console.warn('VLibras Player does not have a .load() method, assuming it auto-loads into the target.');
              // If it auto-loads and still doesn't show, this might be the place to
              // manually append the canvas if the player creates it but doesn't append.
            }

          } catch (error) {
            console.error('Erro ao inicializar VLibras Player:', error);
            updateStatus('error', `Falha ao inicializar Player VLibras: ${error.message}`, 0, error);
            setIsPlayerInitializing(false); // Reset initialization state on error
          }
        } else {
          const apiError = new Error('VLibras Player API ou wrapper não disponíveis.');
          console.error(apiError.message);
          updateStatus('error', apiError.message, 0, apiError);
          setIsPlayerInitializing(false); // Reset initialization state on error
        }
      }, 100); // Small delay
    };

    script.onerror = (e) => {
      console.error('Erro ao carregar UnityLoader.js', e);
      updateStatus('error', 'Falha ao carregar UnityLoader.js. Verifique o caminho ou a conexão.', 0, e);
      setIsPlayerInitializing(false); // Reset initialization state on error
    };

    document.body.appendChild(script);

  }, [updateStatus, isPlayerInitializing]); // Added isPlayerInitializing to dependency array

  useEffect(() => {
    // Only try to initialize if propIsVisible is true AND player is not already loaded AND not currently initializing
    if (propIsVisible && !isLoaded && !isPlayerInitializing) {
      initializeVLibras();
    }
    // If propIsVisible becomes false, we should destroy the player if it exists
    if (!propIsVisible && playerRef.current && typeof playerRef.current.destroy === 'function') {
      try {
        playerRef.current.destroy();
        playerRef.current = null;
        setIsLoaded(false);
        setIsPlayerInitializing(false);
        updateStatus('pending', 'VLibras desativado.', 0);
        // Also remove the script if it was added
        if (unityLoaderScriptRef.current && unityLoaderScriptRef.current.parentNode) {
          unityLoaderScriptRef.current.parentNode.removeChild(unityLoaderScriptRef.current);
          unityLoaderScriptRef.current = null;
        }
        if (wrapperRef.current) {
          wrapperRef.current.innerHTML = '';
        }
      } catch (e) {
        console.warn('Erro ao destruir VLibras Player ao ocultar:', e);
      }
    }

    return () => {
      // Cleanup on unmount
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn('Erro ao destruir VLibras Player no unmount:', e);
        }
      }
      playerRef.current = null; if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {
          console.warn('Erro ao destruir VLibras Player no unmount:', e);
        }
      }
      if (unityLoaderScriptRef.current && unityLoaderScriptRef.current.parentNode) {
        unityLoaderScriptRef.current.parentNode.removeChild(unityLoaderScriptRef.current);
        unityLoaderScriptRef.current = null;
      }
      if (wrapperRef.current) {
        wrapperRef.current.innerHTML = '';
      }
      setIsLoaded(false);
      setIsPlayerInitializing(false);

    };
    if (unityLoaderScriptRef.current && document.body.contains(unityLoaderScriptRef.current)) {
      document.body.removeChild(unityLoaderScriptRef.current);
    }
    unityLoaderScriptRef.current = null;

    let existingScript = document.querySelector('script[src="/target/UnityLoader.js"]');
    if (existingScript && document.body.contains(existingScript)) {
      existingScript.remove();
    }
  }, [propIsVisible, initializeVLibras, isLoaded, isPlayerInitializing, updateStatus]);


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
          {/* Mensagens de status apenas se o player não estiver carregado e o wrapper for o alvo */}
          {!isLoaded && !loadError && !isPlayerInitializing && <p>Aguardando inicialização do VLibras...</p>}
          {!isLoaded && isPlayerInitializing && <p>Carregando VLibras...</p>}
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