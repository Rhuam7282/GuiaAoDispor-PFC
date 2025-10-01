// /* Componente VLibras Widget - Integração com o tradutor de Libras do governo brasileiro */
// import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
// // import do CSS não é necessário aqui se ele for aplicado ao wrapper externo

// /* Componente principal que renderiza o widget VLibras para tradução em Libras */
// const VLibrasWidget = forwardRef(({ onStatusChange, isVisible: propIsVisible }, ref) => {
//   const playerRef = useRef(null);
//   const wrapperRef = useRef(null);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [loadError, setLoadError] = useState(null);
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const unityLoaderScriptRef = useRef(null);
//   const [isPlayerInitializing, setIsPlayerInitializing] = useState(false);

//   useImperativeHandle(ref, () => ({
//     translateText,
//     translatePageContent,
//     restartVlibras: initializeVLibras,
//   }));

//   const updateStatus = useCallback((status, message, progress, error = null) => {
//     if (typeof onStatusChange === 'function') {
//       onStatusChange({ status, message, progress, error });
//     } else {
//       console.warn("onStatusChange is not a function. Cannot update parent component status.");
//     }
//     setLoadingProgress(progress);
//     setIsLoaded(status === 'success');
//     setLoadError(error);
//   }, [onStatusChange]);

//   const initializeVLibras = useCallback(() => {
//     if (isPlayerInitializing) {
//       console.log('VLibras Player já está em processo de inicialização.');
//       return;
//     }
//     setIsPlayerInitializing(true);
//     updateStatus('loading', 'Inicializando VLibras...', 10);
//     setLoadError(null);

//     // Cleanup Previous Instances
//     if (unityLoaderScriptRef.current && unityLoaderScriptRef.current.parentNode) {
//       unityLoaderScriptRef.current.parentNode.removeChild(unityLoaderScriptRef.current);
//       unityLoaderScriptRef.current = null;
//     }
//     let existingScript = document.querySelector('script[src="/vlibras/UnityLoader.js"]');
//     if (existingScript) {
//       existingScript.remove();
//     }

//     if (playerRef.current && typeof playerRef.current.destroy === 'function') {
//       try {
//         playerRef.current.destroy();
//         console.log('VLibras Player anterior destruído.');
//       } catch (e) {
//         console.warn('Erro ao destruir VLibras Player anterior:', e);
//       } finally {
//         playerRef.current = null;
//       }
//     }
//     if (wrapperRef.current) {
//       wrapperRef.current.innerHTML = '';
//     }
//     // End Cleanup

//     const script = document.createElement('script');
//     script.src = '/vlibras/UnityLoader.js'; // Path from public directory
//     script.async = true;
//     unityLoaderScriptRef.current = script;

//     script.onload = () => {
//       updateStatus('loading', 'UnityLoader.js carregado, inicializando Player...', 50);
//       setTimeout(() => {
//         if (window.VLibras && window.VLibras.Player && wrapperRef.current) {
//           try {
//             if (wrapperRef.current.querySelector('canvas')) {
//               console.warn('Canvas já existe no wrapper. Removendo para nova inicialização.');
//               wrapperRef.current.innerHTML = '';
//             }

//             playerRef.current = new window.VLibras.Player({
//               target: { name: 'rnp_webgl', path: '/vlibras/target' }
//             });

//             playerRef.current.on('load', function () {
//               console.log('VLibras Player carregado com sucesso');
//               updateStatus('success', 'VLibras Player carregado com sucesso!', 100);
//               setIsPlayerInitializing(false);
//             });

//             playerRef.current.on('error', function (err) {
//               console.error('Erro no VLibras Player:', err);
//               updateStatus('error', `Erro no Player VLibras: ${err.message || 'Desconhecido'}`, 0, err);
//               setIsPlayerInitializing(false);
//             });

//             if (typeof playerRef.current.load === 'function') {
//               playerRef.current.load(wrapperRef.current);
//             } else {
//               console.warn('VLibras Player does not have a .load() method, assuming it auto-loads into the target.');
//             }

//           } catch (error) {
//             console.error('Erro ao inicializar VLibras Player:', error);
//             updateStatus('error', `Falha ao inicializar Player VLibras: ${error.message}`, 0, error);
//             setIsPlayerInitializing(false);
//           }
//         } else {
//           const apiError = new Error('VLibras Player API ou wrapper não disponíveis.');
//           console.error(apiError.message);
//           updateStatus('error', apiError.message, 0, apiError);
//           setIsPlayerInitializing(false);
//         }
//       }, 100);
//     };

