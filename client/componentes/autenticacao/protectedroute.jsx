import { useState, useEffect, useCallback, useRef } from 'react';

const useVLibras = () => {
  const [vlibrasVisibility, setVlibrasVisibility] = useState(false);
  const [vlibrasStatus, setVlibrasStatus] = useState({
    status: 'idle', // 'idle', 'loading', 'ready', 'error'
    message: 'VLibras desativado',
    progress: 0,
    error: null
  });
  
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);

  // Função para carregar o script VLibras
  const loadVLibrasScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      // Verificar se o script já foi carregado
      if (window.VLibras) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = '/vlibras/vlibras.js';
      script.onload = () => {
        console.log('VLibras script carregado com sucesso');
        resolve();
      };
      script.onerror = () => {
        console.error('Erro ao carregar script VLibras');
        reject(new Error('Falha ao carregar script VLibras'));
      };
      
      document.head.appendChild(script);
    });
  }, []);

  // Função para inicializar o player VLibras
  const initializeVLibras = useCallback(async () => {
    try {
      setVlibrasStatus({
        status: 'loading',
        message: 'Carregando VLibras...',
        progress: 25,
        error: null
      });

      // Carregar o script se necessário
      await loadVLibrasScript();

      setVlibrasStatus(prev => ({
        ...prev,
        progress: 50,
        message: 'Inicializando player...'
      }));

      // Criar wrapper se não existir
      if (!wrapperRef.current) {
        wrapperRef.current = document.createElement('div');
        wrapperRef.current.id = 'vlibras-wrapper';
        wrapperRef.current.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 200px;
          height: 200px;
          z-index: 9999;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        `;
        document.body.appendChild(wrapperRef.current);
      }

      setVlibrasStatus(prev => ({
        ...prev,
        progress: 75,
        message: 'Configurando player...'
      }));

      // Inicializar o player VLibras
      if (window.VLibras && window.VLibras.Player) {
        playerRef.current = new window.VLibras.Player({
          targetPath: '/vlibras/target',
          onLoad: () => {
            setVlibrasStatus({
              status: 'ready',
              message: 'VLibras pronto para uso',
              progress: 100,
              error: null
            });
          }
        });

        // Configurar eventos do player
        playerRef.current.on('load', () => {
          console.log('VLibras player carregado');
        });

        playerRef.current.on('error', (error) => {
          console.error('Erro no VLibras player:', error);
          setVlibrasStatus({
            status: 'error',
            message: 'Erro no VLibras',
            progress: 0,
            error: error
          });
        });

        // Carregar o player no wrapper
        playerRef.current.load(wrapperRef.current);

        setVlibrasStatus(prev => ({
          ...prev,
          progress: 100,
          message: 'VLibras carregado com sucesso'
        }));

      } else {
        throw new Error('VLibras não está disponível');
      }

    } catch (error) {
      console.error('Erro ao inicializar VLibras:', error);
      setVlibrasStatus({
        status: 'error',
        message: 'Falha ao carregar VLibras',
        progress: 0,
        error: error
      });
    }
  }, [loadVLibrasScript]);

  // Função para alternar visibilidade do VLibras
  const toggleVlibrasVisibility = useCallback(async () => {
    if (!vlibrasVisibility) {
      setVlibrasVisibility(true);
      await initializeVLibras();
    } else {
      setVlibrasVisibility(false);
      
      // Remover wrapper se existir
      if (wrapperRef.current) {
        wrapperRef.current.remove();
        wrapperRef.current = null;
      }
      
      // Reset do player
      playerRef.current = null;
      
      setVlibrasStatus({
        status: 'idle',
        message: 'VLibras desativado',
        progress: 0,
        error: null
      });
    }
  }, [vlibrasVisibility, initializeVLibras]);

  // Função para reiniciar VLibras
  const reiniciarVLibras = useCallback(async () => {
    if (vlibrasVisibility) {
      // Remover wrapper atual
      if (wrapperRef.current) {
        wrapperRef.current.remove();
        wrapperRef.current = null;
      }
      
      playerRef.current = null;
      
      // Reinicializar
      await initializeVLibras();
    }
  }, [vlibrasVisibility, initializeVLibras]);

  // Função para obter ícone do status
  const obterIconeStatusVLibras = useCallback(() => {
    switch (vlibrasStatus.status) {
      case 'loading':
        return '⏳';
      case 'ready':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⚪';
    }
  }, [vlibrasStatus.status]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.remove();
      }
    };
  }, []);

  return {
    vlibrasVisibility,
    vlibrasStatus,
    toggleVlibrasVisibility,
    reiniciarVLibras,
    obterIconeStatusVLibras,
    player: playerRef.current
  };
};

export default useVLibras;

