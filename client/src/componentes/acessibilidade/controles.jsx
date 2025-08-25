import React, { useState, useEffect } from 'react';
import './controles.css';
import { Type, AlignJustify, MoreHorizontal, Settings, Contrast, Eye, Minus } from 'lucide-react';

const AccessibilityControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100); // Porcentagem base
  const [letterSpacing, setLetterSpacing] = useState(0); // Em pixels
  const [lineHeight, setLineHeight] = useState(1.5); // Multiplicador
  const [modoAltoContraste, setModoAltoContraste] = useState(false); // Estado do alto contraste
  const [mascaraLeitura, setMascaraLeitura] = useState(false); // Estado da máscara de leitura
  const [guiaLeitura, setGuiaLeitura] = useState(false); // Estado da guia de leitura

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
  }, [fontSize, letterSpacing, lineHeight]);

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

