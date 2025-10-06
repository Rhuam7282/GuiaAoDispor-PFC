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
  const { estaAutenticado, user, logout } = useAuth();

  const itensMenu = [
    { Icone: Home, texto: 'Início', rota: '/' },
    { Icone: GalleryHorizontal, texto: 'Qualificados', rota: '/qualificados' },
    { Icone: User, texto: 'Perfil', rota: '/perfil' },
    { Icone: Mail, texto: 'Sobre Nós', rota: '/sobreNos' }
  ];

  const handleItemClick = (item) => {
    if (item.texto === 'Perfil') {
      if (estaAutenticado()) {
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
  };

  // Verificar se o item está ativo, considerando cadastro como ativo para Perfil
  const isItemAtivo = (item) => {
    if (item.texto === 'Perfil') {
      return location.pathname === '/perfil' || location.pathname === '/cadastro';
    }
    return item.rota === location.pathname;
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
          ativo={isItemAtivo(item)}
          usuarioLogado={estaAutenticado() && user}
          onClick={() => handleItemClick(item)}
        />
      ))}
      
    </ul>
  );
};

export default ListaMenu;