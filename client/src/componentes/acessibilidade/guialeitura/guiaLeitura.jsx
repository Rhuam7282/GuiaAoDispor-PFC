import React, { useEffect, useState } from 'react';

const GuiaLeitura = ({ ativo }) => {
  const [posicao, setPosicao] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosicao({ x: e.clientX, y: e.clientY });
    };

    if (ativo) {
      document.addEventListener('mousemove', handleMouseMove);
      
      // Criar a barra horizontal
      const guia = document.createElement('div');
      guia.className = 'guiaLeituraHorizontal';
      document.body.appendChild(guia);

      // Criar o indicador (seta)
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

  // Atualizar posição da guia e do indicador
  useEffect(() => {
    const guia = document.querySelector('.guiaLeituraHorizontal');
    const indicador = document.querySelector('.indicadorCursor');
    
    if (guia && indicador && ativo) {
      // Posicionar a barra horizontal na altura do cursor
      guia.style.top = `${posicao.y}px`;
      
      // Posicionar o indicador no centro da barra
      indicador.style.left = `${posicao.x}px`;
      indicador.style.top = `${posicao.y}px`;
    }
  }, [posicao, ativo]);

  return null;
};

export default GuiaLeitura;