//     script.onerror = (e) => {
//       console.error('Erro ao carregar UnityLoader.js', e);
//       updateStatus('error', 'Falha ao carregar UnityLoader.js. Verifique o caminho ou a conexão.', 0, e);
//       setIsPlayerInitializing(false);
//     };

//     document.body.appendChild(script);

//   }, [updateStatus, isPlayerInitializing]);

//   useEffect(() => {
//     if (propIsVisible && !isLoaded && !isPlayerInitializing) {
//       initializeVLibras();
//     }
//     if (!propIsVisible && playerRef.current && typeof playerRef.current.destroy === 'function') {
//       try {
//         playerRef.current.destroy();
//         playerRef.current = null;
//         setIsLoaded(false);
//         setIsPlayerInitializing(false);
//         updateStatus('pending', 'VLibras desativado.', 0);
//         if (unityLoaderScriptRef.current && unityLoaderScriptRef.current.parentNode) {
//           unityLoaderScriptRef.current.parentNode.removeChild(unityLoaderScriptRef.current);
//           unityLoaderScriptRef.current = null;
//         }
//         if (wrapperRef.current) {
//           wrapperRef.current.innerHTML = '';
//         }
//       } catch (e) {
//         console.warn('Erro ao destruir VLibras Player ao ocultar:', e);
//       }
//     }

//     return () => {
//       if (playerRef.current && typeof playerRef.current.destroy === 'function') {
//         try {
//           playerRef.current.destroy();
//         } catch (e) {
//           console.warn('Erro ao destruir VLibras Player no unmount:', e);
//         } finally {
//           playerRef.current = null;
//         }
//       }
//       if (unityLoaderScriptRef.current && document.body.contains(unityLoaderScriptRef.current)) {
//         document.body.removeChild(unityLoaderScriptRef.current);
//       }
//       unityLoaderScriptRef.current = null;

//       let existingScript = document.querySelector('script[src="/vlibras/UnityLoader.js"]');
//       if (existingScript && document.body.contains(existingScript)) {
//         existingScript.remove();
//       }
//       if (wrapperRef.current) {
//         wrapperRef.current.innerHTML = '';
//       }
//       setIsLoaded(false);
//       setIsPlayerInitializing(false);
//     };
//   }, [propIsVisible, initializeVLibras, isLoaded, isPlayerInitializing, updateStatus]);

//   const translateText = (text) => {
//     if (playerRef.current && isLoaded) {
//       try {
//         playerRef.current.translate(text);
//       } catch (error) {
//         console.error('Erro ao traduzir texto:', error);
//       }
//     } else {
//       console.warn('VLibras Player não está pronto para traduzir.');
//     }
//   };

//   const translatePageContent = () => {
//     const pageTitle = document.querySelector('h1')?.textContent;
//     if (pageTitle) {
//       translateText(pageTitle);
//     } else {
//       console.warn('Nenhum título H1 encontrado para traduzir.');
//     }
//   };

//   return (
//     propIsVisible && (
//       <div id="vlibras-wrapper"> {/* Use o ID para estilizar via CSS externo */}
//         <div
//           ref={wrapperRef}
//           id="vlibras-player-container" // Adicione um ID para o contêiner interno
//           style={{
//             width: '100%', // 100% da div #vlibras-wrapper
//             height: '100%', // 100% da div #vlibras-wrapper
//             backgroundColor: '#f8f9fa',
//             border: '1px solid #dee2e6',
//             borderRadius: '4px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             overflow: 'hidden',
//           }}
//         >
//           {!isLoaded && !loadError && !isPlayerInitializing && <p>Aguardando inicialização do VLibras...</p>}
//           {!isLoaded && isPlayerInitializing && <p>Carregando VLibras...</p>}
//           {loadError && <p style={{ color: 'red' }}>Erro: {loadError.message}</p>}
//         </div>
//         {/* O botão de tradução deve ser chamado via useImperativeHandle pelo hook ou renderizado no componente pai.
//             Se você quer um botão aqui, ele vai estar dentro da área do VLibras, o que não é ideal.
//             Removi este botão pois a lógica de tradução é chamada do `useVLibras`.
//         */}
//       </div>
//     )
//   );
// });

// export default VLibrasWidget;