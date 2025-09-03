// src/componentes/layout/Menu/FachadaMenu/FachadaMenu.jsx
import React from 'react';
import { useAuth } from '../../../../contextos/autenticacao';
import logo from '@recursos/icones/logo.png';
import './FachadaMenu.css';

const FachadaMenu = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="fachada">
      <img src={logo} alt="logo da empresa" className="logo" />
      <p>Guia ao Dispor</p>
      
      {isAuthenticated() && user && (
        <div className="informacoesUsuario">
          <img 
            src={user.foto || user.picture} 
            alt={user.nome || user.name} 
            className="avatarUsuario"
          />
          <p className="nomeUsuario">
            {user.nome || user.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default FachadaMenu;