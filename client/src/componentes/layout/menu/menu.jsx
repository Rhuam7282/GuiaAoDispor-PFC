// src/componentes/layout/./Menu/Menu.jsx
import React from 'react';
import { useAuth } from '../../../contextos/autenticacao';
import FachadaMenu from './componentes/fachadamenu';
import ListaMenu from './componentes/listamenu';
import RodapeMenu from './componentes/rodapemenu';
import './menu.css';

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