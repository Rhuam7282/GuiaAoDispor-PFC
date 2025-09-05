import React, { useEffect } from 'react';

const MaskLeitura = ({ ativo }) => {
  useEffect(() => {
    if (ativo) {
      const mask = document.createElement('div');
      mask.className = 'mascaraLeitura';
      document.body.appendChild(mask);

      return () => {
        document.body.removeChild(mask);
      };
    }
  }, [ativo]);

  return null;
};

export default MaskLeitura;