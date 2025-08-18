import React, { useState, useEffect } from 'react';
import './controles.css';
import { Type, AlignJustify, MoreHorizontal, Settings, Contrast } from 'lucide-react';

const AccessibilityControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [modoAltoContraste, setModoAltoContraste] = useState(false);

  // Funções para localStorage
  const salvarConfiguracao = (chave, valor) => {
    try {
      localStorage.setItem(`acessibilidade_${chave}`, JSON.stringify(valor));
    } catch (error) {
      console.warn('Erro ao salvar configuração de acessibilidade:', error);
    }
  };

  const carregarConfiguracao = (chave, valorPadrao) => {
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

    setFontSize(fontSizeSalvo);
    setLetterSpacing(letterSpacingSalvo);
    setLineHeight(lineHeightSalvo);
    setModoAltoContraste(altoContrasteSalvo);
  }, []);

  // Aplicar mudanças de fonte e espaçamento
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
  }, [fontSize, letterSpacing, lineHeight]);

  // Aplicar modo de alto contraste
  useEffect(() => {
    const root = document.documentElement;
    
    if (modoAltoContraste) {
      root.classList.add('modo-alto-contraste');
    } else {
      root.classList.remove('modo-alto-contraste');
    }
    
    salvarConfiguracao('modoAltoContraste', modoAltoContraste);
  }, [modoAltoContraste]);

  // =================================================================
  // ADICIONEI AS FUNÇÕES FALTANTES AQUI (elas foram removidas antes)
  // =================================================================
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 150)); // Máximo 150%
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 80)); // Mínimo 80%
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  const increaseLetterSpacing = () => {
    setLetterSpacing(prev => Math.min(prev + 0.5, 5)); // Máximo 5px
  };

  const decreaseLetterSpacing = () => {
    setLetterSpacing(prev => Math.max(prev - 0.5, -1)); // Mínimo -1px
  };

  const resetLetterSpacing = () => {
    setLetterSpacing(0);
  };

  const increaseLineHeight = () => {
    setLineHeight(prev => Math.min(prev + 0.1, 2.5)); // Máximo 2.5
  };

  const decreaseLineHeight = () => {
    setLineHeight(prev => Math.max(prev - 0.1, 1.0)); // Mínimo 1.0
  };

  const resetLineHeight = () => {
    setLineHeight(1.5);
  };

  const alternarAltoContraste = () => {
    setModoAltoContraste(prev => !prev);
  };

  // Função para resetar tudo
  const resetAll = () => {
    setFontSize(100);
    setLetterSpacing(0);
    setLineHeight(1.5);
    setModoAltoContraste(false);
    
    // Limpar localStorage
    try {
      localStorage.removeItem('acessibilidade_fontSize');
      localStorage.removeItem('acessibilidade_letterSpacing');
      localStorage.removeItem('acessibilidade_lineHeight');
      localStorage.removeItem('acessibilidade_modoAltoContraste');
    } catch (error) {
      console.warn('Erro ao limpar configurações de acessibilidade:', error);
    }
    
    // Remover classes do elemento raiz (<html>)
    const root = document.documentElement;
    root.classList.remove('acessibilidade-ativa');
    root.classList.remove('modo-alto-contraste');
  };

  return (
    <div className="accessibility-controls">
      <button 
        className="accessibility-toggle"
        onClick={togglePanel}
        aria-label="Abrir controles de acessibilidade"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="accessibility-panel">
          <div className="accessibility-header">
            <h3>Controles de Acessibilidade</h3>
            <button 
              className="close-button"
              onClick={togglePanel}
              aria-label="Fechar controles"
            >
              ×
            </button>
          </div>

          <div className="accessibility-content">
            {/* Controle de Tamanho da Fonte */}
            <div className="control-group">
              <div className="control-header">
                <Type size={16} />
                <span>Tamanho da Fonte</span>
                <span className="control-value">{fontSize}%</span>
              </div>
              <div className="control-buttons">
                <button 
                  onClick={decreaseFontSize}
                  className="control-btn decrease"
                  aria-label="Diminuir fonte"
                >
                  A-
                </button>
                <button 
                  onClick={resetFontSize}
                  className="control-btn reset"
                  aria-label="Resetar fonte"
                >
                  A
                </button>
                <button 
                  onClick={increaseFontSize}
                  className="control-btn increase"
                  aria-label="Aumentar fonte"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Controle de Espaçamento entre Letras */}
            <div className="control-group">
              <div className="control-header">
                <MoreHorizontal size={16} />
                <span>Espaço entre Letras</span>
                <span className="control-value">{letterSpacing}px</span>
              </div>
              <div className="control-buttons">
                <button 
                  onClick={decreaseLetterSpacing}
                  className="control-btn decrease"
                  aria-label="Diminuir espaçamento"
                >
                  -
                </button>
                <button 
                  onClick={resetLetterSpacing}
                  className="control-btn reset"
                  aria-label="Resetar espaçamento"
                >
                  0
                </button>
                <button 
                  onClick={increaseLetterSpacing}
                  className="control-btn increase"
                  aria-label="Aumentar espaçamento"
                >
                  +
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

            {/* Botão de Reset Geral */}
            <div className="reset-all-container">
              <button 
                onClick={resetAll}
                className="reset-all-btn"
                aria-label="Resetar todas as configurações"
              >
                Resetar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityControls;