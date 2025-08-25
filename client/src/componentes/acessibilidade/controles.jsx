import React, { useState, useEffect, useCallback, useRef } from 'react';
import './controles.css';
import { 
  Type, 
  AlignJustify, 
  MoreHorizontal, 
  Contrast,
  Moon,
  Sun,
  MousePointer,
  Eye,
  Pause,
  RotateCcw,
  X,
  Accessibility,
  Link,
  Palette,
  EyeOff,
  BookOpen
} from 'lucide-react';

const ControlesAcessibilidade = () => {
  const [estaAberto, setEstaAberto] = useState(false);
  const [tamanhoFonte, setTamanhoFonte] = useState(100);
  const [espacamentoLetras, setEspacamentoLetras] = useState(0);
  const [alturaLinha, setAlturaLinha] = useState(1.5);
  
  const [modoContraste, setModoContraste] = useState(0);
  const [modoEscuro, setModoEscuro] = useState(0);
  const [guiaLeitura, setGuiaLeitura] = useState(0);
  
  const [removerImagens, setRemoverImagens] = useState(false);
  const [removerCabecalhos, setRemoverCabecalhos] = useState(false);
  const [destacarLinks, setDestacarLinks] = useState(false);
  const [modoDaltonico, setModoDaltonico] = useState(0);
  const [pausarAnimacoes, setPausarAnimacoes] = useState(false);
  const [cursorGrande, setCursorGrande] = useState(false);
  
  const guiaMouseRef = useRef(null);
  const mascaraRef = useRef(null);

  // Efeito para aplicar estilos de acessibilidade textual globalmente
    
  useEffect(() => {
    const aplicarEstilosTexto = () => {
      const estiloDinamico = document.getElementById('estilo-acessibilidade-texto');
      const conteudoEstilo = `
        :root {
          --fator-escala: ${tamanhoFonte / 100};
          --espacamento-letras: ${espacamentoLetras}px;
          --altura-linha: ${alturaLinha};
        }
        
      //   body {
      //     font-size: calc(1rem * var(--fator-escala)) !important;
      //     letter-spacing: var(--espacamento-letras) !important;
      //     line-height: var(--altura-linha) !important;
      //   }
        
      //   h1 {
      //     font-size: calc(2.5rem * var(--fator-escala)) !important;
      //   }
        
      //   h2 {
      //     font-size: calc(2rem * var(--fator-escala)) !important;
      //   }
        
      //   h3 {
      //     font-size: calc(1.75rem * var(--fator-escala)) !important;
      //   }
        
      //   h4 {
      //     font-size: calc(1.5rem * var(--fator-escala)) !important;
      //   }
        
      //   h5 {
      //     font-size: calc(1.25rem * var(--fator-escala)) !important;
      //   }
        
      //   h6 {
      //     font-size: calc(1rem * var(--fator-escala)) !important;
      //   }
        
      //   .texto-pequeno {
      //     font-size: calc(0.875rem * var(--fator-escala)) !important;
      //   }
        
      //   .texto-grande {
      //     font-size: calc(1.25rem * var(--fator-escala)) !important;
      //   }
      // `;
      
      if (!estiloDinamico) {
        const style = document.createElement('style');
        style.id = 'estilo-acessibilidade-texto';
        style.textContent = conteudoEstilo;
        document.head.appendChild(style);
      } else {
        estiloDinamico.textContent = conteudoEstilo;
      }
    };

    aplicarEstilosTexto();
  }, [tamanhoFonte, espacamentoLetras, alturaLinha]);

  const salvarConfiguracao = useCallback((chave, valor) => {
    try {
      localStorage.setItem(`acessibilidade_${chave}`, JSON.stringify(valor));
    } catch (error) {
      console.warn('Erro ao salvar configuração de acessibilidade:', error);
    }
  }, []);

  const carregarConfiguracao = useCallback((chave, valorPadrao) => {
    try {
      const valorSalvo = localStorage.getItem(`acessibilidade_${chave}`);
      return valorSalvo !== null ? JSON.parse(valorSalvo) : valorPadrao;
    } catch (error) {
      console.warn('Erro ao carregar configuração de acessibilidade:', error);
      return valorPadrao;
    }
  }, []);

  useEffect(() => {
    const configuracoes = {
      tamanhoFonte: carregarConfiguracao('tamanhoFonte', 100),
      espacamentoLetras: carregarConfiguracao('espacamentoLetras', 0),
      alturaLinha: carregarConfiguracao('alturaLinha', 1.5),
      modoContraste: carregarConfiguracao('modoContraste', 0),
      modoEscuro: carregarConfiguracao('modoEscuro', 0),
      guiaLeitura: carregarConfiguracao('guiaLeitura', 0),
      removerImagens: carregarConfiguracao('removerImagens', false),
      removerCabecalhos: carregarConfiguracao('removerCabecalhos', false),
      destacarLinks: carregarConfiguracao('destacarLinks', false),
      modoDaltonico: carregarConfiguracao('modoDaltonico', 0),
      pausarAnimacoes: carregarConfiguracao('pausarAnimacoes', false),
      cursorGrande: carregarConfiguracao('cursorGrande', false)
    };

    setTamanhoFonte(configuracoes.tamanhoFonte);
    setEspacamentoLetras(configuracoes.espacamentoLetras);
    setAlturaLinha(configuracoes.alturaLinha);
    setModoContraste(configuracoes.modoContraste);
    setModoEscuro(configuracoes.modoEscuro);
    setGuiaLeitura(configuracoes.guiaLeitura);
    setRemoverImagens(configuracoes.removerImagens);
    setRemoverCabecalhos(configuracoes.removerCabecalhos);
    setDestacarLinks(configuracoes.destacarLinks);
    setModoDaltonico(configuracoes.modoDaltonico);
    setPausarAnimacoes(configuracoes.pausarAnimacoes);
    setCursorGrande(configuracoes.cursorGrande);
  }, [carregarConfiguracao]);

  useEffect(() => {
    const raiz = document.documentElement;
    
    // Aplicar configurações de texto
    raiz.style.setProperty('--acessibilidade-tamanho-fonte', `${tamanhoFonte}%`);
    raiz.style.setProperty('--acessibilidade-espacamento-letras', `${espacamentoLetras}px`);
    raiz.style.setProperty('--acessibilidade-altura-linha', alturaLinha);

    salvarConfiguracao('tamanhoFonte', tamanhoFonte);
    salvarConfiguracao('espacamentoLetras', espacamentoLetras);
    salvarConfiguracao('alturaLinha', alturaLinha);
  }, [tamanhoFonte, espacamentoLetras, alturaLinha, salvarConfiguracao]);

  useEffect(() => {
    const raiz = document.documentElement;
    
    raiz.classList.remove('contraste-leve', 'contraste-intenso');
    
    switch(modoContraste) {
      case 1:
        raiz.classList.add('contraste-leve');
        break;
      case 2:
        raiz.classList.add('contraste-intenso');
        break;
      default:
        // Nada a fazer para desativado
    }
    
    salvarConfiguracao('modoContraste', modoContraste);
  }, [modoContraste, salvarConfiguracao]);

  useEffect(() => {
    const raiz = document.documentElement;
    
    raiz.classList.remove('tema-escuro');
    
    if (modoEscuro === 1) {
      raiz.classList.add('tema-escuro');
    }
    
    salvarConfiguracao('modoEscuro', modoEscuro);
  }, [modoEscuro, salvarConfiguracao]);

  const limparGuiasLeitura = useCallback(() => {
    if (guiaMouseRef.current) {
      guiaMouseRef.current.remove();
      guiaMouseRef.current = null;
    }
    if (mascaraRef.current) {
      mascaraRef.current.remove();
      mascaraRef.current = null;
    }
  }, []);

  useEffect(() => {
    const manipularMovimentoMouse = (e) => {
      if (guiaLeitura === 1 && guiaMouseRef.current) {
        guiaMouseRef.current.style.top = `${e.clientY}px`;
        
        const indicador = guiaMouseRef.current.querySelector('.cursor-indicator');
        if (indicador) {
          indicador.style.left = `${e.clientX}px`;
        }
      } else if (guiaLeitura === 2 && mascaraRef.current) {
        mascaraRef.current.style.top = `${e.clientY - 100}px`;
        mascaraRef.current.style.left = `${e.clientX - 150}px`;
      }
    };

    limparGuiasLeitura();

    if (guiaLeitura === 1) {
      document.addEventListener('mousemove', manipularMovimentoMouse);
      const guia = document.createElement('div');
      guia.className = 'horizontal-reading-guide';
      guia.innerHTML = '<div class="cursor-indicator"></div>';
      document.body.appendChild(guia);
      guiaMouseRef.current = guia;
    } else if (guiaLeitura === 2) {
      document.addEventListener('mousemove', manipularMovimentoMouse);
      const mascara = document.createElement('div');
      mascara.className = 'reading-mask';
      document.body.appendChild(mascara);
      mascaraRef.current = mascara;
    }

    salvarConfiguracao('guiaLeitura', guiaLeitura);

    return () => {
      document.removeEventListener('mousemove', manipularMovimentoMouse);
    };
  }, [guiaLeitura, salvarConfiguracao, limparGuiasLeitura]);

  useEffect(() => {
    const raiz = document.documentElement;
    
    raiz.classList.toggle('remover-imagens', removerImagens);
    raiz.classList.toggle('remover-cabecalhos', removerCabecalhos);
    raiz.classList.toggle('destacar-links', destacarLinks);
    raiz.classList.toggle('pausar-animacoes', pausarAnimacoes);
    raiz.classList.toggle('cursor-grande', cursorGrande);

    raiz.classList.remove('daltonico-protanopia', 'daltonico-deuteranopia', 'daltonico-tritanopia');
    switch(modoDaltonico) {
      case 1:
        raiz.classList.add('daltonico-protanopia');
        break;
      case 2:
        raiz.classList.add('daltonico-deuteranopia');
        break;
      case 3:
        raiz.classList.add('daltonico-tritanopia');
        break;
      default:
        // Nada a fazer para normal
    }

    salvarConfiguracao('removerImagens', removerImagens);
    salvarConfiguracao('removerCabecalhos', removerCabecalhos);
    salvarConfiguracao('destacarLinks', destacarLinks);
    salvarConfiguracao('modoDaltonico', modoDaltonico);
    salvarConfiguracao('pausarAnimacoes', pausarAnimacoes);
    salvarConfiguracao('cursorGrande', cursorGrande);
  }, [removerImagens, removerCabecalhos, destacarLinks, modoDaltonico, pausarAnimacoes, cursorGrande, salvarConfiguracao]);

  useEffect(() => {
    const manipularTeclaPressionada = (evento) => {
      if (evento.altKey && evento.key === 'a') {
        evento.preventDefault();
        setEstaAberto(prev => !prev);
      }
      if (evento.altKey && evento.key === 'c') {
        evento.preventDefault();
        setModoContraste(prev => (prev + 1) % 3);
      }
      if (evento.altKey && evento.key === 'd') {
        evento.preventDefault();
        setModoEscuro(prev => (prev + 1) % 2);
      }
      if (evento.altKey && evento.key === '+') {
        evento.preventDefault();
        setTamanhoFonte(prev => Math.min(prev + 10, 150));
      }
      if (evento.altKey && evento.key === '-') {
        evento.preventDefault();
        setTamanhoFonte(prev => Math.max(prev - 10, 80));
      }
    };

    document.addEventListener('keydown', manipularTeclaPressionada);
    return () => document.removeEventListener('keydown', manipularTeclaPressionada);
  }, []);

  const alternarPainel = () => {
    setEstaAberto(!estaAberto);
  };

  const aumentarTamanhoFonte = () => {
    setTamanhoFonte(prev => Math.min(prev + 5, 130)); // Reduzido de 10 para 5 e limite de 150 para 120
  };

  const diminuirTamanhoFonte = () => {
    setTamanhoFonte(prev => Math.max(prev - 5, 80)); // Reduzido de 10 para 5 e limite de 80 para 90
  };

  const redefinirTamanhoFonte = () => {
    setTamanhoFonte(100);
  };

  const aumentarEspacamentoLetras = () => {
    setEspacamentoLetras(prev => Math.min(prev + 0.1, 0.5));
  };

  const diminuirEspacamentoLetras = () => {
    setEspacamentoLetras(prev => Math.max(prev - 0.1, -0.5));
  };

  const redefinirEspacamentoLetras = () => {
    setEspacamentoLetras(0);
  };

  const aumentarAlturaLinha = () => {
    setAlturaLinha(prev => Math.min(prev + 0.1, 2.0));
  };

  const diminuirAlturaLinha = () => {
    setAlturaLinha(prev => Math.max(prev - 0.1, 1.0));
  };

  const redefinirAlturaLinha = () => {
    setAlturaLinha(1.5);
  };

  const redefinirTudo = () => {
    setTamanhoFonte(100);
    setEspacamentoLetras(0);
    setAlturaLinha(1.5);
    setModoContraste(0);
    setModoEscuro(0);
    setGuiaLeitura(0);
    setRemoverImagens(false);
    setRemoverCabecalhos(false);
    setDestacarLinks(false);
    setModoDaltonico(0);
    setPausarAnimacoes(false);
    setCursorGrande(false);
    
    const chaves = [
      'tamanhoFonte', 'espacamentoLetras', 'alturaLinha', 'modoContraste', 'modoEscuro',
      'guiaLeitura', 'removerImagens', 'removerCabecalhos', 'destacarLinks',
      'modoDaltonico', 'pausarAnimacoes', 'cursorGrande'
    ];
    
    chaves.forEach(chave => {
      try {
        localStorage.removeItem(`acessibilidade_${chave}`);
      } catch (error) {
        console.warn('Erro ao limpar configuração:', error);
      }
    });
    
    const raiz = document.documentElement;
    const classes = [
      'contraste-leve', 'contraste-intenso', 'tema-escuro',
      'remover-imagens', 'remover-cabecalhos', 'destacar-links', 
      'pausar-animacoes', 'cursor-grande',
      'daltonico-protanopia', 'daltonico-deuteranopia', 'daltonico-tritanopia'
    ];
    
    classes.forEach(classe => raiz.classList.remove(classe));
    
    raiz.style.setProperty('--acessibilidade-tamanho-fonte', '100%');
    raiz.style.setProperty('--acessibilidade-espacamento-letras', '0px');
    raiz.style.setProperty('--acessibilidade-altura-linha', '1.5');
    
    limparGuiasLeitura();
  };

  const obterTextoModoContraste = () => {
    switch(modoContraste) {
      case 1: return 'Leve';
      case 2: return 'Intenso';
      default: return 'Desativado';
    }
  };

  const obterTextoModoEscuro = () => {
    return modoEscuro === 1 ? 'Ativado' : 'Desativado';
  };

  const obterTextoGuiaLeitura = () => {
    switch(guiaLeitura) {
      case 1: return 'Barra';
      case 2: return 'Máscara';
      default: return 'Desativado';
    }
  };

  const obterTextoModoDaltonico = () => {
    switch(modoDaltonico) {
      case 1: return 'Protanopia';
      case 2: return 'Deuteranopia';
      case 3: return 'Tritanopia';
      default: return 'Normal';
    }
  };

  return (
    <div className="accessibility-controls">
      <button 
        className="accessibility-toggle"
        onClick={alternarPainel}
        aria-label="Abrir controles de acessibilidade (Alt + A)"
        title="Controles de Acessibilidade (Alt + A)"
      >
        <Accessibility size={24} />
      </button>

      {estaAberto && (
        <div className="accessibility-panel" role="dialog" aria-label="Painel de controles de acessibilidade">
          <div className="accessibility-header">
            <div className="header-title">
              <Accessibility size={20} />
              <h3>Acessibilidade</h3>
            </div>
            <button 
              className="close-button"
              onClick={alternarPainel}
              aria-label="Fechar controles"
            >
              <X size={18} />
            </button>
          </div>

          <div className="accessibility-content">
            <div className="section">
              <h4 className="section-title">1. Controles de Texto</h4>
              
              <div className="control-group">
                <div className="control-header">
                  <Type size={16} />
                  <span>Tamanho da Fonte</span>
                  <span className="control-value">{tamanhoFonte}%</span>
                </div>
                <div className="control-buttons">
                  <button onClick={diminuirTamanhoFonte} className="control-btn decrease">A-</button>
                  <button onClick={redefinirTamanhoFonte} className="control-btn reset">A</button>
                  <button onClick={aumentarTamanhoFonte} className="control-btn increase">A+</button>
                </div>
              </div>

              <div className="control-group">
                <div className="control-header">
                  <MoreHorizontal size={16} />
                  <span>Espaço entre Letras</span>
                  <span className="control-value">{espacamentoLetras.toFixed(1)}px</span>
                </div>
                <div className="control-buttons">
                  <button onClick={diminuirEspacamentoLetras} className="control-btn decrease">-</button>
                  <button onClick={redefinirEspacamentoLetras} className="control-btn reset">0</button>
                  <button onClick={aumentarEspacamentoLetras} className="control-btn increase">+</button>
                </div>
              </div>

              <div className="control-group">
                <div className="control-header">
                  <AlignJustify size={16} />
                  <span>Espaço entre Linhas</span>
                  <span className="control-value">{alturaLinha.toFixed(1)}</span>
                </div>
                <div className="control-buttons">
                  <button onClick={diminuirAlturaLinha} className="control-btn decrease">-</button>
                  <button onClick={redefinirAlturaLinha} className="control-btn reset">1.5</button>
                  <button onClick={aumentarAlturaLinha} className="control-btn increase">+</button>
                </div>
              </div>
            </div>

            <div className="section">
              <h4 className="section-title">2. Aparência</h4>
              
              <div className="multi-option-control">
                <div className="control-header">
                  <Contrast size={16} />
                  <span>Contraste</span>
                  <span className="control-value">{obterTextoModoContraste()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setModoContraste(0)}
                    className={`multi-btn ${modoContraste === 0 ? 'active' : ''}`}
                  >Desativado</button>
                  <button 
                    onClick={() => setModoContraste(1)}
                    className={`multi-btn ${modoContraste === 1 ? 'active' : ''}`}
                  >Leve</button>
                  <button 
                    onClick={() => setModoContraste(2)}
                    className={`multi-btn ${modoContraste === 2 ? 'active' : ''}`}
                  >Intenso</button>
                </div>
              </div>

              <div className="multi-option-control">
                <div className="control-header">
                  {modoEscuro === 1 ? <Moon size={16} /> : <Sun size={16} />}
                  <span>Modo Escuro</span>
                  <span className="control-value">{obterTextoModoEscuro()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setModoEscuro(0)}
                    className={`multi-btn ${modoEscuro === 0 ? 'active' : ''}`}
                  >Desativado</button>
                  <button 
                    onClick={() => setModoEscuro(1)}
                    className={`multi-btn ${modoEscuro === 1 ? 'active' : ''}`}
                  >Ativado</button>
                </div>
              </div>

              <div className="multi-option-control">
                <div className="control-header">
                  <Eye size={16} />
                  <span>Modo Daltônico</span>
                  <span className="control-value">{obterTextoModoDaltonico()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setModoDaltonico(0)}
                    className={`multi-btn ${modoDaltonico === 0 ? 'active' : ''}`}
                  >Normal</button>
                  <button 
                    onClick={() => setModoDaltonico(1)}
                    className={`multi-btn ${modoDaltonico === 1 ? 'active' : ''}`}
                  >Protanopia</button>
                  <button 
                    onClick={() => setModoDaltonico(2)}
                    className={`multi-btn ${modoDaltonico === 2 ? 'active' : ''}`}
                  >Deuteranopia</button>
                  <button 
                    onClick={() => setModoDaltonico(3)}
                    className={`multi-btn ${modoDaltonico === 3 ? 'active' : ''}`}
                  >Tritanopia</button>
                </div>
              </div>
            </div>

            <div className="section">
              <h4 className="section-title">3. Navegação</h4>
              
              <div className="multi-option-control">
                <div className="control-header">
                  <BookOpen size={16} />
                  <span>Guia de Leitura</span>
                  <span className="control-value">{obterTextoGuiaLeitura()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setGuiaLeitura(0)}
                    className={`multi-btn ${guiaLeitura === 0 ? 'active' : ''}`}
                  >Desativado</button>
                  <button 
                    onClick={() => setGuiaLeitura(1)}
                    className={`multi-btn ${guiaLeitura === 1 ? 'active' : ''}`}
                  >Barra</button>
                  <button 
                    onClick={() => setGuiaLeitura(2)}
                    className={`multi-btn ${guiaLeitura === 2 ? 'active' : ''}`}
                  >Máscara</button>
                </div>
              </div>

              <div className="toggle-control">
                <div className="toggle-header">
                  <Link size={16} />
                  <span>Destacar Links</span>
                </div>
                <button 
                  onClick={() => setDestacarLinks(prev => !prev)}
                  className={`toggle-btn ${destacarLinks ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>

              <div className="toggle-control">
                <div className="toggle-header">
                  <MousePointer size={16} />
                  <span>Cursor Grande</span>
                </div>
                <button 
                  onClick={() => setCursorGrande(prev => !prev)}
                  className={`toggle-btn ${cursorGrande ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>

              <div className="toggle-control">
                <div className="toggle-header">
                  <Pause size={16} />
                  <span>Pausar Animações</span>
                </div>
                <button 
                  onClick={() => setPausarAnimacoes(prev => !prev)}
                  className={`toggle-btn ${pausarAnimacoes ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>
            </div>

            <div className="section">
              <h4 className="section-title">4. Leitores de Tela</h4>
              
              <div className="toggle-control">
                <div className="toggle-header">
                  <EyeOff size={16} />
                  <span>Remover Imagens</span>
                </div>
                <button 
                  onClick={() => setRemoverImagens(prev => !prev)}
                  className={`toggle-btn ${removerImagens ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>

              <div className="toggle-control">
                <div className="toggle-header">
                  <Type size={16} />
                  <span>Remover Cabeçalhos</span>
                </div>
                <button 
                  onClick={() => setRemoverCabecalhos(prev => !prev)}
                  className={`toggle-btn ${removerCabecalhos ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>
            </div>

            <div className="shortcuts-section">
              <details>
                <summary>Atalhos de Teclado</summary>
                <div className="shortcuts-list">
                  <div><kbd>Alt + A</kbd> Abrir/Fechar painel</div>
                  <div><kbd>Alt + C</kbd> Alternar contraste</div>
                  <div><kbd>Alt + D</kbd> Alternar tema</div>
                  <div><kbd>Alt + +</kbd> Aumentar fonte</div>
                  <div><kbd>Alt + -</kbd> Diminuir fonte</div>
                </div>
              </details>
            </div>
          </div>

          <div className="reset-section">
            <button 
              onClick={redefinirTudo}
              className="reset-all-btn"
              aria-label="Resetar todas as configurações"
            >
              <RotateCcw size={16} />
              Resetar Tudo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlesAcessibilidade;