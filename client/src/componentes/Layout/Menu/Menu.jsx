// src/componentes/layout/./Menu/Menu.jsx
import React from 'react';
import { useAuth } from "../../../contextos/autenticacao.jsx";
import FachadaMenu from './componentes/fachadamenu.jsx';
import ListaMenu from './componentes/listamenu.jsx';
import RodapeMenu from './componentes/rodapemenu.jsx';
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