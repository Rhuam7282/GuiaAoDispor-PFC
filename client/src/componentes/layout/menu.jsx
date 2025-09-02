
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contextos/AuthContext';
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

  return (
    
    <menu>
      {}
      <div className="fachada">
        <img src={logo} alt="logo da empresa" className="logo" />
        <p>Guia ao Dispor</p>
        
        {}
        {isAuthenticated() && user && (
          <div className="user-info">
            <img 
              src={user.picture} 
              alt={user.name} 
              className="user-avatar"
              style={{ width: '32px', height: '32px', borderRadius: '50%', marginTop: '8px' }}
            />
            <p className="user-name" style={{ fontSize: '12px', marginTop: '4px' }}>
              {user.name}
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
              {item.texto}
            </li>
          );
        })}
        
        {}
        {isAuthenticated() && (
          <li 
            onClick={handleLogout}
            className="itemMenu logout-button"
            style={{ marginTop: '20px', color: '#ff4444' }}
          >
            <LogOut size={20} />
            Sair
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

