import { useEffect, useRef, useCallback } from 'react';

export const useGuiasLeitura = (guiaLeitura) => {
  const guiaMouseRef = useRef(null);
  const mascaraRef = useRef(null);

  const limparGuiasLeitura = useCallback(() => {
    if (guiaMouseRef.current) {
      guiaMouseRef.current.remove();
      guiaMouseRef.current = null;
    }
    if (mascaraRef.current) {
      mascaraRef.current.remove();
      mascaraRef.current = null;
    }
  }, []);

  useEffect(() => {
    const manipularMovimentoMouse = (e) => {
      if (guiaLeitura === 1 && guiaMouseRef.current) {
        guiaMouseRef.current.style.top = `${e.clientY}px`;
        const indicador = guiaMouseRef.current.querySelector('.indicadorCursor');
        if (indicador) {
          indicador.style.left = `${e.clientX}px`;
        }
      } else if (guiaLeitura === 2 && mascaraRef.current) {
        mascaraRef.current.style.top = `${e.clientY - 100}px`;
        mascaraRef.current.style.left = `${e.clientX - 750}px`;
      }
    };

    limparGuiasLeitura();

    if (guiaLeitura === 1) {
      document.addEventListener('mousemove', manipularMovimentoMouse);
      const guia = document.createElement('div');
      guia.className = 'guiaLeituraHorizontal';
      guia.innerHTML = '<div class="indicadorCursor"></div>';
      document.body.appendChild(guia);
      guiaMouseRef.current = guia;
    } else if (guiaLeitura === 2) {
      document.addEventListener('mousemove', manipularMovimentoMouse);
      const mascara = document.createElement('div');
      mascara.className = 'mascaraLeitura';
      document.body.appendChild(mascara);
      mascaraRef.current = mascara;
    }

    return () => {
      document.removeEventListener('mousemove', manipularMovimentoMouse);
      limparGuiasLeitura();
    };
  }, [guiaLeitura, limparGuiasLeitura]);

  return { limparGuiasLeitura };
};
