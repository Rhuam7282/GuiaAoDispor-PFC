import { useEffect } from 'react';

const mascaraLeitura = ({ ativo }) => {
  useEffect(() => {
    if (ativo) {
      const mask = document.createElement('div');
      mask.className = 'mascaraLeitura';
      mask.style.position = 'fixed';
      mask.style.top = '50%';
      mask.style.left = '50%';
      mask.style.transform = 'translate(-50%, -50%)';
      mask.style.width = '300px';
      mask.style.height = '100px';
      mask.style.border = '3px solid #ff9900';
      mask.style.borderRadius = '12px';
      mask.style.backgroundColor = 'transparent';
      mask.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.7)';
      mask.style.zIndex = '10000';
      mask.style.pointerEvents = 'none';
      
      document.body.appendChild(mask);

      return () => {
        document.body.removeChild(mask);
      };
    }
  }, [ativo]);

  return null;
};

export default mascaraLeitura;