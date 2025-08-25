import React, { useState, useEffect, useCallback, useRef } from 'react';
import './controles.css';
import { 
  Type, 
  AlignJustify, 
  MoreHorizontal, 
  Settings, 
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
  Search,
  Palette,
  EyeOff,
  Volume2,
  BookOpen,
  Zap
} from 'lucide-react';

const AccessibilityControlsComplete = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  
  // Estados para múltiplas variações
  const [contrastMode, setContrastMode] = useState(0); // 0: normal, 1: alto, 2: invertido
  const [darkMode, setDarkMode] = useState(0); // 0: claro, 1: escuro, 2: automático
  const [readingGuide, setReadingGuide] = useState(0); // 0: off, 1: linha, 2: máscara
  const [focusMode, setFocusMode] = useState(0); // 0: normal, 1: destacado, 2: máximo
  
  // Novas funcionalidades
  const [removeImages, setRemoveImages] = useState(false);
  const [removeHeaders, setRemoveHeaders] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [magnifier, setMagnifier] = useState(false);
  const [colorIntensity, setColorIntensity] = useState(100);
  const [colorBlindMode, setColorBlindMode] = useState(0); // 0: normal, 1: protanopia, 2: deuteranopia, 3: tritanopia
  const [pauseAnimations, setPauseAnimations] = useState(false);
  const [bigCursor, setBigCursor] = useState(false);
  const [speechReader, setSpeechReader] = useState(false);
  
  // Refs para guia de leitura
  const mouseGuideRef = useRef(null);
  const maskRef = useRef(null);

  // Funções para localStorage
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

  // Carregar configurações salvas
  useEffect(() => {
    const configuracoes = {
      fontSize: carregarConfiguracao('fontSize', 100),
      letterSpacing: carregarConfiguracao('letterSpacing', 0),
      lineHeight: carregarConfiguracao('lineHeight', 1.5),
      contrastMode: carregarConfiguracao('contrastMode', 0),
      darkMode: carregarConfiguracao('darkMode', 0),
      readingGuide: carregarConfiguracao('readingGuide', 0),
      focusMode: carregarConfiguracao('focusMode', 0),
      removeImages: carregarConfiguracao('removeImages', false),
      removeHeaders: carregarConfiguracao('removeHeaders', false),
      highlightLinks: carregarConfiguracao('highlightLinks', false),
      magnifier: carregarConfiguracao('magnifier', false),
      colorIntensity: carregarConfiguracao('colorIntensity', 100),
      colorBlindMode: carregarConfiguracao('colorBlindMode', 0),
      pauseAnimations: carregarConfiguracao('pauseAnimations', false),
      bigCursor: carregarConfiguracao('bigCursor', false),
      speechReader: carregarConfiguracao('speechReader', false)
    };

    setFontSize(configuracoes.fontSize);
    setLetterSpacing(configuracoes.letterSpacing);
    setLineHeight(configuracoes.lineHeight);
    setContrastMode(configuracoes.contrastMode);
    setDarkMode(configuracoes.darkMode);
    setReadingGuide(configuracoes.readingGuide);
    setFocusMode(configuracoes.focusMode);
    setRemoveImages(configuracoes.removeImages);
    setRemoveHeaders(configuracoes.removeHeaders);
    setHighlightLinks(configuracoes.highlightLinks);
    setMagnifier(configuracoes.magnifier);
    setColorIntensity(configuracoes.colorIntensity);
    setColorBlindMode(configuracoes.colorBlindMode);
    setPauseAnimations(configuracoes.pauseAnimations);
    setBigCursor(configuracoes.bigCursor);
    setSpeechReader(configuracoes.speechReader);
  }, [carregarConfiguracao]);

  // Aplicar configurações de texto
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar com incrementos menores para suavidade
    root.style.setProperty('--accessibility-font-size', `${fontSize}%`);
    root.style.setProperty('--accessibility-letter-spacing', `${letterSpacing}px`);
    root.style.setProperty('--accessibility-line-height', lineHeight);

    const temMudancas = fontSize !== 100 || letterSpacing !== 0 || lineHeight !== 1.5;
    
    if (temMudancas) {
      root.classList.add('acessibilidade-ativa');
    } else {
      root.classList.remove('acessibilidade-ativa');
    }
    
    salvarConfiguracao('fontSize', fontSize);
    salvarConfiguracao('letterSpacing', letterSpacing);
    salvarConfiguracao('lineHeight', lineHeight);
  }, [fontSize, letterSpacing, lineHeight, salvarConfiguracao]);

  // Aplicar modos de contraste
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover classes anteriores
    root.classList.remove('contraste-normal', 'contraste-alto', 'contraste-invertido');
    
    switch(contrastMode) {
      case 1:
        root.classList.add('contraste-alto');
        break;
      case 2:
        root.classList.add('contraste-invertido');
        break;
      default:
        root.classList.add('contraste-normal');
    }
    
    salvarConfiguracao('contrastMode', contrastMode);
  }, [contrastMode, salvarConfiguracao]);

  // Aplicar modos escuros
  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('modo-claro', 'modo-escuro', 'modo-automatico');
    
    switch(darkMode) {
      case 1:
        root.classList.add('modo-escuro');
        break;
      case 2:
        root.classList.add('modo-automatico');
        break;
      default:
        root.classList.add('modo-claro');
    }
    
    salvarConfiguracao('darkMode', darkMode);
  }, [darkMode, salvarConfiguracao]);

  // Guia de leitura que segue o mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (readingGuide === 1 && mouseGuideRef.current) {
        mouseGuideRef.current.style.top = `${e.clientY}px`;
        mouseGuideRef.current.style.left = `${e.clientX}px`;
      }
    };

    if (readingGuide === 1) {
      document.addEventListener('mousemove', handleMouseMove);
      if (!mouseGuideRef.current) {
        const guide = document.createElement('div');
        guide.className = 'mouse-reading-guide';
        guide.innerHTML = '<div class="guide-pointer"></div>';
        document.body.appendChild(guide);
        mouseGuideRef.current = guide;
      }
    } else if (mouseGuideRef.current) {
      document.removeEventListener('mousemove', handleMouseMove);
      mouseGuideRef.current.remove();
      mouseGuideRef.current = null;
    }

    // Máscara de leitura
    const root = document.documentElement;
    root.classList.remove('guia-linha', 'guia-mascara');
    
    if (readingGuide === 1) {
      root.classList.add('guia-linha');
    } else if (readingGuide === 2) {
      root.classList.add('guia-mascara');
    }

    salvarConfiguracao('readingGuide', readingGuide);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [readingGuide, salvarConfiguracao]);

  // Aplicar outras configurações
  useEffect(() => {
    const root = document.documentElement;
    
    // Focus modes
    root.classList.remove('focus-normal', 'focus-destacado', 'focus-maximo');
    switch(focusMode) {
      case 1:
        root.classList.add('focus-destacado');
        break;
      case 2:
        root.classList.add('focus-maximo');
        break;
      default:
        root.classList.add('focus-normal');
    }

    // Outras funcionalidades
    root.classList.toggle('remover-imagens', removeImages);
    root.classList.toggle('remover-cabecalhos', removeHeaders);
    root.classList.toggle('destacar-links', highlightLinks);
    root.classList.toggle('lupa-ativa', magnifier);
    root.classList.toggle('pausar-animacoes', pauseAnimations);
    root.classList.toggle('cursor-grande', bigCursor);
    root.classList.toggle('leitor-ativo', speechReader);

    // Intensidade de cores
    root.style.setProperty('--color-intensity', `${colorIntensity}%`);

    // Modo daltônico
    root.classList.remove('daltonico-normal', 'daltonico-protanopia', 'daltonico-deuteranopia', 'daltonico-tritanopia');
    switch(colorBlindMode) {
      case 1:
        root.classList.add('daltonico-protanopia');
        break;
      case 2:
        root.classList.add('daltonico-deuteranopia');
        break;
      case 3:
        root.classList.add('daltonico-tritanopia');
        break;
      default:
        root.classList.add('daltonico-normal');
    }

    // Salvar configurações
    salvarConfiguracao('focusMode', focusMode);
    salvarConfiguracao('removeImages', removeImages);
    salvarConfiguracao('removeHeaders', removeHeaders);
    salvarConfiguracao('highlightLinks', highlightLinks);
    salvarConfiguracao('magnifier', magnifier);
    salvarConfiguracao('colorIntensity', colorIntensity);
    salvarConfiguracao('colorBlindMode', colorBlindMode);
    salvarConfiguracao('pauseAnimations', pauseAnimations);
    salvarConfiguracao('bigCursor', bigCursor);
    salvarConfiguracao('speechReader', speechReader);
  }, [focusMode, removeImages, removeHeaders, highlightLinks, magnifier, colorIntensity, colorBlindMode, pauseAnimations, bigCursor, speechReader, salvarConfiguracao]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (event.altKey && event.key === 'c') {
        event.preventDefault();
        setContrastMode(prev => (prev + 1) % 3);
      }
      if (event.altKey && event.key === 'd') {
        event.preventDefault();
        setDarkMode(prev => (prev + 1) % 3);
      }
      if (event.altKey && event.key === '+') {
        event.preventDefault();
        setFontSize(prev => Math.min(prev + 5, 150)); // Incrementos menores
      }
      if (event.altKey && event.key === '-') {
        event.preventDefault();
        setFontSize(prev => Math.max(prev - 5, 80));
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Funções de controle de texto com incrementos menores
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 5, 150));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 5, 80));
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  const increaseLetterSpacing = () => {
    setLetterSpacing(prev => Math.min(prev + 0.25, 5));
  };

  const decreaseLetterSpacing = () => {
    setLetterSpacing(prev => Math.max(prev - 0.25, -1));
  };

  const resetLetterSpacing = () => {
    setLetterSpacing(0);
  };

  const increaseLineHeight = () => {
    setLineHeight(prev => Math.min(prev + 0.05, 2.5));
  };

  const decreaseLineHeight = () => {
    setLineHeight(prev => Math.max(prev - 0.05, 1.0));
  };

  const resetLineHeight = () => {
    setLineHeight(1.5);
  };

  const resetAll = () => {
    setFontSize(100);
    setLetterSpacing(0);
    setLineHeight(1.5);
    setContrastMode(0);
    setDarkMode(0);
    setReadingGuide(0);
    setFocusMode(0);
    setRemoveImages(false);
    setRemoveHeaders(false);
    setHighlightLinks(false);
    setMagnifier(false);
    setColorIntensity(100);
    setColorBlindMode(0);
    setPauseAnimations(false);
    setBigCursor(false);
    setSpeechReader(false);
    
    // Limpar localStorage
    const chaves = [
      'fontSize', 'letterSpacing', 'lineHeight', 'contrastMode', 'darkMode',
      'readingGuide', 'focusMode', 'removeImages', 'removeHeaders', 'highlightLinks',
      'magnifier', 'colorIntensity', 'colorBlindMode', 'pauseAnimations', 'bigCursor', 'speechReader'
    ];
    
    chaves.forEach(chave => {
      try {
        localStorage.removeItem(`acessibilidade_${chave}`);
      } catch (error) {
        console.warn('Erro ao limpar configuração:', error);
      }
    });
    
    // Remover classes do elemento raiz
    const root = document.documentElement;
    const classes = [
      'acessibilidade-ativa', 'contraste-alto', 'contraste-invertido', 'modo-escuro', 'modo-automatico',
      'guia-linha', 'guia-mascara', 'focus-destacado', 'focus-maximo', 'remover-imagens',
      'remover-cabecalhos', 'destacar-links', 'lupa-ativa', 'pausar-animacoes', 'cursor-grande', 'leitor-ativo',
      'daltonico-protanopia', 'daltonico-deuteranopia', 'daltonico-tritanopia'
    ];
    
    classes.forEach(classe => root.classList.remove(classe));
    
    // Limpar guia de leitura
    if (mouseGuideRef.current) {
      mouseGuideRef.current.remove();
      mouseGuideRef.current = null;
    }
  };

  // Função para obter texto do modo atual
  const getContrastModeText = () => {
    switch(contrastMode) {
      case 1: return 'Alto';
      case 2: return 'Invertido';
      default: return 'Normal';
    }
  };

  const getDarkModeText = () => {
    switch(darkMode) {
      case 1: return 'Escuro';
      case 2: return 'Auto';
      default: return 'Claro';
    }
  };

  const getReadingGuideText = () => {
    switch(readingGuide) {
      case 1: return 'Linha';
      case 2: return 'Máscara';
      default: return 'Desligado';
    }
  };

  const getFocusModeText = () => {
    switch(focusMode) {
      case 1: return 'Destacado';
      case 2: return 'Máximo';
      default: return 'Normal';
    }
  };

  const getColorBlindModeText = () => {
    switch(colorBlindMode) {
      case 1: return 'Protanopia';
      case 2: return 'Deuteranopia';
      case 3: return 'Tritanopia';
      default: return 'Normal';
    }
  };

  return (
    <div className="accessibility-controls-complete">
      <button 
        className="accessibility-toggle-complete"
        onClick={togglePanel}
        aria-label="Abrir controles de acessibilidade (Alt + A)"
        title="Controles de Acessibilidade (Alt + A)"
      >
        <Accessibility size={24} />
      </button>

      {isOpen && (
        <div className="accessibility-panel-complete" role="dialog" aria-label="Painel de controles de acessibilidade">
          <div className="accessibility-header-complete">
            <div className="header-title">
              <Accessibility size={20} />
              <h3>Acessibilidade</h3>
            </div>
            <button 
              className="close-button-complete"
              onClick={togglePanel}
              aria-label="Fechar controles"
            >
              <X size={18} />
            </button>
          </div>

          <div className="accessibility-content-complete">
            {/* Seção de Texto */}
            <div className="section-complete">
              <h4 className="section-title">1. Controles de Texto</h4>
              
              {/* Tamanho da Fonte */}
              <div className="control-group-complete">
                <div className="control-header-complete">
                  <Type size={16} />
                  <span>Tamanho da Fonte</span>
                  <span className="control-value-complete">{fontSize}%</span>
                </div>
                <div className="control-buttons-complete">
                  <button onClick={decreaseFontSize} className="control-btn-complete decrease">A-</button>
                  <button onClick={resetFontSize} className="control-btn-complete reset">A</button>
                  <button onClick={increaseFontSize} className="control-btn-complete increase">A+</button>
                </div>
              </div>

              {/* Espaçamento entre Letras */}
              <div className="control-group-complete">
                <div className="control-header-complete">
                  <MoreHorizontal size={16} />
                  <span>Espaço entre Letras</span>
                  <span className="control-value-complete">{letterSpacing}px</span>
                </div>
                <div className="control-buttons-complete">
                  <button onClick={decreaseLetterSpacing} className="control-btn-complete decrease">-</button>
                  <button onClick={resetLetterSpacing} className="control-btn-complete reset">0</button>
                  <button onClick={increaseLetterSpacing} className="control-btn-complete increase">+</button>
                </div>
              </div>

              {/* Altura da Linha */}
              <div className="control-group-complete">
                <div className="control-header-complete">
                  <AlignJustify size={16} />
                  <span>Espaço entre Linhas</span>
                  <span className="control-value-complete">{lineHeight.toFixed(2)}</span>
                </div>
                <div className="control-buttons-complete">
                  <button onClick={decreaseLineHeight} className="control-btn-complete decrease">-</button>
                  <button onClick={resetLineHeight} className="control-btn-complete reset">1.5</button>
                  <button onClick={increaseLineHeight} className="control-btn-complete increase">+</button>
                </div>
              </div>
            </div>

            {/* Seção de Aparência */}
            <div className="section-complete">
              <h4 className="section-title">2. Aparência e Cores</h4>
              
              {/* Contraste */}
              <div className="multi-option-control">
                <div className="control-header-complete">
                  <Contrast size={16} />
                  <span>Contraste</span>
                  <span className="control-value-complete">{getContrastModeText()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setContrastMode(0)}
                    className={`multi-btn ${contrastMode === 0 ? 'active' : ''}`}
                  >Normal</button>
                  <button 
                    onClick={() => setContrastMode(1)}
                    className={`multi-btn ${contrastMode === 1 ? 'active' : ''}`}
                  >Alto</button>
                  <button 
                    onClick={() => setContrastMode(2)}
                    className={`multi-btn ${contrastMode === 2 ? 'active' : ''}`}
                  >Invertido</button>
                </div>
              </div>

              {/* Modo Escuro */}
              <div className="multi-option-control">
                <div className="control-header-complete">
                  {darkMode === 1 ? <Moon size={16} /> : <Sun size={16} />}
                  <span>Tema</span>
                  <span className="control-value-complete">{getDarkModeText()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setDarkMode(0)}
                    className={`multi-btn ${darkMode === 0 ? 'active' : ''}`}
                  >Claro</button>
                  <button 
                    onClick={() => setDarkMode(1)}
                    className={`multi-btn ${darkMode === 1 ? 'active' : ''}`}
                  >Escuro</button>
                  <button 
                    onClick={() => setDarkMode(2)}
                    className={`multi-btn ${darkMode === 2 ? 'active' : ''}`}
                  >Auto</button>
                </div>
              </div>

              {/* Intensidade de Cores */}
              <div className="control-group-complete">
                <div className="control-header-complete">
                  <Palette size={16} />
                  <span>Intensidade de Cores</span>
                  <span className="control-value-complete">{colorIntensity}%</span>
                </div>
                <div className="control-buttons-complete">
                  <button 
                    onClick={() => setColorIntensity(prev => Math.max(prev - 10, 50))}
                    className="control-btn-complete decrease"
                  >-</button>
                  <button 
                    onClick={() => setColorIntensity(100)}
                    className="control-btn-complete reset"
                  >100%</button>
                  <button 
                    onClick={() => setColorIntensity(prev => Math.min(prev + 10, 150))}
                    className="control-btn-complete increase"
                  >+</button>
                </div>
              </div>

              {/* Modo Daltônico */}
              <div className="multi-option-control">
                <div className="control-header-complete">
                  <Eye size={16} />
                  <span>Modo Daltônico</span>
                  <span className="control-value-complete">{getColorBlindModeText()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setColorBlindMode(0)}
                    className={`multi-btn ${colorBlindMode === 0 ? 'active' : ''}`}
                  >Normal</button>
                  <button 
                    onClick={() => setColorBlindMode(1)}
                    className={`multi-btn ${colorBlindMode === 1 ? 'active' : ''}`}
                  >Protanopia</button>
                  <button 
                    onClick={() => setColorBlindMode(2)}
                    className={`multi-btn ${colorBlindMode === 2 ? 'active' : ''}`}
                  >Deuteranopia</button>
                  <button 
                    onClick={() => setColorBlindMode(3)}
                    className={`multi-btn ${colorBlindMode === 3 ? 'active' : ''}`}
                  >Tritanopia</button>
                </div>
              </div>
            </div>

            {/* Seção de Navegação e Leitura */}
            <div className="section-complete">
              <h4 className="section-title">3. Navegação e Leitura</h4>
              
              {/* Guia de Leitura */}
              <div className="multi-option-control">
                <div className="control-header-complete">
                  <BookOpen size={16} />
                  <span>Guia de Leitura</span>
                  <span className="control-value-complete">{getReadingGuideText()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setReadingGuide(0)}
                    className={`multi-btn ${readingGuide === 0 ? 'active' : ''}`}
                  >Desligado</button>
                  <button 
                    onClick={() => setReadingGuide(1)}
                    className={`multi-btn ${readingGuide === 1 ? 'active' : ''}`}
                  >Linha</button>
                  <button 
                    onClick={() => setReadingGuide(2)}
                    className={`multi-btn ${readingGuide === 2 ? 'active' : ''}`}
                  >Máscara</button>
                </div>
              </div>

              {/* Focus Visível */}
              <div className="multi-option-control">
                <div className="control-header-complete">
                  <Zap size={16} />
                  <span>Focus Visível</span>
                  <span className="control-value-complete">{getFocusModeText()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setFocusMode(0)}
                    className={`multi-btn ${focusMode === 0 ? 'active' : ''}`}
                  >Normal</button>
                  <button 
                    onClick={() => setFocusMode(1)}
                    className={`multi-btn ${focusMode === 1 ? 'active' : ''}`}
                  >Destacado</button>
                  <button 
                    onClick={() => setFocusMode(2)}
                    className={`multi-btn ${focusMode === 2 ? 'active' : ''}`}
                  >Máximo</button>
                </div>
              </div>

              {/* Toggles */}
              <div className="toggle-control-complete">
                <div className="toggle-header-complete">
                  <Link size={16} />
                  <span>Destacar Links</span>
                </div>
                <button 
                  onClick={() => setHighlightLinks(prev => !prev)}
                  className={`toggle-btn-complete ${highlightLinks ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-complete"></div>
                </button>
              </div>

              <div className="toggle-control-complete">
                <div className="toggle-header-complete">
                  <Search size={16} />
                  <span>Lupa de Conteúdo</span>
                </div>
                <button 
                  onClick={() => setMagnifier(prev => !prev)}
                  className={`toggle-btn-complete ${magnifier ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-complete"></div>
                </button>
              </div>

              <div className="toggle-control-complete">
                <div className="toggle-header-complete">
                  <MousePointer size={16} />
                  <span>Cursor Grande</span>
                </div>
                <button 
                  onClick={() => setBigCursor(prev => !prev)}
                  className={`toggle-btn-complete ${bigCursor ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-complete"></div>
                </button>
              </div>

              <div className="toggle-control-complete">
                <div className="toggle-header-complete">
                  <Pause size={16} />
                  <span>Pausar Animações</span>
                </div>
                <button 
                  onClick={() => setPauseAnimations(prev => !prev)}
                  className={`toggle-btn-complete ${pauseAnimations ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-complete"></div>
                </button>
              </div>
            </div>

            {/* Seção para Leitores de Tela */}
            <div className="section-complete">
              <h4 className="section-title">4. Leitores de Tela</h4>
              
              <div className="toggle-control-complete">
                <div className="toggle-header-complete">
                  <EyeOff size={16} />
                  <span>Remover Imagens</span>
                </div>
                <button 
                  onClick={() => setRemoveImages(prev => !prev)}
                  className={`toggle-btn-complete ${removeImages ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-complete"></div>
                </button>
              </div>

              <div className="toggle-control-complete">
                <div className="toggle-header-complete">
                  <Type size={16} />
                  <span>Remover Cabeçalhos</span>
                </div>
                <button 
                  onClick={() => setRemoveHeaders(prev => !prev)}
                  className={`toggle-btn-complete ${removeHeaders ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-complete"></div>
                </button>
              </div>

              <div className="toggle-control-complete">
                <div className="toggle-header-complete">
                  <Volume2 size={16} />
                  <span>Leitor de Voz</span>
                </div>
                <button 
                  onClick={() => setSpeechReader(prev => !prev)}
                  className={`toggle-btn-complete ${speechReader ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-complete"></div>
                </button>
              </div>
            </div>

            {/* Botão de Reset */}
            <div className="reset-section-complete">
              <button 
                onClick={resetAll}
                className="reset-all-btn-complete"
                aria-label="Resetar todas as configurações"
              >
                <RotateCcw size={16} />
                Resetar Tudo
              </button>
            </div>

            {/* Atalhos */}
            <div className="shortcuts-section-complete">
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
        </div>
      )}
    </div>
  );
};

export default AccessibilityControlsComplete;

