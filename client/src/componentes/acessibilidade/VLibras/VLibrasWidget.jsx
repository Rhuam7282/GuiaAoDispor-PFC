import React, { useEffect } from 'react';

const VlibrasWidget = () => {
  useEffect(() => {
    // Verifica se o script já foi carregado para evitar duplicação
    if (document.getElementById('vlibras-script')) {
      return;
    }

    // Cria o elemento script
    const script = document.createElement('script');
    script.id = 'vlibras-script';
    script.src = '/js/vlibras-plugin.js'; // Caminho relativo ao diretório public
    script.async = true;
    script.onload = () => {
      // Garante que o objeto VLibras esteja disponível antes de inicializar
      if (window.VLibras) {
        new window.VLibras.Widget({
          rootPath: '/public', // Caminho relativo ao diretório public
          personalization: 'https://vlibras.gov.br/config/configs.json',
          opacity: 1,
          position: 'R',
          avatar: 'random'
        });
      }
    };

    // Adiciona o script ao corpo do documento
    document.body.appendChild(script);

    // Adiciona os elementos HTML necessários para o widget
    const vwDiv = document.createElement('div');
    vwDiv.className = 'vw enabled';
    vwDiv.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
        <div class="vw-links">
          <ul></ul>
        </div>
      </div>
    `;
    document.body.appendChild(vwDiv);

    // Cleanup function para remover o script e os elementos do DOM quando o componente for desmontado
    return () => {
      const existingScript = document.getElementById('vlibras-script');
      if (existingScript) {
        existingScript.remove();
      }
      if (vwDiv) {
        vwDiv.remove();
      }
      // Pode ser necessário um cleanup mais robusto para o widget VLibras se ele criar muitos elementos
      // ou listeners que não são removidos automaticamente.
    };
  }, []); // O array vazio garante que o efeito seja executado apenas uma vez, no montagem do componente

  return null; // Este componente não renderiza nada diretamente no DOM do React
};

export default VlibrasWidget;