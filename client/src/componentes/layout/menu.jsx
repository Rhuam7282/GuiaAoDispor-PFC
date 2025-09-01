/* Componente Menu - Menu de navegação lateral da aplicação */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contextos/AuthContext';
import logo from '@recursos/logo.png';
import './menu.css';
import { Home, User, MessageSquare, Mail, GalleryHorizontal, LogOut } from 'lucide-react';
import Interrogacao from '@componentes/acessibilidade/interrogacao/interrogacao.jsx';

/* Componente principal do menu de navegação */
const Menu = () => {
  /* Hook para navegação programática entre rotas */
  const navigate = useNavigate();
  
  /* Hook para obter a localização atual da rota */
  const location = useLocation();
  
  /* Hook para acessar contexto de autenticação */
  const { user, isAuthenticated, logout } = useAuth();

  /* Array com os itens do menu - cada item contém ícone, texto e rota */
  const itensMenu = [
    { Icone: Home, texto: 'Início', rota: '/' },
    { Icone: GalleryHorizontal, texto: 'Qualificados', rota: '/qualificados' },
    { Icone: User, texto: 'Perfil', rota: '/perfil' },
    // { Icone: MessageSquare, texto: 'Mensagem', rota: '/mensagem' }, // Inativo
    { Icone: Mail, texto: 'Sobre Nós', rota: '/sobreNos' }
  ];

  /* Estado para controlar qual página está ativa no menu */
  const [paginaAtiva, setPaginaAtiva] = useState(
    itensMenu.find(item => item.rota === location.pathname)?.texto || itensMenu[0].texto
  );

  /* Hook para atualizar a página ativa quando a rota muda */
  useEffect(() => {
    const itemAtivo = itensMenu.find(item => item.rota === location.pathname);
    if (itemAtivo) {
      setPaginaAtiva(itemAtivo.texto);
    }
  }, [location.pathname]);

  /* Função para lidar com clique nos itens do menu */
  const handleItemClick = (item) => {
    setPaginaAtiva(item.texto);
    
    /* Implementa redirecionamento condicional baseado na autenticação */
    if (item.texto === 'Perfil') {
      /* Se logado, vai para próprio perfil; se não, vai para cadastro */
      if (isAuthenticated()) {
        navigate('/perfil');
      } else {
        navigate('/cadastro');
      }
    } else {
      /* Para outros itens, navega normalmente */
      navigate(item.rota);
    }
  };

  /* Função para fazer logout */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    /* Menu principal - elemento semântico HTML5 */
    <menu>
      {/* Seção da fachada com logo e nome da aplicação */}
      <div className="fachada">
        <img src={logo} alt="logo da empresa" className="logo" />
        <p>Guia ao Dispor</p>
        
        {/* Mostra informações do usuário se logado */}
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
      
      {/* Lista de itens do menu com componente de interrogação */}
      <ul className="listaIcones vertical listaSemEstilo">
        {/* Componente de interrogação com texto auxiliar */}
        <Interrogacao>
          Texto auxiliar muito legal 👍
        </Interrogacao>
        
        {/* Mapeia os itens do menu para criar os elementos de navegação */}
        {itensMenu.map((item) => {
          /* Verifica se o item atual está ativo */
          const ativo = item.texto === paginaAtiva;
          
          return (
            /* Item de menu clicável */
            <li 
              key={item.texto}
              onClick={() => handleItemClick(item)}
              className={`itemMenu ${ativo ? 'paginaAtiva' : ''}`}
            >
              {/* Renderiza o ícone do item */}
              <item.Icone size={20} />
              {/* Texto do item do menu */}
              {item.texto}
            </li>
          );
        })}
        
        {/* Botão de logout se usuário estiver logado */}
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
      
      {/* Rodapé do menu com informações de copyright */}
      <footer>
        <p>© 2024 Guia ao Dispor</p>
        <p>Todos os direitos reservados</p>
      </footer>
    </menu>
  );
};

/* Exporta o componente para uso em outras partes da aplicação */
export default Menu;

