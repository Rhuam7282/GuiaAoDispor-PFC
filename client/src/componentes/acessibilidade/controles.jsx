import React, { useState, useEffect, useCallback, useRef } from 'react';
import './controles.css';
import { Type, AlignJustify, MoreHorizontal, Settings, Contrast, Eye, Minus } from 'lucide-react';

const AccessibilityControlsComplete = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100); // Porcentagem base
  const [letterSpacing, setLetterSpacing] = useState(0); // Em pixels
  const [lineHeight, setLineHeight] = useState(1.5); // Multiplicador
  const [modoAltoContraste, setModoAltoContraste] = useState(false); // Estado do alto contraste
  const [mascaraLeitura, setMascaraLeitura] = useState(false); // Estado da máscara de leitura
  const [guiaLeitura, setGuiaLeitura] = useState(false); // Estado da guia de leitura

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
  };

  // Carregar configurações salvas na inicialização
  useEffect(() => {
    const fontSizeSalvo = carregarConfiguracao('fontSize', 100);
    const letterSpacingSalvo = carregarConfiguracao('letterSpacing', 0);
    const lineHeightSalvo = carregarConfiguracao('lineHeight', 1.5);
    const altoContrasteSalvo = carregarConfiguracao('modoAltoContraste', false);
    const mascaraLeituraSalva = carregarConfiguracao('mascaraLeitura', false);
    const guiaLeituraSalva = carregarConfiguracao('guiaLeitura', false);

    setFontSize(fontSizeSalvo);
    setLetterSpacing(letterSpacingSalvo);
    setLineHeight(lineHeightSalvo);
    setModoAltoContraste(altoContrasteSalvo);
    setMascaraLeitura(mascaraLeituraSalva);
    setGuiaLeitura(guiaLeituraSalva);
  }, []);

  // Aplicar as mudanças nas variáveis CSS quando os valores mudarem
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Definir variáveis CSS
    root.style.setProperty('--accessibility-font-size', `${fontSize}%`);
    root.style.setProperty('--accessibility-letter-spacing', `${letterSpacing}px`);
    root.style.setProperty('--accessibility-line-height', lineHeight);
    
    // Aplicar classe de acessibilidade apenas se houver mudanças dos valores padrão
    const temMudancas = fontSize !== 100 || letterSpacing !== 0 || lineHeight !== 1.5;
    
    if (temMudancas) {
      body.classList.add('acessibilidade-ativa');
    } else {
      body.classList.remove('acessibilidade-ativa');
    }
    
    // Salvar no localStorage sempre que os valores mudarem
    salvarConfiguracao('fontSize', fontSize);
    salvarConfiguracao('letterSpacing', letterSpacing);
    salvarConfiguracao('lineHeight', lineHeight);
  }, [fontSize, letterSpacing, lineHeight, salvarConfiguracao]);

  // Aplicar/remover classe de alto contraste no body
  useEffect(() => {
    const body = document.body;
    if (modoAltoContraste) {
      body.classList.add('modo-alto-contraste');
    } else {
      body.classList.remove('modo-alto-contraste');
    }
    
    // Salvar no localStorage
    salvarConfiguracao('modoAltoContraste', modoAltoContraste);
  }, [modoAltoContraste]);

  // Controle da Máscara de Leitura
  useEffect(() => {
    const body = document.body;
    
    if (mascaraLeitura) {
      body.classList.add('mascara-leitura-ativa');
      
      // Criar elemento da máscara se não existir
      let mascaraElement = document.getElementById('mascara-leitura');
      if (!mascaraElement) {
        mascaraElement = document.createElement('div');
        mascaraElement.id = 'mascara-leitura';
        mascaraElement.className = 'mascara-leitura-overlay';
        body.appendChild(mascaraElement);
      }
      
      // Função para seguir o cursor
      const seguirCursor = (e) => {
        const x = e.clientX;
        const y = e.clientY;
        mascaraElement.style.setProperty('--mouse-x', `${x}px`);
        mascaraElement.style.setProperty('--mouse-y', `${y}px`);
      };
      
      // Adicionar evento de movimento do mouse
      document.addEventListener('mousemove', seguirCursor);
      
      // Cleanup function para remover o evento
      return () => {
        document.removeEventListener('mousemove', seguirCursor);
      };
    } else {
      body.classList.remove('mascara-leitura-ativa');
      
      // Remover elemento da máscara
      const mascaraElement = document.getElementById('mascara-leitura');
      if (mascaraElement) {
        mascaraElement.remove();
      }
    }
    
    // Salvar no localStorage
    salvarConfiguracao('mascaraLeitura', mascaraLeitura);
  }, [mascaraLeitura]);

  // Controle da Guia de Leitura
  useEffect(() => {
    const body = document.body;
    
    if (guiaLeitura) {
      body.classList.add('guia-leitura-ativa');
      
      // Criar elemento da guia se não existir
      let guiaElement = document.getElementById('guia-leitura');
      if (!guiaElement) {
        guiaElement = document.createElement('div');
        guiaElement.id = 'guia-leitura';
        guiaElement.className = 'guia-leitura-linha';
        body.appendChild(guiaElement);
      }
      
      // Função para seguir o cursor
      const seguirCursor = (e) => {
        const y = e.clientY;
        guiaElement.style.top = `${y}px`;
      };
      
      // Adicionar evento de movimento do mouse
      document.addEventListener('mousemove', seguirCursor);
      
      // Cleanup function para remover o evento
      return () => {
        document.removeEventListener('mousemove', seguirCursor);
      };
    } else {
      body.classList.remove('guia-leitura-ativa');
      
      // Remover elemento da guia
      const guiaElement = document.getElementById('guia-leitura');
      if (guiaElement) {
        guiaElement.remove();
      }
    }
    
    // Salvar no localStorage
    salvarConfiguracao('guiaLeitura', guiaLeitura);
  }, [guiaLeitura]);

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

  const alternarAltoContraste = () => {
    setModoAltoContraste(prev => !prev);
  };

  const alternarMascaraLeitura = () => {
    setMascaraLeitura(prev => !prev);
  };

  const alternarGuiaLeitura = () => {
    setGuiaLeitura(prev => !prev);
  };

  const resetAll = () => {
    setFontSize(100);
    setLetterSpacing(0);
    setLineHeight(1.5);
    setModoAltoContraste(false);
    setMascaraLeitura(false);
    setGuiaLeitura(false);
    
    // Limpar localStorage
    try {
      localStorage.removeItem('acessibilidade_fontSize');
      localStorage.removeItem('acessibilidade_letterSpacing');
      localStorage.removeItem('acessibilidade_lineHeight');
      localStorage.removeItem('acessibilidade_modoAltoContraste');
      localStorage.removeItem('acessibilidade_mascaraLeitura');
      localStorage.removeItem('acessibilidade_guiaLeitura');
    } catch (error) {
      console.warn('Erro ao limpar configurações de acessibilidade:', error);
    }
    
    // Remover classes do body
    const body = document.body;
    body.classList.remove('acessibilidade-ativa');
    body.classList.remove('modo-alto-contraste');
    body.classList.remove('mascara-leitura-ativa');
    body.classList.remove('guia-leitura-ativa');
    
    // Remover elementos criados dinamicamente
    const mascaraElement = document.getElementById('mascara-leitura');
    if (mascaraElement) {
      mascaraElement.remove();
    }
    
    const guiaElement = document.getElementById('guia-leitura');
    if (guiaElement) {
      guiaElement.remove();
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

            {/* Controle de Altura da Linha */}
            <div className="control-group">
              <div className="control-header">
                <AlignJustify size={16} />
                <span>Espaço entre Linhas</span>
                <span className="control-value">{lineHeight.toFixed(1)}</span>
              </div>
              <div className="control-buttons">
                <button 
                  onClick={decreaseLineHeight}
                  className="control-btn decrease"
                  aria-label="Diminuir altura da linha"
                >
                  -
                </button>
                <button 
                  onClick={resetLineHeight}
                  className="control-btn reset"
                  aria-label="Resetar altura da linha"
                >
                  1.5
                </button>
                <button 
                  onClick={increaseLineHeight}
                  className="control-btn increase"
                  aria-label="Aumentar altura da linha"
                >
                  +
                </button>
              </div>
            </div>

            {/* Controle de Alto Contraste */}
            <div className="control-group">
              <div className="control-header">
                <Contrast size={16} />
                <span>Alto Contraste</span>
                <span className={`control-value ${modoAltoContraste ? 'ativo' : 'inativo'}`}>
                  {modoAltoContraste ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="control-buttons">
                <button 
                  onClick={alternarAltoContraste}
                  className={`control-btn toggle-contrast ${modoAltoContraste ? 'ativo' : 'inativo'}`}
                  aria-label={modoAltoContraste ? "Desativar alto contraste" : "Ativar alto contraste"}
                >
                  {modoAltoContraste ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>

            {/* Controle de Máscara de Leitura */}
            <div className="control-group">
              <div className="control-header">
                <Eye size={16} />
                <span>Máscara de Leitura</span>
                <span className={`control-value ${mascaraLeitura ? 'ativo' : 'inativo'}`}>
                  {mascaraLeitura ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="control-buttons">
                <button 
                  onClick={alternarMascaraLeitura}
                  className={`control-btn toggle-mascara ${mascaraLeitura ? 'ativo' : 'inativo'}`}
                  aria-label={mascaraLeitura ? "Desativar máscara de leitura" : "Ativar máscara de leitura"}
                >
                  {mascaraLeitura ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>

            {/* Controle de Guia de Leitura */}
            <div className="control-group">
              <div className="control-header">
                <Minus size={16} />
                <span>Guia de Leitura</span>
                <span className={`control-value ${guiaLeitura ? 'ativo' : 'inativo'}`}>
                  {guiaLeitura ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="control-buttons">
                <button 
                  onClick={alternarGuiaLeitura}
                  className={`control-btn toggle-guia ${guiaLeitura ? 'ativo' : 'inativo'}`}
                  aria-label={guiaLeitura ? "Desativar guia de leitura" : "Ativar guia de leitura"}
                >
                  {guiaLeitura ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>

            {/* Botão de Reset Geral */}
            <div className="reset-all-container">
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

export default AccessibilityControls;

