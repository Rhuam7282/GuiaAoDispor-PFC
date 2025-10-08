// src/componentes/layout/Menu/Menu.jsx
import React from 'react';
import { useAuth } from '../../../Contextos/Autenticacao';
import FachadaMenu from 'Componentes/FachadaMenu';
import ListaMenu from 'Componentes/ListaMenu';
import RodapeMenu from 'Componentes/RodapeMenu';
import 'Menu.css';

const Menu = () => {
  const { estaAutenticado, logout } = useAuth();

  return (
    <menu>
      <FachadaMenu />
      <ListaMenu />
      <RodapeMenu />
    </menu>
  );
};

export default Menu;