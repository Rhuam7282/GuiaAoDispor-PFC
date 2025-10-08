// VLibras Widget - Arquivo local
(function() {
  'use strict';

  // Configuração do VLibras
  window.VLibras = window.VLibras || {};
  
  // Widget principal
  window.VLibras.Widget = function(targetUrl) {
    this.targetUrl = targetUrl || 'https://vlibras.gov.br/app';
    this.init();
  };

  window.VLibras.Widget.prototype = {
    init: function() {
      this.createStyles();
      this.createButton();
      this.createPlugin();
    },

    createStyles: function() {
      if (document.getElementById('vlibras-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'vlibras-styles';
      style.textContent = `
        [vw-access-button] {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          width: 60px !important;
          height: 60px !important;
          background: #1976d2 !important;
          border-radius: 50% !important;
          cursor: pointer !important;
          z-index: 100000 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
          transition: all 0.3s ease !important;
        }
        
        [vw-access-button]:hover {
          background: #1565c0 !important;
          transform: scale(1.1) !important;
        }
        
        [vw-access-button]::before {
          content: "👋" !important;
          font-size: 24px !important;
          color: white !important;
        }
        
        [vw-plugin-wrapper] {
          position: fixed !important;
          bottom: 90px !important;
          right: 20px !important;
          width: 400px !important;
          height: 300px !important;
          background: white !important;
          border-radius: 10px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
          z-index: 99999 !important;
          display: none !important;
          overflow: hidden !important;
        }
        
        [vw-plugin-wrapper].active {
          display: block !important;
        }
        
        .vw-plugin-top-wrapper {
          width: 100% !important;
          height: 100% !important;
          background: linear-gradient(135deg, #1976d2, #42a5f5) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white !important;
          font-family: Arial, sans-serif !important;
          font-size: 16px !important;
          text-align: center !important;
        }
      `;
      document.head.appendChild(style);
    },

    createButton: function() {
      const button = document.querySelector('[vw-access-button]');
      if (button) {
        button.addEventListener('click', this.togglePlugin.bind(this));
      }
    },

    createPlugin: function() {
      const wrapper = document.querySelector('[vw-plugin-wrapper]');
      if (wrapper) {
        const topWrapper = wrapper.querySelector('.vw-plugin-top-wrapper');
        if (topWrapper) {
          topWrapper.innerHTML = `
            <div style="text-align: center;">
              <div style="font-size: 24px; margin-bottom: 10px;">👋</div>
              <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">VLibras</div>
              <div style="font-size: 14px; opacity: 0.9;">Tradução para Libras</div>
              <div style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                Clique em qualquer texto da página<br>
                para ver a tradução em Libras
              </div>
            </div>
          `;
        }
      }
    },

    togglePlugin: function() {
      const wrapper = document.querySelector('[vw-plugin-wrapper]');
      if (wrapper) {
        wrapper.classList.toggle('active');
      }
    }
  };

  // Método estático para iniciar
  window.VLibras.Widget.start = function() {
    console.log('VLibras Widget iniciado');
  };

  console.log('VLibras Widget carregado com sucesso');
})();

