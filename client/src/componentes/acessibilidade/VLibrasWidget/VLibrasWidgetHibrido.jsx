// src/componentes/acessibilidade/VLibrasWidget/VLibrasWidgetHibrido.jsx
import { useEffect, useState } from 'react';
import { Volume2, RotateCcw, Wifi, WifiOff } from 'lucide-react';
import 'VLibrasWidget.css';

const VLibrasWidgetHibrido = () => {
  const [vlibrasAtivo, setVlibrasAtivo] = useState(false);
  const [statusCarregamento, setStatusCarregamento] = useState('');
  const [fonteUsada, setFonteUsada] = useState(''); // 'local' ou 'cdn'

  // Função para tentar carregar VLibras local primeiro
  const tentarCarregarLocal = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
     script.src = 
'/vlibras/vlibras.js'; // Arquivo local em public/vlibras/
      
      script.onload = () => {
        console.log('✅ VLibras local carregado');
        setFonteUsada('local');
        resolve('local');
      };
      
      script.onerror = () => {
        console.log('❌ VLibras local falhou, tentando CDN...');
        script.remove();
        reject('local_failed');
      };
      
      document.head.appendChild(script);
    });
  };

  // Função para carregar VLibras da CDN
  const carregarDaCDN = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      
      script.onload = ( ) => {
        console.log('✅ VLibras CDN carregado');
        setFonteUsada('cdn');
        resolve('cdn');
      };
      
      script.onerror = () => {
        console.log('❌ VLibras CDN falhou');
        reject('cdn_failed');
      };
      
      document.head.appendChild(script);
    });
  };

  // Função principal para inicializar VLibras
  const inicializarVLibras = async () => {
    // Limpar qualquer instância anterior
    limparVLibras();
    setStatusCarregamento('Inicializando VLibras...');

    try {
      // 1. Tentar carregar local primeiro
      try {
        await tentarCarregarLocal();
        setStatusCarregamento('VLibras local carregado, inicializando...');
      } catch (error) {
        // 2. Se local falhar, tentar CDN
        await carregarDaCDN();
        setStatusCarregamento('VLibras CDN carregado, inicializando...');
      }

      // 3. Criar estrutura HTML oficial
      const vlibrasDiv = document.createElement('div');
      vlibrasDiv.setAttribute('vw', '');
      vlibrasDiv.className = 'enabled';
      
      vlibrasDiv.innerHTML = `
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
          <div class="vw-plugin-top-wrapper"></div>
        </div>
      `;

      document.body.appendChild(vlibrasDiv);

      // 4. Aguardar e inicializar
      setTimeout(() => {
        try {
          if (window.VLibras && window.VLibras.Widget) {
            // Para versão local, pode precisar de URL diferente
            const targetUrl = fonteUsada === 'local' 
              ? '/vlibras/target' 
              : 'https://vlibras.gov.br/app';
            
            new window.VLibras.Widget(targetUrl);
            
            setStatusCarregamento(`✅ VLibras ativo (${fonteUsada === 'local' ? 'Local' : 'Online'})! Procure pelo ícone azul.`);
            console.log(`✅ VLibras inicializado com sucesso (fonte: ${fonteUsada})`);
          } else {
            throw new Error('VLibras não disponível no window');
          }
        } catch (error) {
          console.error('❌ Erro na inicialização:', error);
          setStatusCarregamento('❌ Erro ao inicializar VLibras');
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Falha completa ao carregar VLibras:', error);
      setStatusCarregamento('❌ Não foi possível carregar VLibras (local ou online)');
    }
  };

  // Função para limpar VLibras
  const limparVLibras = () => {
    // Remover scripts
    const scripts = document.querySelectorAll('script[src*="vlibras"]');
    scripts.forEach(script => script.remove());

    // Remover elementos VLibras
    const elementos = document.querySelectorAll('[vw], [vw-access-button], [vw-plugin-wrapper], .vw-plugin-top-wrapper');
    elementos.forEach(elemento => elemento.remove());

    // Remover estilos VLibras
    const estilos = document.querySelectorAll('style[id*="vlibras"], link[href*="vlibras"]');
    estilos.forEach(estilo => estilo.remove());

    // Limpar variáveis globais
    if (window.VLibras) {
      delete window.VLibras;
    }

    setFonteUsada('');
  };

  // Função para alternar VLibras
  const alternarVLibras = () => {
    if (vlibrasAtivo) {
      limparVLibras();
      setVlibrasAtivo(false);
      setStatusCarregamento('VLibras desativado');
    } else {
      setVlibrasAtivo(true);
      inicializarVLibras();
    }
  };

  // Função para reiniciar VLibras
  const reiniciarVLibras = () => {
    if (vlibrasAtivo) {
      limparVLibras();
      setTimeout(() => {
        inicializarVLibras();
      }, 500);
    }
  };

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (vlibrasAtivo) {
        limparVLibras();
      }
    };
  }, []);

  return (
    <div className="secao">
      <Volume2 size={16} />
      <h4>VLibras - Tradução para Libras</h4>
      
      <div className="vlibras-controles">
        <button
          onClick={alternarVLibras}
          className={`botao-vlibras ${vlibrasAtivo ? 'ativo' : ''}`}
          aria-pressed={vlibrasAtivo}
          title={vlibrasAtivo ? 'Desativar VLibras' : 'Ativar VLibras'}
        >
          {vlibrasAtivo ? 'Desativar VLibras' : 'Ativar VLibras'}
        </button>

        {vlibrasAtivo && (
          <div className="vlibras-opcoes">
            <button
              onClick={reiniciarVLibras}
              className="botao-reiniciar"
              title="Reiniciar VLibras"
            >
              <RotateCcw size={16} />
              Reiniciar
            </button>

            {fonteUsada && (
              <div className="fonte-info">
                {fonteUsada === 'local' ? (
                  <span title="Usando arquivo local">
                    <WifiOff size={14} /> Local
                  </span>
                ) : (
                  <span title="Usando CDN online">
                    <Wifi size={14} /> Online
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {statusCarregamento && (
          <div className="status-vlibras">
            <span className={`status-texto ${vlibrasAtivo ? 'ativo' : 'inativo'}`}>
              {statusCarregamento}
            </span>
          </div>
        )}
      </div>

      {vlibrasAtivo && (
        <div className="vlibras-info">
          <p className="info-texto">
            <strong>Como usar:</strong> Procure pelo <strong>ícone azul</strong> na tela 
            (geralmente no canto inferior direito). Clique nele para ver a tradução em Libras.
          </p>
          
          {fonteUsada === 'local' && (
            <p className="info-texto" style={{color: '#28a745'}}>
              🔒 <strong>Modo Offline:</strong> Usando arquivo local
            </p>
          )}
          
          {fonteUsada === 'cdn' && (
            <p className="info-texto" style={{color: '#007bff'}}>
              🌐 <strong>Modo Online:</strong> Usando CDN oficial
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VLibrasWidgetHibrido;
