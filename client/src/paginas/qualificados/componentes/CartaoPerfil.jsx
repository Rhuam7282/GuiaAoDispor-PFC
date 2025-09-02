import React from 'react';

const CartaoPerfil = ({ perfil, aoClicar }) => {
  const aoClicarCartao = () => {
    console.log(`Cartão clicado: ${perfil.nome}`);
    if (aoClicar) {
      aoClicar(perfil);
    } else {
      alert(`Você clicou no perfil de ${perfil.nome}`);
    }
  };

  return (
    <div className="cartaoDestaque variacao1" onClick={aoClicarCartao}>
      <img
        src={perfil.imagem}
        alt={`Perfil de ${perfil.nome}`}
        className="imagemPerfil"
      />
      <div className="profile-text-content">
        <h3 className="profile-name">{perfil.nome}</h3>
        <p className="profile-location">{perfil.localizacao}</p>
        <p className="profile-experience">{perfil.experiencia}</p>
      </div>
    </div>
  );
};

export default CartaoPerfil;

