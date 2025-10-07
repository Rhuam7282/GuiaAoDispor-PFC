import React, { useEffect, useState } from 'react';

const MaskLeitura = ({ ativo }) => {
  const [posicao, setPosicao] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosicao({ x: e.clientX, y: e.clientY });
    };

    if (ativo) {
      document.addEventListener('mousemove', handleMouseMove);
      
      const mask = document.createElement('div');
      mask.className = 'mascaraLeitura';
      document.body.appendChild(mask);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.body.removeChild(mask);
      };
    }
  }, [ativo]);

  // Atualizar posição da máscara
  useEffect(() => {
    const mask = document.querySelector('.mascaraLeitura');
    if (mask && ativo) {
      mask.style.left = `${posicao.x}px`;
      mask.style.top = `${posicao.y}px`;
      mask.style.transform = 'translate(-50%, -50%)';
    }
  }, [posicao, ativo]);

  return null;
};

export default MaskLeitura;