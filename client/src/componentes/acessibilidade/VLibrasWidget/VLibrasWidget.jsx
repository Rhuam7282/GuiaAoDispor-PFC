// src/componentes/acessibilidade/VLibrasWidget/VLibrasWidget.jsx
import { useEffect, useState } from 'react';
import { Volume2, RotateCcw, Eye, EyeOff } from 'lucide-react';
import 'VLibrasWidget.css';

const VLibrasWidget = () => {
  const [vlibrasAtivo, setVlibrasAtivo] = useState(false);
  const [vlibrasCarregado, setVlibrasCarregado] = useState(false);
  const [vlibrasVisivel, setVlibrasVisivel] = useState(true);
  const [statusCarregamento, setStatusCarregamento] = useState('');

  // Função para carregar o script do VLibras
  const carregarVLibras = () => {
    return new Promise((resolve, reject) => {
      // Verificar se já existe um script VLibras carregado
      const scriptExistente = document.querySelector('script[src*="vlibras"]');
      if (scriptExistente) {
        scriptExistente.remove();
      }

      // Remover elementos VLibras existentes
      const elementosVLibras = document.querySelectorAll('[vw], [vw-access-button], [vw-plugin-wrapper]');
      elementosVLibras.forEach(elemento => elemento.remove());

      setStatusCarregamento('Carregando VLibras...');

      // Criar o HTML necessário para o VLibras
      const vlibrasContainer = document.createElement('div');
      vlibrasContainer.setAttribute('vw', '');
      vlibrasContainer.className = 'enabled';
      vlibrasContainer.innerHTML = `
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
          <div class="vw-plugin-top-wrapper"></div>
        </div>
      `;

      // Adicionar o container ao body
      document.body.appendChild(vlibrasContainer);

      // Carregar o script do VLibras
      const script = document.createElement('script');
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.onload = () => {
        try {
          // Inicializar o VLibras Widget
          if (window.VLibras && window.VLibras.Widget) {
            new window.VLibras.Widget('https://vlibras.gov.br/app');
            setVlibrasCarregado(true);
            setStatusCarregamento('VLibras carregado com sucesso!');
            resolve();
          } else {
            throw new Error('VLibras Widget não encontrado');
          }
        } catch (error) {
          console.error('Erro ao inicializar VLibras:', error);
          setStatusCarregamento('Erro ao carregar VLibras');
          reject(error);
        }
      };
      script.onerror = () => {
        const erro = new Error('Falha ao carregar script do VLibras');
        console.error(erro);
        setStatusCarregamento('Falha ao carregar VLibras');
        reject(erro);
      };

      document.head.appendChild(script);
    });
  };

  // Função para remover o VLibras
  const removerVLibras = () => {
    // Remover script
    const script = document.querySelector('script[src*="vlibras"]');
    if (script) {
      script.remove();
    }

    // Remover elementos VLibras
    const elementosVLibras = document.querySelectorAll('[vw], [vw-access-button], [vw-plugin-wrapper], .vw-plugin-top-wrapper');
    elementosVLibras.forEach(elemento => elemento.remove());

    // Remover estilos VLibras
    const estilosVLibras = document.querySelectorAll('style[id*="vlibras"], link[href*="vlibras"]');
    estilosVLibras.forEach(estilo => estilo.remove());

    setVlibrasCarregado(false);
    setStatusCarregamento('VLibras desativado');
  };

  // Função para alternar VLibras
  const alternarVLibras = async () => {
    if (vlibrasAtivo) {
      removerVLibras();
      setVlibrasAtivo(false);
    } else {
      try {
        await carregarVLibras();
        setVlibrasAtivo(true);
      } catch (error) {
        console.error('Erro ao ativar VLibras:', error);
        setVlibrasAtivo(false);
      }
    }
  };

  // Função para reiniciar VLibras
  const reiniciarVLibras = async () => {
    if (vlibrasAtivo) {
      removerVLibras();
      try {
        await carregarVLibras();
        setStatusCarregamento('VLibras reiniciado com sucesso!');
      } catch (error) {
        console.error('Erro ao reiniciar VLibras:', error);
        setVlibrasAtivo(false);
      }
    }
  };

  // Função para alternar visibilidade do widget
  const alternarVisibilidade = () => {
    const botaoVLibras = document.querySelector('[vw-access-button]');
    if (botaoVLibras) {
      if (vlibrasVisivel) {
        botaoVLibras.style.display = 'none';
      } else {
        botaoVLibras.style.display = 'block';
      }
      setVlibrasVisivel(!vlibrasVisivel);
    }
  };

  // Cleanup ao desmontar o componente
  useEffect(() => {
    return () => {
      if (vlibrasAtivo) {
        removerVLibras();
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
              disabled={!vlibrasCarregado}
            >
              <RotateCcw size={16} />
              Reiniciar
            </button>

            <button
              onClick={alternarVisibilidade}
              className="botao-visibilidade"
              title={vlibrasVisivel ? 'Ocultar Widget' : 'Mostrar Widget'}
              disabled={!vlibrasCarregado}
            >
              {vlibrasVisivel ? <EyeOff size={16} /> : <Eye size={16} />}
              {vlibrasVisivel ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        )}

        {statusCarregamento && (
          <div className="status-vlibras">
            <span className={`status-texto ${vlibrasCarregado ? 'sucesso' : vlibrasAtivo ? 'carregando' : 'inativo'}`}>
              {statusCarregamento}
            </span>
          </div>
        )}
      </div>

      {vlibrasAtivo && (
        <div className="vlibras-info">
          <p className="info-texto">
            O VLibras traduz automaticamente o conteúdo da página para Língua Brasileira de Sinais (Libras).
            Clique no ícone azul que aparece no canto da tela para usar.
          </p>
        </div>
      )}
    </div>
  );
};

export default VLibrasWidget;

