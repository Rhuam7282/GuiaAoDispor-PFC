/* Componente VLibras Widget - Integração com o tradutor de Libras do governo brasileiro */
import React, { useEffect, useRef, useState } from 'react';

/* Componente principal que renderiza o widget VLibras para tradução em Libras */
const VLibrasWidget = () => {
  /* Referência para o player do VLibras */
  const reprodutorRef = useRef(null);
  
  /* Referência para o elemento que envolve o player */
  const envolvedor = useRef(null);
  
  /* Estado para controlar se o VLibras foi carregado com sucesso */
  const [estaCarregado, setEstaCarregado] = useState(false);
  
  /* Estado para controlar se o painel do VLibras está visível */
  const [estaVisivel, setEstaVisivel] = useState(false);

  /* Hook para inicializar o VLibras quando o componente é montado */
  useEffect(() => {
    /* Verifica se o script UnityLoader.js já foi carregado */
    if (document.querySelector('script[src="/target/UnityLoader.js"]')) {
      /* Se já foi carregado, inicializa o player VLibras diretamente */
      if (window.VLibras && window.VLibras.Player && envolvedor.current) {
        try {
          /* Cria uma nova instância do player VLibras */
          reprodutorRef.current = new window.VLibras.Player({
            target: { name: 'rnp_webgl', path: '/target' }
          });

          /* Define callback para quando o player for carregado */
          reprodutorRef.current.on('load', function () {
            console.log('VLibras Player carregado com sucesso');
            setEstaCarregado(true);
          });

          /* Carrega o player no elemento envolvedor */
          reprodutorRef.current.load(envolvedor.current);
        } catch (error) {
          console.error('Erro ao inicializar VLibras Player:', error);
        }
      }
      return;
    }

    /* Carrega o UnityLoader.js se ainda não foi carregado */
    const script = document.createElement('script');
    script.src = '/target/UnityLoader.js';
    script.async = true;
    
    /* Callback executado após o carregamento do script */
    script.onload = () => {
      /* Após o carregamento do UnityLoader.js, inicializa o player VLibras */
      if (window.VLibras && window.VLibras.Player && envolvedor.current) {
        try {
          reprodutorRef.current = new window.VLibras.Player({
            target: { name: 'rnp_webgl', path: '/target' }
          });

          reprodutorRef.current.on('load', function () {
            console.log('VLibras Player carregado com sucesso');
            setEstaCarregado(true);
          });

          reprodutorRef.current.load(envolvedor.current);
        } catch (error) {
          console.error('Erro ao inicializar VLibras Player:', error);
        }
      }
    };
    
    /* Adiciona o script ao documento */
    document.body.appendChild(script);

    /* Cleanup: remove o script quando o componente é desmontado */
    return () => {
      const existingScript = document.querySelector('script[src="/target/UnityLoader.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  /* Função para alternar a visibilidade do painel VLibras */
  const alternarVisibilidade = () => {
    setEstaVisivel(!estaVisivel);
  };

  /* Função para traduzir texto específico usando o VLibras */
  const traduzirTexto = (texto) => {
    /* Verifica se o player está carregado antes de traduzir */
    if (reprodutorRef.current && estaCarregado) {
      try {
        reprodutorRef.current.translate(texto);
      } catch (error) {
        console.error('Erro ao traduzir texto:', error);
      }
    }
  };

  /* Função para traduzir o conteúdo da página atual */
  const traduzirConteudoPagina = () => {
    /* Busca o título principal da página */
    const tituloPagina = document.querySelector('h1')?.textContent;
    if (tituloPagina) {
      traduzirTexto(tituloPagina);
    }
  };

  return (
    <>
      {/* Botão flutuante para abrir/fechar o painel VLibras */}
      <button
        onClick={alternarVisibilidade}
        style={{
          position: 'fixed', /* Posicionamento fixo no canto inferior direito */
          bottom: '20px',
          right: '20px',
          zIndex: 10000, /* Z-index alto para ficar sobre outros elementos */
          backgroundColor: '#007bff', /* Cor azul padrão */
          color: 'white',
          border: 'none',
          borderRadius: '50%', /* Formato circular */
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)' /* Sombra para destaque */
        }}
        title="VLibras - Tradutor de Libras"
      >
        🤟 {/* Emoji de mão em Libras */}
      </button>

      {/* Painel do VLibras - renderizado condicionalmente quando visível */}
      {estaVisivel && (
        <div
          style={{
            position: 'fixed', /* Posicionado acima do botão */
            bottom: '90px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: 'white',
            border: '2px solid #007bff',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)' /* Sombra mais pronunciada */
          }}
        >
          {/* Cabeçalho do painel com título e botão de fechar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}
          >
            <h4 style={{ margin: 0, color: '#007bff' }}>VLibras</h4>
            {/* Botão para fechar o painel */}
            <button
              onClick={alternarVisibilidade}
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
          
          {/* Área onde o player VLibras será renderizado */}
          <div
            ref={envolvedor}
            style={{
              width: '300px',
              height: '200px',
              backgroundColor: '#f8f9fa', /* Fundo claro */
              border: '1px solid #dee2e6', /* Borda sutil */
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Mensagem de carregamento exibida enquanto o VLibras não está pronto */}
            {!estaCarregado && <p>Carregando VLibras...</p>}
          </div>

          {/* Botão de tradução - exibido apenas quando o VLibras está carregado */}
          {estaCarregado && (
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={traduzirConteudoPagina}
                style={{
                  backgroundColor: '#28a745', /* Cor verde para ação positiva */
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

/* Exporta o componente para uso em outras partes da aplicação */
export default VLibrasWidget;

