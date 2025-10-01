// src/componentes/layout/Menu/ListaMenu/ListaMenu.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../contextos/Autenticacao';
import { Home, User, MessageSquare, Mail, GalleryHorizontal, LogOut } from 'lucide-react';
import Interrogacao from '@Componentes/acessibilidade/interrogacao/interrogacao.jsx';
import ItemMenu from '../ItemMenu/ItemMenu';
import './ListaMenu.css';

const ListaMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const itensMenu = [
    { Icone: Home, texto: 'Início', rota: '/' },
    { Icone: GalleryHorizontal, texto: 'Qualificados', rota: '/qualificados' },
    { Icone: User, texto: 'Perfil', rota: '/perfil' },
    { Icone: Mail, texto: 'Sobre Nós', rota: '/sobreNos' }
  ];

  const handleItemClick = (item) => {
    if (item.texto === 'Perfil') {
      if (isAuthenticated()) {
        navigate('/perfil');
      } else {
        navigate('/cadastro');
      }
    } else {
      navigate(item.rota);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <ul className="listaIcones vertical listaSemEstilo">
      <Interrogacao>
        Texto auxiliar muito legal 👍
      </Interrogacao>
      
      {itensMenu.map((item) => (
        <ItemMenu
          key={item.texto}
          item={item}
          ativo={item.rota === location.pathname}
          usuarioLogado={isAuthenticated() && user}
          onClick={() => handleItemClick(item)}
        />
      ))}
      
    </ul>
  );
};

export default ListaMenu;