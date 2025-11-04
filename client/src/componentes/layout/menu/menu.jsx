// src/componentes/layout/Menu/Menu.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../contextos/autenticacao';
import FachadaMenu from './componentes/fachadamenu';
import ListaMenu from './componentes/listamenu';
import RodapeMenu from './componentes/rodapemenu';
import { TableOfContents, X } from 'lucide-react'; // Importar os ícones
import './menu.css';

const Menu = () => {
  const { estaAutenticado, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <>
      {/* Botão Hamburguer */}
      <button 
        className={`botao-hamburguer ${menuAberto ? 'aberto' : ''}`}
        onClick={toggleMenu}
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
      >
        {menuAberto ? <X size={24} /> : <TableOfContents size={24} />}
      </button>

      {/* Overlay para fechar o menu ao clicar fora */}
      {menuAberto && <div className="overlay-menu" onClick={toggleMenu}></div>}

      {/* Menu Principal */}
      <menu className={menuAberto ? 'aberto' : ''}>
        <FachadaMenu />
        <ListaMenu onItemClick={() => setMenuAberto(false)} />
        <RodapeMenu />
      </menu>
    </>
  );
};

export default Menu;