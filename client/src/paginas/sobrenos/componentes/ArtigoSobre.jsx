import React from 'react';
import logo from '@recursos/icones/logo.png';

const ArtigoSobre = ({ texto, posicaoImagem = 'esquerda' }) => {
  return (
    <article className="about-text">
      {posicaoImagem === 'esquerda' && (
        <img src={logo} alt="Logo do Guia ao Dispor - Plataforma de conexão para cuidados especiais"/>
      )}
      <p>{texto}</p>
      {posicaoImagem === 'direita' && (
        <img src={logo} alt="Logo" />
      )}
    </article>
  );
};

export default ArtigoSobre;

