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

const AccessibilityControlsFinal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  
  // Estados para múltiplas variações
  const [contrastMode, setContrastMode] = useState(0); // 0: desativado, 1: leve, 2: intenso
  const [darkMode, setDarkMode] = useState(0); // 0: claro, 1: escuro, 2: automático
  const [readingGuide, setReadingGuide] = useState(0); // 0: off, 1: barra horizontal, 2: máscara
  const [focusMode, setFocusMode] = useState(0); // 0: normal, 1: destacado, 2: máximo
  
  // Novas funcionalidades
  const [removeImages, setRemoveImages] = useState(false);
  const [removeHeaders, setRemoveHeaders] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [magnifier, setMagnifier] = useState(false);
  const [colorIntensity, setColorIntensity] = useState(1); // 0: 50%, 1: 100%, 2: 150%
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
      colorIntensity: carregarConfiguracao('colorIntensity', 1),
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
    root.classList.remove('contraste-desativado', 'contraste-leve', 'contraste-intenso');
    
    switch(contrastMode) {
      case 1:
        root.classList.add('contraste-leve');
        break;
      case 2:
        root.classList.add('contraste-intenso');
        break;
      default:
        root.classList.add('contraste-desativado');
    }
    
    salvarConfiguracao('contrastMode', contrastMode);
  }, [contrastMode, salvarConfiguracao]);

  // Aplicar modos escuros
  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('tema-claro', 'tema-escuro', 'tema-automatico');
    
    switch(darkMode) {
      case 1:
        root.classList.add('tema-escuro');
        break;
      case 2:
        root.classList.add('tema-automatico');
        break;
      default:
        root.classList.add('tema-claro');
    }
    
    salvarConfiguracao('darkMode', darkMode);
  }, [darkMode, salvarConfiguracao]);

  // Guia de leitura que segue o mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (readingGuide === 1 && mouseGuideRef.current) {
        // Barra horizontal que segue o mouse
        mouseGuideRef.current.style.top = `${e.clientY}px`;
        mouseGuideRef.current.style.left = '0px';
        mouseGuideRef.current.style.width = '100vw';
        mouseGuideRef.current.style.height = '2px';
        
        // Indicador de posição do cursor
        const indicator = mouseGuideRef.current.querySelector('.cursor-indicator');
        if (indicator) {
          indicator.style.left = `${e.clientX}px`;
        }
      } else if (readingGuide === 2 && maskRef.current) {
        // Máscara que segue o mouse
        maskRef.current.style.top = `${e.clientY - 100}px`;
        maskRef.current.style.left = `${e.clientX - 150}px`;
      }
    };

    if (readingGuide === 1) {
      document.addEventListener('mousemove', handleMouseMove);
      if (!mouseGuideRef.current) {
        const guide = document.createElement('div');
        guide.className = 'horizontal-reading-guide';
        guide.innerHTML = '<div class="cursor-indicator"></div>';
        document.body.appendChild(guide);
        mouseGuideRef.current = guide;
      }
    } else if (readingGuide === 2) {
      document.addEventListener('mousemove', handleMouseMove);
      if (!maskRef.current) {
        const mask = document.createElement('div');
        mask.className = 'reading-mask';
        document.body.appendChild(mask);
        maskRef.current = mask;
      }
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      if (mouseGuideRef.current) {
        mouseGuideRef.current.remove();
        mouseGuideRef.current = null;
      }
      if (maskRef.current) {
        maskRef.current.remove();
        maskRef.current = null;
      }
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
    const intensityValues = ['0.5', '1', '1.5'];
    root.style.setProperty('--color-intensity', intensityValues[colorIntensity]);

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
        setFontSize(prev => Math.min(prev + 5, 150));
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

  // Funções de controle de texto
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
    setColorIntensity(1);
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
      'acessibilidade-ativa', 'contraste-leve', 'contraste-intenso', 'tema-escuro', 'tema-automatico',
      'focus-destacado', 'focus-maximo', 'remover-imagens', 'remover-cabecalhos', 'destacar-links', 
      'lupa-ativa', 'pausar-animacoes', 'cursor-grande', 'leitor-ativo',
      'daltonico-protanopia', 'daltonico-deuteranopia', 'daltonico-tritanopia'
    ];
    
    classes.forEach(classe => root.classList.remove(classe));
    
    // Limpar guias de leitura
    if (mouseGuideRef.current) {
      mouseGuideRef.current.remove();
      mouseGuideRef.current = null;
    }
    if (maskRef.current) {
      maskRef.current.remove();
      maskRef.current = null;
    }
  };

  // Função para obter texto do modo atual
  const getContrastModeText = () => {
    switch(contrastMode) {
      case 1: return 'Leve';
      case 2: return 'Intenso';
      default: return 'Desativado';
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
      case 1: return 'Barra';
      case 2: return 'Máscara';
      default: return 'Desativado';
    }
  };

  const getFocusModeText = () => {
    switch(focusMode) {
      case 1: return 'Destacado';
      case 2: return 'Máximo';
      default: return 'Normal';
    }
  };

  const getColorIntensityText = () => {
    switch(colorIntensity) {
      case 0: return '50%';
      case 2: return '150%';
      default: return '100%';
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
    <div className="accessibility-controls-final">
      <button 
        className="accessibility-toggle-final"
        onClick={togglePanel}
        aria-label="Abrir controles de acessibilidade (Alt + A)"
        title="Controles de Acessibilidade (Alt + A)"
      >
        <Accessibility size={24} />
      </button>

      {isOpen && (
        <div className="accessibility-panel-final" role="dialog" aria-label="Painel de controles de acessibilidade">
          <div className="accessibility-header-final">
            <div className="header-title">
              <Accessibility size={20} />
              <h3>Acessibilidade</h3>
            </div>
            <button 
              className="close-button-final"
              onClick={togglePanel}
              aria-label="Fechar controles"
            >
              <X size={18} />
            </button>
          </div>

          <div className="accessibility-content-final">
            {/* Seção de Texto */}
            <div className="section-final">
              <h4 className="section-title">1. Controles de Texto</h4>
              
              {/* Tamanho da Fonte */}
              <div className="control-group-final">
                <div className="control-header-final">
                  <Type size={16} />
                  <span>Tamanho da Fonte</span>
                  <span className="control-value-final">{fontSize}%</span>
                </div>
                <div className="control-buttons-final">
                  <button onClick={decreaseFontSize} className="control-btn-final decrease">A-</button>
                  <button onClick={resetFontSize} className="control-btn-final reset">A</button>
                  <button onClick={increaseFontSize} className="control-btn-final increase">A+</button>
                </div>
              </div>

              {/* Espaçamento entre Letras */}
              <div className="control-group-final">
                <div className="control-header-final">
                  <MoreHorizontal size={16} />
                  <span>Espaço entre Letras</span>
                  <span className="control-value-final">{letterSpacing}px</span>
                </div>
                <div className="control-buttons-final">
                  <button onClick={decreaseLetterSpacing} className="control-btn-final decrease">-</button>
                  <button onClick={resetLetterSpacing} className="control-btn-final reset">0</button>
                  <button onClick={increaseLetterSpacing} className="control-btn-final increase">+</button>
                </div>
              </div>

              {/* Altura da Linha */}
              <div className="control-group-final">
                <div className="control-header-final">
                  <AlignJustify size={16} />
                  <span>Espaço entre Linhas</span>
                  <span className="control-value-final">{lineHeight.toFixed(2)}</span>
                </div>
                <div className="control-buttons-final">
                  <button onClick={decreaseLineHeight} className="control-btn-final decrease">-</button>
                  <button onClick={resetLineHeight} className="control-btn-final reset">1.5</button>
                  <button onClick={increaseLineHeight} className="control-btn-final increase">+</button>
                </div>
              </div>
            </div>

            {/* Seção de Aparência */}
            <div className="section-final">
              <h4 className="section-title">2. Aparência e Cores</h4>
              
              {/* Contraste */}
              <div className="multi-option-control">
                <div className="control-header-final">
                  <Contrast size={16} />
                  <span>Contraste</span>
                  <span className="control-value-final">{getContrastModeText()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setContrastMode(0)}
                    className={`multi-btn ${contrastMode === 0 ? 'active' : ''}`}
                  >Desativado</button>
                  <button 
                    onClick={() => setContrastMode(1)}
                    className={`multi-btn ${contrastMode === 1 ? 'active' : ''}`}
                  >Leve</button>
                  <button 
                    onClick={() => setContrastMode(2)}
                    className={`multi-btn ${contrastMode === 2 ? 'active' : ''}`}
                  >Intenso</button>
                </div>
              </div>

              {/* Modo Escuro */}
              <div className="multi-option-control">
                <div className="control-header-final">
                  {darkMode === 1 ? <Moon size={16} /> : <Sun size={16} />}
                  <span>Tema</span>
                  <span className="control-value-final">{getDarkModeText()}</span>
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
              <div className="multi-option-control">
                <div className="control-header-final">
                  <Palette size={16} />
                  <span>Intensidade de Cores</span>
                  <span className="control-value-final">{getColorIntensityText()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setColorIntensity(0)}
                    className={`multi-btn ${colorIntensity === 0 ? 'active' : ''}`}
                  >50%</button>
                  <button 
                    onClick={() => setColorIntensity(1)}
                    className={`multi-btn ${colorIntensity === 1 ? 'active' : ''}`}
                  >100%</button>
                  <button 
                    onClick={() => setColorIntensity(2)}
                    className={`multi-btn ${colorIntensity === 2 ? 'active' : ''}`}
                  >150%</button>
                </div>
              </div>

              {/* Modo Daltônico */}
              <div className="multi-option-control">
                <div className="control-header-final">
                  <Eye size={16} />
                  <span>Modo Daltônico</span>
                  <span className="control-value-final">{getColorBlindModeText()}</span>
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
            <div className="section-final">
              <h4 className="section-title">3. Navegação e Leitura</h4>
              
              {/* Guia de Leitura */}
              <div className="multi-option-control">
                <div className="control-header-final">
                  <BookOpen size={16} />
                  <span>Guia de Leitura</span>
                  <span className="control-value-final">{getReadingGuideText()}</span>
                </div>
                <div className="multi-buttons">
                  <button 
                    onClick={() => setReadingGuide(0)}
                    className={`multi-btn ${readingGuide === 0 ? 'active' : ''}`}
                  >Desativado</button>
                  <button 
                    onClick={() => setReadingGuide(1)}
                    className={`multi-btn ${readingGuide === 1 ? 'active' : ''}`}
                  >Barra</button>
                  <button 
                    onClick={() => setReadingGuide(2)}
                    className={`multi-btn ${readingGuide === 2 ? 'active' : ''}`}
                  >Máscara</button>
                </div>
              </div>

              {/* Focus Visível */}
              <div className="multi-option-control">
                <div className="control-header-final">
                  <Zap size={16} />
                  <span>Focus Visível</span>
                  <span className="control-value-final">{getFocusModeText()}</span>
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
              <div className="toggle-control-final">
                <div className="toggle-header-final">
                  <Link size={16} />
                  <span>Destacar Links</span>
                </div>
                <button 
                  onClick={() => setHighlightLinks(prev => !prev)}
                  className={`toggle-btn-final ${highlightLinks ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-final"></div>
                </button>
              </div>

              <div className="toggle-control-final">
                <div className="toggle-header-final">
                  <Search size={16} />
                  <span>Lupa de Conteúdo</span>
                </div>
                <button 
                  onClick={() => setMagnifier(prev => !prev)}
                  className={`toggle-btn-final ${magnifier ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-final"></div>
                </button>
              </div>

              <div className="toggle-control-final">
                <div className="toggle-header-final">
                  <MousePointer size={16} />
                  <span>Cursor Grande</span>
                </div>
                <button 
                  onClick={() => setBigCursor(prev => !prev)}
                  className={`toggle-btn-final ${bigCursor ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-final"></div>
                </button>
              </div>

              <div className="toggle-control-final">
                <div className="toggle-header-final">
                  <Pause size={16} />
                  <span>Pausar Animações</span>
                </div>
                <button 
                  onClick={() => setPauseAnimations(prev => !prev)}
                  className={`toggle-btn-final ${pauseAnimations ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-final"></div>
                </button>
              </div>
            </div>

            {/* Seção para Leitores de Tela */}
            <div className="section-final">
              <h4 className="section-title">4. Leitores de Tela</h4>
              
              <div className="toggle-control-final">
                <div className="toggle-header-final">
                  <EyeOff size={16} />
                  <span>Remover Imagens</span>
                </div>
                <button 
                  onClick={() => setRemoveImages(prev => !prev)}
                  className={`toggle-btn-final ${removeImages ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-final"></div>
                </button>
              </div>

              <div className="toggle-control-final">
                <div className="toggle-header-final">
                  <Type size={16} />
                  <span>Remover Cabeçalhos</span>
                </div>
                <button 
                  onClick={() => setRemoveHeaders(prev => !prev)}
                  className={`toggle-btn-final ${removeHeaders ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-final"></div>
                </button>
              </div>

              <div className="toggle-control-final">
                <div className="toggle-header-final">
                  <Volume2 size={16} />
                  <span>Leitor de Voz</span>
                </div>
                <button 
                  onClick={() => setSpeechReader(prev => !prev)}
                  className={`toggle-btn-final ${speechReader ? 'ativo' : ''}`}
                >
                  <div className="toggle-slider-final"></div>
                </button>
              </div>
            </div>

            {/* Atalhos */}
            <div className="shortcuts-section-final">
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

          {/* Botão de Reset sempre visível */}
          <div className="reset-section-final">
            <button 
              onClick={resetAll}
              className="reset-all-btn-final"
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

export default AccessibilityControlsFinal;

