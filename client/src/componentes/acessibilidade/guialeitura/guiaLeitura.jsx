import React, { useEffect, useState } from 'react';

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
      document.body.appendChild(guia);

      const indicador = document.createElement('div');
      indicador.className = 'indicadorCursor';
      document.body.appendChild(indicador);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.body.removeChild(guia);
        document.body.removeChild(indicador);
      };
    }
  }, [ativo]);

  // Atualizar posição do indicador
  useEffect(() => {
    const indicador = document.querySelector('.indicadorCursor');
    if (indicador && ativo) {
      indicador.style.left = `${posicao.x}px`;
      indicador.style.top = `${posicao.y}px`;
    }
  }, [posicao, ativo]);

  return null;
};

export default GuiaLeitura;