// src/componentes/layout/Menu/FachadaMenu/FachadaMenu.jsx
import React from 'react';
import { useAuth } from '../../../../contextos/autenticacao';
import logo from '../../../../recursos/icones/logo.png';
import './fachadamenu.css';

const FachadaMenu = () => {
  return (
    <div className="fachada">
      <img src={logo} alt="logo da empresa" className="logo" />
      <p>Guia ao Dispor</p>
    </div>
  );
};

export default FachadaMenu;