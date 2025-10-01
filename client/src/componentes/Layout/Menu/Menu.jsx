// src/componentes/layout/Menu/Menu.jsx
import React from 'react';
import { useAuth } from '../../../contextos/Autenticacao';
import FachadaMenu from './FachadaMenu/FachadaMenu';
import ListaMenu from './ListaMenu/ListaMenu';
import RodapeMenu from './RodapeMenu/RodapeMenu';
import './Menu.css';

const Menu = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <menu>
      <FachadaMenu />
      <ListaMenu />
      <RodapeMenu />
    </menu>
  );
};

export default Menu;