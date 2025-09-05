import { useEffect, useState } from 'react';

const GuiaLeitura = ({ ativo }) => {
  const [posicao, setPosicao] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosicao({ x: e.clientX, y: e.clientY });
    };

    if (ativo) {
      document.addEventListener('mousemove', handleMouseMove);
      
      const guia = document.createElement('div');
      guia.className = 'guiaLeituraHorizontal';
      guia.style.position = 'fixed';
      guia.style.top = `${posicao.y}px`;
      guia.style.left = '0';
      guia.style.width = '100vw';
      guia.style.height = '2px';
      guia.style.background = 'linear-gradient(90deg, transparent, #ff9900, transparent)';
      guia.style.zIndex = '10001';
      guia.style.pointerEvents = 'none';
      
      const indicador = document.createElement('div');
      indicador.className = 'indicadorCursor';
      indicador.style.position = 'fixed';
      indicador.style.left = `${posicao.x}px`;
      indicador.style.top = `${posicao.y}px`;
      indicador.style.width = '16px';
      indicador.style.height = '16px';
      indicador.style.background = 'white';
      indicador.style.border = '2px solid black';
      indicador.style.borderRadius = '50%';
      indicador.style.transform = 'translate(-50%, -50%)';
      indicador.style.zIndex = '10002';
      indicador.style.pointerEvents = 'none';
      indicador.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.5)';
      
      document.body.appendChild(guia);
      document.body.appendChild(indicador);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.body.removeChild(guia);
        document.body.removeChild(indicador);
      };
    }
  }, [ativo, posicao]);

  return null;
};

export default GuiaLeitura;