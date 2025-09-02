import { useState, useEffect, useCallback, useRef } from 'react';
import './controles.css';
import useVLibras from '@ganchos/useVLibras';
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
  PersonStanding,
  Link,
  EyeOff,
  BookOpen,
  Volume2
} from 'lucide-react';

const ControlesAcessibilidade = () => {
  // Hook do VLibras
  const {
    vlibrasVisibility,
    vlibrasStatus,
    toggleVlibrasVisibility,
    reiniciarVLibras,
    obterIconeStatusVLibras
  } = useVLibras();

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

  useEffect(() => {
    const aplicarEstilosTexto = () => {
      let estiloDinamico = document.getElementById('estiloAcessibilidadeTexto');
      const conteudoEstilo = `
        :root {
          --fatorEscala: ${tamanhoFonte / 100};
          --espacamentoLetras: ${espacamentoLetras}px;
          --alturaLinha: ${alturaLinha};
          font-size: calc(16px * var(--fatorEscala)); 
        }
        body {
          letter-spacing: var(--espacamentoLetras);
          line-height: var(--alturaLinha);
        }
      `;

      if (!estiloDinamico) {
        const style = document.createElement('style');
        style.id = 'estiloAcessibilidadeTexto';
        document.head.appendChild(style);
        estiloDinamico = style;
      }
      estiloDinamico.textContent = conteudoEstilo;
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
      cursorGrande: carregarConfiguracao('cursorGrande', false),
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
    raiz.classList.remove('contrasteLeve', 'contrasteIntenso');
    switch (modoContraste) {
      case 1: raiz.classList.add('contrasteLeve'); break;
      case 2: raiz.classList.add('contrasteIntenso'); break;
      default: break;
    }
    salvarConfiguracao('modoContraste', modoContraste);
  }, [modoContraste, salvarConfiguracao]);

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.toggle('temaEscuro', modoEscuro === 1);
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
        mascaraRef.current.style.left = `${e.clientX - 750}px`;
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
      limparGuiasLeitura();
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
    switch (modoDaltonico) {
      case 1: raiz.classList.add('daltonicoProtanopia'); break;
      case 2: raiz.classList.add('daltonicoDeuteranopia'); break;
      case 3: raiz.classList.add('daltonicoTritanopia'); break;
      default: break;
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
      if (evento.altKey && evento.key === 'a') { evento.preventDefault(); setEstaAberto(prev => !prev); }
      if (evento.altKey && evento.key === 'c') { evento.preventDefault(); setModoContraste(prev => (prev + 1) % 3); }
      if (evento.altKey && evento.key === 'd') { evento.preventDefault(); setModoEscuro(prev => (prev + 1) % 2); }
      if (evento.altKey && evento.key === '+') { evento.preventDefault(); setTamanhoFonte(prev => Math.min(prev + 10, 150)); }
      if (evento.altKey && evento.key === '-') { evento.preventDefault(); setTamanhoFonte(prev => Math.max(prev - 10, 80)); }
    };
    document.addEventListener('keydown', manipularTeclaPressionada);
    return () => document.removeEventListener('keydown', manipularTeclaPressionada);
  }, []);

  const alternarPainel = () => {
    setEstaAberto(!estaAberto);
  };

  const aumentarTamanhoFonte = () => setTamanhoFonte(prev => Math.min(prev + 5, 130));
  const diminuirTamanhoFonte = () => setTamanhoFonte(prev => Math.max(prev - 5, 80));
  const redefinirTamanhoFonte = () => setTamanhoFonte(100);

  const aumentarEspacamentoLetras = () => setEspacamentoLetras(prev => Math.min(prev + 0.1, 0.5));
  const diminuirEspacamentoLetras = () => setEspacamentoLetras(prev => Math.max(prev - 0.1, -0.5));
  const redefinirEspacamentoLetras = () => setEspacamentoLetras(0);

  const aumentarAlturaLinha = () => setAlturaLinha(prev => Math.min(prev + 0.1, 2.0));
  const diminuirAlturaLinha = () => setAlturaLinha(prev => Math.max(prev - 0.1, 1.0));
  const redefinirAlturaLinha = () => setAlturaLinha(1.5);

  // const redefinirTudo = () => {
  //   setTamanhoFonte(100);
  //   setEspacamentoLetras(0);
  //   setAlturaLinha(1.5);
  //   setModoContraste(0);
  //   setModoEscuro(0);
  //   setGuiaLeitura(0);
  //   setRemoverImagens(false);
  //   setRemoverCabecalhos(false);
  //   setDestacarLinks(false);
  //   setModoDaltonico(0);
  //   setPausarAnimacoes(false);
  //   setCursorGrande(false);

  //   const chaves = [
  //     'tamanhoFonte', 'espacamentoLetras', 'alturaLinha', 'modoContraste', 'modoEscuro',
  //     'guiaLeitura', 'removerImagens', 'removerCabecalhos', 'destacarLinks',
  //     'modoDaltonico', 'pausarAnimacoes', 'cursorGrande'
  //   ];

  //   chaves.forEach(chave => {
  //     try { localStorage.removeItem(`acessibilidade_${chave}`); } catch (error) { console.warn('Erro ao limpar configuração:', error); }
  //   });

  //   const raiz = document.documentElement;
  //   const classes = [
  //     'contrasteLeve', 'contrasteIntenso', 'temaEscuro',
  //     'removerImagens', 'removerCabecalhos', 'destacarLinks',
  //     'pausarAnimacoes', 'cursorGrande',
  //     'daltonicoProtanopia', 'daltonicoDeuteranopia', 'daltonicoTritanopia'
  //   ];
  //   classes.forEach(classe => raiz.classList.remove(classe));

  //   raiz.style.setProperty('--fatorEscala', '1');
  //   raiz.style.setProperty('--espacamentoLetras', '0px');
  //   raiz.style.setProperty('--alturaLinha', '1.5');

  //   limparGuiasLeitura();
  // };

  const obterTextoModoContraste = () => {
    switch (modoContraste) { case 1: return 'Leve'; case 2: return 'Intenso'; default: return 'Desativado'; }
  };
  const obterTextoModoEscuro = () => {
    return modoEscuro === 1 ? 'Ativado' : 'Desativado';
  };
  const obterTextoGuiaLeitura = () => {
    switch (guiaLeitura) { case 1: return 'Barra'; case 2: return 'Máscara'; default: return 'Desativado'; }
  };
  const obterTextoModoDaltonico = () => {
    switch (modoDaltonico) { case 1: return 'Protanopia'; case 2: return 'Deuteranopia'; case 3: return 'Tritanopia'; default: return 'Normal'; }
  };

  return (
    <div className="controlesAcessibilidade">
      <button
        className="botaoAlternarAcessibilidade"
        onClick={alternarPainel}
        aria-label="Abrir controles de acessibilidade (Alt + A)"
        title="Controles de Acessibilidade (Alt + A)"
      >
        <PersonStanding size={24} />
      </button>

      {estaAberto && (
        <div className="painelAcessibilidade" role="dialog" aria-label="Painel de controles de acessibilidade">
          <div className="cabecalhoAcessibilidade">
            <div className="tituloHeader">
              <PersonStanding size={20} />
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
          <div className="secao">
            <Volume2 size={16} />
            <h4>VLibras</h4>
            <div className="vlibras-status-toggle-wrapper">
              <button
                onClick={toggleVlibrasVisibility}
                className={`toggle-vlibras-btn ${vlibrasVisibility ? 'active' : ''}`}
                aria-pressed={vlibrasVisibility}
              >
                {vlibrasVisibility ? 'Desativar VLibras' : 'Ativar VLibras'}
              </button>
              {vlibrasVisibility && (
                <div className="vlibras-status-display">
                  <div className="vlibras-status-header">
                    <span>{obterIconeStatusVLibras()} {vlibrasStatus.message}</span>
                    <button
                      onClick={reiniciarVLibras}
                      className="vlibras-retry-btn"
                      disabled={vlibrasStatus.status === 'loading'}
                      title="Reiniciar VLibras"
                    >
                      <RotateCcw size={16} /> Reiniciar
                    </button>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${vlibrasStatus.progress}%` }}
                    ></div>
                  </div>
                  {vlibrasStatus.error && (
                    <p className="vlibras-error-message">Erro: {vlibrasStatus.error.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              <Type size={16} /> Tamanho do Texto
            </h4>
            <div className="controlesBotoes">
              <button onClick={diminuirTamanhoFonte} aria-label="Diminuir tamanho da fonte">-</button>
              <span>{tamanhoFonte}%</span>
              <button onClick={aumentarTamanhoFonte} aria-label="Aumentar tamanho da fonte">+</button>
              <button onClick={redefinirTamanhoFonte} aria-label="Redefinir tamanho da fonte">Redefinir</button>
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              <AlignJustify size={16} /> Espaçamento de Letras
            </h4>
            <div className="controlesBotoes">
              <button onClick={diminuirEspacamentoLetras} aria-label="Diminuir espaçamento de letras">-</button>
              <span>{espacamentoLetras.toFixed(1)}px</span>
              <button onClick={aumentarEspacamentoLetras} aria-label="Aumentar espaçamento de letras">+</button>
              <button onClick={redefinirEspacamentoLetras} aria-label="Redefinir espaçamento de letras">Redefinir</button>
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              <MoreHorizontal size={16} /> Altura da Linha
            </h4>
            <div className="controlesBotoes">
              <button onClick={diminuirAlturaLinha} aria-label="Diminuir altura da linha">-</button>
              <span>{alturaLinha.toFixed(1)}</span>
              <button onClick={aumentarAlturaLinha} aria-label="Aumentar altura da linha">+</button>
              <button onClick={redefinirAlturaLinha} aria-label="Redefinir altura da linha">Redefinir</button>
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              <Contrast size={16} /> Modo de Contraste
            </h4>
            <div className="controlesBotoes">
              <button onClick={() => setModoContraste(prev => (prev + 1) % 3)} aria-label={`Alternar modo de contraste. Estado atual: ${obterTextoModoContraste()}`}>
                {obterTextoModoContraste()}
              </button>
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              {modoEscuro === 1 ? <Moon size={16} /> : <Sun size={16} />} Tema Escuro
            </h4>
            <div className="controlesBotoes">
              <button onClick={() => setModoEscuro(prev => (prev + 1) % 2)} aria-label={`Alternar tema escuro. Estado atual: ${obterTextoModoEscuro()}`}>
                {obterTextoModoEscuro()}
              </button>
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              <Eye size={16} /> Guia de Leitura
            </h4>
            <div className="controlesBotoes">
              <button onClick={() => setGuiaLeitura(prev => (prev + 1) % 3)} aria-label={`Alternar guia de leitura. Estado atual: ${obterTextoGuiaLeitura()}`}>
                {obterTextoGuiaLeitura()}
              </button>
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              <BookOpen size={16} /> Leitura Daltônica
            </h4>
            <div className="controlesBotoes">
              <button onClick={() => setModoDaltonico(prev => (prev + 1) % 4)} aria-label={`Alternar modo daltônico. Estado atual: ${obterTextoModoDaltonico()}`}>
                {obterTextoModoDaltonico()}
              </button>
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              <EyeOff size={16} /> Ocultar Imagens
            </h4>
            <div className="controlesBotoes">
              <button onClick={() => setRemoverImagens(!removerImagens)} aria-pressed={removerImagens}>
                {removerImagens ? 'Ativado' : 'Desativado'}
              </button>
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              <EyeOff size={16} /> Ocultar Cabeçalhos
            </h4>
            <div className="controlesBotoes">
              <button onClick={() => setRemoverCabecalhos(!removerCabecalhos)} aria-pressed={removerCabecalhos}>
                {removerCabecalhos ? 'Ativado' : 'Desativado'}
              </button>
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              <Link size={16} /> Destacar Links
            </h4>
            <div className="controlesBotoes">
              <button onClick={() => setDestacarLinks(!destacarLinks)} aria-pressed={destacarLinks}>
                {destacarLinks ? 'Ativado' : 'Desativado'}
              </button>
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              <Pause size={16} /> Pausar Animações
            </h4>
            <div className="controlesBotoes">
              <button onClick={() => setPausarAnimacoes(!pausarAnimacoes)} aria-pressed={pausarAnimacoes}>
                {pausarAnimacoes ? 'Ativado' : 'Desativado'}
              </button>
            </div>
          </div>

          <div className="secao">
            <h4 className="tituloSecao">
              <MousePointer size={16} /> Cursor Grande
            </h4>
            <div className="controlesBotoes">
              <button onClick={() => setCursorGrande(!cursorGrande)} aria-pressed={cursorGrande}>
                {cursorGrande ? 'Ativado' : 'Desativado'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlesAcessibilidade;
