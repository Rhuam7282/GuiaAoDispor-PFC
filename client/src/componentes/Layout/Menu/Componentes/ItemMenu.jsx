// src/componentes/layout/Menu/ItemMenu/ItemMenu.jsx
import React from 'react';
import 'ItemMenu.css';

const ItemMenu = ({ item, ativo, usuarioLogado, onClick }) => {
  const isPerfil = item.texto === 'Perfil';

  return (
    <li 
      onClick={onClick}
      className={`itemMenu ${ativo ? 'paginaAtiva' : ''}`}
    >
      <span className="textoItemMenu"><div className="itemPerfilContainer">
        {isPerfil && usuarioLogado && usuarioLogado.foto ? (
          <img 
            src={usuarioLogado.foto || usuarioLogado.picture} 
            alt={`Foto de ${usuarioLogado.nome || usuarioLogado.name}`}
            className="fotoPerfilMenu sombraPequena"
          />
        ) : (
          <item.Icone size={20} />
        )}
        
        {item.texto}
      </div></span>
    </li>
  );
};

export default ItemMenu;