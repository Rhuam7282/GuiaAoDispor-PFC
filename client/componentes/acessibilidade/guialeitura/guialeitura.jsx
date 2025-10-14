import React, { useEffect, useRef } from 'react';

const GuiaLeitura = ({ ativo }) => {
  const guiaRef = useRef(null);
  const indicadorRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!ativo) {
      // Limpar animação se desativado
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    // Criar a barra horizontal
    const guia = document.createElement('div');
    guia.className = 'guiaLeituraHorizontal';
    guiaRef.current = guia;
    document.body.appendChild(guia);

    // Criar o indicador (seta para cima)
    const indicador = document.createElement('div');
    indicador.className = 'indicadorSeta';
    indicadorRef.current = indicador;
    document.body.appendChild(indicador);

    // Função para atualizar a posição com requestAnimationFrame
    const updatePosition = (e) => {
      if (!guiaRef.current || !indicadorRef.current) return;
      
      // Posicionar a barra horizontal na altura do cursor
      guiaRef.current.style.top = `${e.clientY}px`;
      
      // Posicionar a seta no centro da barra
      indicadorRef.current.style.left = `${e.clientX}px`;
      indicadorRef.current.style.top = `${e.clientY}px`;
      
      // Continuar a animação
      animationRef.current = requestAnimationFrame(() => {
        // Esta função será chamada no próximo frame de animação
      });
    };

    // Usar requestAnimationFrame para atualização suave
    const handleMouseMove = (e) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(() => updatePosition(e));
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (guiaRef.current) {
        document.body.removeChild(guiaRef.current);
        guiaRef.current = null;
      }
      if (indicadorRef.current) {
        document.body.removeChild(indicadorRef.current);
        indicadorRef.current = null;
      }
    };
  }, [ativo]);

  return null;
};

export default GuiaLeitura;