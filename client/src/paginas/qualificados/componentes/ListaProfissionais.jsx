import React from 'react';
import CartaoPerfil from './CartaoPerfil';

const ListaProfissionais = ({ profissionais, aoClicarPerfil }) => {
  return (
    <div className="profile-list">
      {profissionais.map((perfil, indice) => (
        <CartaoPerfil 
          key={indice} 
          perfil={perfil} 
          aoClicar={aoClicarPerfil}
        />
      ))}
    </div>
  );
};

export default ListaProfissionais;

