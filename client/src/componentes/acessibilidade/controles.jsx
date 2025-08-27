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
      const estiloDinamico = document.getElementById('estiloAcessibilidadeTexto');
      const conteudoEstilo = `
        :root {
          --fatorEscala: ${tamanhoFonte / 100};
          --espacamentoLetras: ${espacamentoLetras}px;
          --alturaLinha: ${alturaLinha};
        }
      `;
      
      if (!estiloDinamico) {
        const style = document.createElement('style');
        style.id = 'estiloAcessibilidadeTexto';
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
    raiz.style.setProperty('--acessibilidadeTamanhoFonte', `${tamanhoFonte}%`);
    raiz.style.setProperty('--acessibilidadeEspacamentoLetras', `${espacamentoLetras}px`);
    raiz.style.setProperty('--acessibilidadeAlturaLinha', alturaLinha);

    salvarConfiguracao('tamanhoFonte', tamanhoFonte);
    salvarConfiguracao('espacamentoLetras', espacamentoLetras);
    salvarConfiguracao('alturaLinha', alturaLinha);
  }, [tamanhoFonte, espacamentoLetras, alturaLinha, salvarConfiguracao]);

  useEffect(() => {
    const raiz = document.documentElement;
    
    raiz.classList.remove('contrasteLeve', 'contrasteIntenso');
    
    switch(modoContraste) {
      case 1:
        raiz.classList.add('contrasteLeve');
        break;
      case 2:
        raiz.classList.add('contrasteIntenso');
        break;
      default:
        // Nada a fazer para desativado
    }
    
    salvarConfiguracao('modoContraste', modoContraste);
  }, [modoContraste, salvarConfiguracao]);

  useEffect(() => {
    const raiz = document.documentElement;
    
    raiz.classList.remove('temaEscuro');
    
    if (modoEscuro === 1) {
      raiz.classList.add('temaEscuro');
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
        
        const indicador = guiaMouseRef.current.querySelector('.indicadorCursor');
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
      guia.className = 'guiaLeituraHorizontal';
      guia.innerHTML = '<div class="indicadorCursor"></div>';
      document.body.appendChild(guia);
      guiaMouseRef.current = guia;
    } else if (guiaLeitura === 2) {
      document.addEventListener('mousemove', manipularMovimentoMouse);
      const mascara = document.createElement('div');
      mascara.className = 'mascaraLeitura';
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
    
    raiz.classList.toggle('removerImagens', removerImagens);
    raiz.classList.toggle('removerCabecalhos', removerCabecalhos);
    raiz.classList.toggle('destacarLinks', destacarLinks);
    raiz.classList.toggle('pausarAnimacoes', pausarAnimacoes);
    raiz.classList.toggle('cursorGrande', cursorGrande);

    raiz.classList.remove('daltonicoProtanopia', 'daltonicoDeuteranopia', 'daltonicoTritanopia');
    switch(modoDaltonico) {
      case 1:
        raiz.classList.add('daltonicoProtanopia');
        break;
      case 2:
        raiz.classList.add('daltonicoDeuteranopia');
        break;
      case 3:
        raiz.classList.add('daltonicoTritanopia');
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
    setTamanhoFonte(prev => Math.min(prev + 5, 130));
  };

  const diminuirTamanhoFonte = () => {
    setTamanhoFonte(prev => Math.max(prev - 5, 80));
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
      'contrasteLeve', 'contrasteIntenso', 'temaEscuro',
      'removerImagens', 'removerCabecalhos', 'destacarLinks', 
      'pausarAnimacoes', 'cursorGrande',
      'daltonicoProtanopia', 'daltonicoDeuteranopia', 'daltonicoTritanopia'
    ];
    
    classes.forEach(classe => raiz.classList.remove(classe));
    
    raiz.style.setProperty('--acessibilidadeTamanhoFonte', '100%');
    raiz.style.setProperty('--acessibilidadeEspacamentoLetras', '0px');
    raiz.style.setProperty('--acessibilidadeAlturaLinha', '1.5');
    
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
    <div className="controlesAcessibilidade">
      <button 
        className="botaoAlternarAcessibilidade"
        onClick={alternarPainel}
        aria-label="Abrir controles de acessibilidade (Alt + A)"
        title="Controles de Acessibilidade (Alt + A)"
      >
        <Accessibility size={24} />
      </button>

      {estaAberto && (
        <div className="painelAcessibilidade" role="dialog" aria-label="Painel de controles de acessibilidade">
          <div className="cabecalhoAcessibilidade">
            <div className="tituloHeader">
              <Accessibility size={20} />
              <h3>Acessibilidade</h3>
            </div>
            <button 
              className="botaoFechar"
              onClick={alternarPainel}
              aria-label="Fechar controles"
            >
              <X size={18} />
            </button>
          </div>

          <div className="conteudoAcessibilidade">
            <div className="secao">
              <h4 className="tituloSecao">1. Controles de Texto</h4>
              
              <div className="grupoControle">
                <div className="cabecalhoControle">
                  <Type size={16} />
                  <span>Tamanho da Fonte</span>
                  <span className="valorControle">{tamanhoFonte}%</span>
                </div>
                <div className="botoesControle">
                  <button onClick={diminuirTamanhoFonte} className="botaoControle diminuir">A-</button>
                  <button onClick={redefinirTamanhoFonte} className="botaoControle resetar">A</button>
                  <button onClick={aumentarTamanhoFonte} className="botaoControle aumentar">A+</button>
                </div>
              </div>

              <div className="grupoControle">
                <div className="cabecalhoControle">
                  <MoreHorizontal size={16} />
                  <span>Espaço entre Letras</span>
                  <span className="valorControle">{espacamentoLetras.toFixed(1)}px</span>
                </div>
                <div className="botoesControle">
                  <button onClick={diminuirEspacamentoLetras} className="botaoControle diminuir">-</button>
                  <button onClick={redefinirEspacamentoLetras} className="botaoControle resetar">0</button>
                  <button onClick={aumentarEspacamentoLetras} className="botaoControle aumentar">+</button>
                </div>
              </div>

              <div className="grupoControle">
                <div className="cabecalhoControle">
                  <AlignJustify size={16} />
                  <span>Espaço entre Linhas</span>
                  <span className="valorControle">{alturaLinha.toFixed(1)}</span>
                </div>
                <div className="botoesControle">
                  <button onClick={diminuirAlturaLinha} className="botaoControle diminuir">-</button>
                  <button onClick={redefinirAlturaLinha} className="botaoControle resetar">1.5</button>
                  <button onClick={aumentarAlturaLinha} className="botaoControle aumentar">+</button>
                </div>
              </div>
            </div>

            <div className="secao">
              <h4 className="tituloSecao">2. Cores e Contraste</h4>
              
              <div className="controleMultiOpcao">
                <div className="cabecalhoControle">
                  <Contrast size={16} />
                  <span>Contraste</span>
                  <span className="valorControle">{obterTextoModoContraste()}</span>
                </div>
                <div className="botoesMulti">
                  <button 
                    onClick={() => setModoContraste(0)}
                    className={`botaoMulti ${modoContraste === 0 ? 'botaoAtivo' : ''}`}
                  >Desativado</button>
                  <button 
                    onClick={() => setModoContraste(1)}
                    className={`botaoMulti ${modoContraste === 1 ? 'botaoAtivo' : ''}`}
                  >Leve</button>
                  <button 
                    onClick={() => setModoContraste(2)}
                    className={`botaoMulti ${modoContraste === 2 ? 'botaoAtivo' : ''}`}
                  >Intenso</button>
                </div>
              </div>

              <div className="controleMultiOpcao">
                <div className="cabecalhoControle">
                  {modoEscuro === 1 ? <Moon size={16} /> : <Sun size={16} />}
                  <span>Modo Escuro</span>
                  <span className="valorControle">{obterTextoModoEscuro()}</span>
                </div>
                <div className="botoesMulti">
                  <button 
                    onClick={() => setModoEscuro(0)}
                    className={`botaoMulti ${modoEscuro === 0 ? 'botaoAtivo' : ''}`}
                  >Desativado</button>
                  <button 
                    onClick={() => setModoEscuro(1)}
                    className={`botaoMulti ${modoEscuro === 1 ? 'botaoAtivo' : ''}`}
                  >Ativado</button>
                </div>
              </div>

              <div className="controleMultiOpcao">
                <div className="cabecalhoControle">
                  <Eye size={16} />
                  <span>Modo Daltônico</span>
                  <span className="valorControle">{obterTextoModoDaltonico()}</span>
                </div>
                <div className="botoesMulti">
                  <button 
                    onClick={() => setModoDaltonico(0)}
                    className={`botaoMulti ${modoDaltonico === 0 ? 'botaoAtivo' : ''}`}
                  >Normal</button>
                  <button 
                    onClick={() => setModoDaltonico(1)}
                    className={`botaoMulti ${modoDaltonico === 1 ? 'botaoAtivo' : ''}`}
                  >Protanopia</button>
                  <button 
                    onClick={() => setModoDaltonico(2)}
                    className={`botaoMulti ${modoDaltonico === 2 ? 'botaoAtivo' : ''}`}
                  >Deuteranopia</button>
                  <button 
                    onClick={() => setModoDaltonico(3)}
                    className={`botaoMulti ${modoDaltonico === 3 ? 'botaoAtivo' : ''}`}
                  >Tritanopia</button>
                </div>
              </div>
            </div>

            <div className="secao">
              <h4 className="tituloSecao">3. Navegação</h4>
              
              <div className="controleMultiOpcao">
                <div className="cabecalhoControle">
                  <BookOpen size={16} />
                  <span>Guia de Leitura</span>
                  <span className="valorControle">{obterTextoGuiaLeitura()}</span>
                </div>
                <div className="botoesMulti">
                  <button 
                    onClick={() => setGuiaLeitura(0)}
                    className={`botaoMulti ${guiaLeitura === 0 ? 'botaoAtivo' : ''}`}
                  >Desativado</button>
                  <button 
                    onClick={() => setGuiaLeitura(1)}
                    className={`botaoMulti ${guiaLeitura === 1 ? 'botaoAtivo' : ''}`}
                  >Barra</button>
                  <button 
                    onClick={() => setGuiaLeitura(2)}
                    className={`botaoMulti ${guiaLeitura === 2 ? 'botaoAtivo' : ''}`}
                  >Máscara</button>
                </div>
              </div>

              <div className="controleToggle">
                <div className="cabecalhoToggle">
                  <Link size={16} />
                  <span>Destacar Links</span>
                </div>
                <button 
                  onClick={() => setDestacarLinks(prev => !prev)}
                  className={`botaoToggle ${destacarLinks ? 'botaoAtivo' : ''}`}
                >
                  <div className="sliderToggle"></div>
                </button>
              </div>

              <div className="controleToggle">
                <div className="cabecalhoToggle">
                  <MousePointer size={16} />
                  <span>Cursor Grande</span>
                </div>
                <button 
                  onClick={() => setCursorGrande(prev => !prev)}
                  className={`botaoToggle ${cursorGrande ? 'botaoAtivo' : ''}`}
                >
                  <div className="sliderToggle"></div>
                </button>
              </div>

              <div className="controleToggle">
                <div className="cabecalhoToggle">
                  <Pause size={16} />
                  <span>Pausar Animações</span>
                </div>
                <button 
                  onClick={() => setPausarAnimacoes(prev => !prev)}
                  className={`botaoToggle ${pausarAnimacoes ? 'botaoAtivo' : ''}`}
                >
                  <div className="sliderToggle"></div>
                </button>
              </div>
            </div>

            <div className="secao">
              <h4 className="tituloSecao">4. Leitores de Tela</h4>
              
              <div className="controleToggle">
                <div className="cabecalhoToggle">
                  <EyeOff size={16} />
                  <span>Remover Imagens</span>
                </div>
                <button 
                  onClick={() => setRemoverImagens(prev => !prev)}
                  className={`botaoToggle ${removerImagens ? 'botaoAtivo' : ''}`}
                >
                  <div className="sliderToggle"></div>
                </button>
              </div>

              <div className="controleToggle">
                <div className="cabecalhoToggle">
                  <Type size={16} />
                  <span>Remover Cabeçalhos</span>
                </div>
                <button 
                  onClick={() => setRemoverCabecalhos(prev => !prev)}
                  className={`botaoToggle ${removerCabecalhos ? 'botaoAtivo' : ''}`}
                >
                  <div className="sliderToggle"></div>
                </button>
              </div>
            </div>

            <div className="secaoAtalhos">
              <details>
                <summary>Atalhos de Teclado</summary>
                <div className="listaAtalhos">
                  <div><kbd>Alt + A</kbd> Abrir/Fechar painel</div>
                  <div><kbd>Alt + C</kbd> Alternar contraste</div>
                  <div><kbd>Alt + D</kbd> Alternar tema</div>
                  <div><kbd>Alt + +</kbd> Aumentar fonte</div>
                  <div><kbd>Alt + -</kbd> Diminuir fonte</div>
                </div>
              </details>
            </div>
          </div>

          <div className="secaoReset">
            <button 
              onClick={redefinirTudo}
              className="botaoResetarTudo"
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

