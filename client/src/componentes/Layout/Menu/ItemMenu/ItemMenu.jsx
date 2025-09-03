// src/componentes/layout/Menu/ItemMenu/ItemMenu.jsx
import React from 'react';
import './ItemMenu.css';

const ItemMenu = ({ item, ativo, usuarioLogado, onClick }) => {
  const isPerfil = item.texto === 'Perfil';

  return (
    <li 
      onClick={onClick}
      className={`itemMenu ${ativo ? 'paginaAtiva' : ''}`}
    >
      <div className="itemPerfilContainer">
        {isPerfil && usuarioLogado && usuarioLogado.foto ? (
          <img 
            src={usuarioLogado.foto || usuarioLogado.picture} 
            alt={`Foto de ${usuarioLogado.nome || usuarioLogado.name}`}
            className="fotoPerfilMenu"
          />
        ) : (
          <item.Icone size={20} />
        )}
        
        <span className="textoItemMenu">{item.texto}</span>
        
        {isPerfil && usuarioLogado && (
          <span className="indicadorLogado" title={`Logado como ${usuarioLogado.nome || usuarioLogado.name}`}>
            ●
          </span>
        )}
      </div>
    </li>
  );
};

export default ItemMenu;