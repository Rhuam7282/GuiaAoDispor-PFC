
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contextos/autenticacao';
import logo from '@recursos/logo.png';
import './menu.css';
import { Home, User, MessageSquare, Mail, GalleryHorizontal, LogOut } from 'lucide-react';
import Interrogacao from '@componentes/acessibilidade/interrogacao/interrogacao.jsx';


const Menu = () => {
  
  const navigate = useNavigate();
  
  
  const location = useLocation();
  
  
  const { user, isAuthenticated, logout } = useAuth();

  
  const itensMenu = [
    { Icone: Home, texto: 'Início', rota: '/' },
    { Icone: GalleryHorizontal, texto: 'Qualificados', rota: '/qualificados' },
    { Icone: User, texto: 'Perfil', rota: '/perfil' },
    { Icone: Mail, texto: 'Sobre Nós', rota: '/sobreNos' }
  ];

  
  const [paginaAtiva, setPaginaAtiva] = useState(
    itensMenu.find(item => item.rota === location.pathname)?.texto || itensMenu[0].texto
  );

  
  useEffect(() => {
    const itemAtivo = itensMenu.find(item => item.rota === location.pathname);
    if (itemAtivo) {
      setPaginaAtiva(itemAtivo.texto);
    }
  }, [location.pathname]);

  
  const handleItemClick = (item) => {
    setPaginaAtiva(item.texto);
    
    
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

  
  const renderItemPerfil = (item) => {
    const ativo = item.texto === paginaAtiva;
    const usuarioLogado = isAuthenticated() && user;
    
    return (
      <li 
        key={item.texto}
        onClick={() => handleItemClick(item)}
        className={`itemMenu ${ativo ? 'paginaAtiva' : ''}`}
      >
        <div className="itemPerfilContainer">
          {/* Ícone padrão ou foto do usuário */}
          {usuarioLogado && user.foto ? (
            <img 
              src={user.foto || user.picture} 
              alt={`Foto de ${user.nome || user.name}`}
              className="fotoPerfilMenu"
            />
          ) : (
            <item.Icone size={20} />
          )}
          
          {/* Texto do item */}
          <span className="textoItemMenu">{item.texto}</span>
          
          {/* Indicador de usuário logado */}
          {usuarioLogado && (
            <span className="indicadorLogado" title={`Logado como ${user.nome || user.name}`}>
              ●
            </span>
          )}
        </div>
      </li>
    );
  };

  return (
    
    <menu>
      {}
      <div className="fachada">
        <img src={logo} alt="logo da empresa" className="logo" />
        <p>Guia ao Dispor</p>
        
        {}
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
      
      {}
      <ul className="listaIcones vertical listaSemEstilo">
        {}
        <Interrogacao>
          Texto auxiliar muito legal 👍
        </Interrogacao>
        
        {}
        {itensMenu.map((item) => {
          
          if (item.texto === 'Perfil') {
            return renderItemPerfil(item);
          }
          
          
          const ativo = item.texto === paginaAtiva;
          
          return (
            
            <li 
              key={item.texto}
              onClick={() => handleItemClick(item)}
              className={`itemMenu ${ativo ? 'paginaAtiva' : ''}`}
            >
              {}
              <item.Icone size={20} />
              {}
              <span className="textoItemMenu">{item.texto}</span>
            </li>
          );
        })}
        
        {}
        {isAuthenticated() && (
          <li 
            onClick={handleLogout}
            className="itemMenu botaoSair"
          >
            <LogOut size={20} />
            <span className="textoItemMenu">Sair</span>
          </li>
        )}
      </ul>
      
      {}
      <footer>
        <p>© 2024 Guia ao Dispor</p>
        <p>Todos os direitos reservados</p>
      </footer>
    </menu>
  );
};


export default Menu;

