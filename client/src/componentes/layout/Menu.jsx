import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '@recursos/logo.png';
import './menu.css';
import { Home, User, MessageSquare, Mail } from 'lucide-react';
import Interrogacao from '@componentes/acessibilidade/interrogacao/interrogacao.jsx';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const itensMenu = [
    { Icone: Home, texto: 'Início', rota: '/' },
    { Icone: User, texto: 'Perfil', rota: '/perfil' },
    // { Icone: MessageSquare, texto: 'Mensagem', rota: '/mensagem' }, // Inativo
    { Icone: Mail, texto: 'Contato', rota: '/contato' }
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

  return (
    <menu>
      <div className="fachada">
        <img src={logo} alt="logo da empresa" className="logo" />
        <p>Guia ao Dispor</p>
      </div>
     <ul className="listaIcones vertical">
      <Interrogacao>
        Este texto é editável diretamente na interface! Clique e digite para alterar o conteúdo.
        Você pode usar <strong>HTML</strong> para formatação também.
      </Interrogacao>
        {itensMenu.map((item) => {
          const ativo = item.texto === paginaAtiva;
          
          return (
            <li
              key={item.texto}
              onClick={() => {
                setPaginaAtiva(item.texto);
                navigate(item.rota);
              }}
              className={`menu-item ${ativo ? 'pag-ativa' : ''}`}
            >
              <span className="icone">
                <item.Icone 
                  size={ativo ? 18 : 16} 
                  color={ativo ? "#303538" : "#1B3133"} 
                  strokeWidth={ativo ? 3.5 : 2.5}
                />
              </span>
              {item.texto}
            </li>
         );
        })}
      </ul>
      <footer>
        <p>Todos os direitos reservados. <br /><br />
          Guia ao Dispor é resultado de um projeto escolar. Saiba mais. <br /><br />
          Veja também nosso Artigo de Desenvolvimento.</p>
      </footer>
    </menu>
  );
};

export default Menu;