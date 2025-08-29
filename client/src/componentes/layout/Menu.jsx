/* Componente Menu - Menu de navegação lateral da aplicação */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '@recursos/logo.png';
import './menu.css';
import { Home, User, MessageSquare, Mail, GalleryHorizontal } from 'lucide-react';
import Interrogacao from '@componentes/acessibilidade/interrogacao/interrogacao.jsx';

/* Componente principal do menu de navegação */
const Menu = () => {
  /* Hook para navegação programática entre rotas */
  const navigate = useNavigate();
  
  /* Hook para obter a localização atual da rota */
  const location = useLocation();
  
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

  return (
    /* Menu principal - elemento semântico HTML5 */
    <menu>
      {/* Seção da fachada com logo e nome da aplicação */}
      <div className="fachada">
        <img src={logo} alt="logo da empresa" className="logo" />
        <p>Guia ao Dispor</p>
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
              onClick={() => {
                /* Atualiza o estado da página ativa */
                setPaginaAtiva(item.texto);
                /* Navega para a rota correspondente */
                navigate(item.rota);
              }}
              className={`itemMenu ${ativo ? 'paginaAtiva' : ''}`}
            >
              {/* Renderiza o ícone do item */}
              <item.Icone size={20} />
              {/* Texto do item do menu */}
              {item.texto}
            </li>
          );
        })}
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

