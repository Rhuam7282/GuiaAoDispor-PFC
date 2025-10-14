import React from 'react';
import logo from '../../../Recursos/Icones/logo.png';

const ArtigoSobre = ({ título, texto, posicaoImagem = 'esquerda' }) => {
  return (
    <article className="about-text">
      {posicaoImagem === 'esquerda' && (
        <img src={logo} alt="Logo do Guia ao Dispor - Plataforma de conexão para cuidados especiais"/>
      )}
      <div className="text-content">
        {título && <h2>{título}</h2>}
        <p>{texto}</p>
      </div>
      {posicaoImagem === 'direita' && (
        <img src={logo} alt="Logo do Guia ao Dispor - Plataforma de conexão para cuidados especiais" />
      )}
    </article>
  );
};

export default ArtigoSobre;