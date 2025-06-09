import { useState } from 'react';
import logo from '../assets/logo.png';
import './Menu.css';
import { Home, User, MessageSquare, Mail } from 'lucide-react';

const Menu = () => {
  const itensMenu = [
    { Icone: Home, texto: 'Início' },
    { Icone: User, texto: 'Perfil' },
    { Icone: MessageSquare, texto: 'Mensagem' },
    { Icone: Mail, texto: 'Contato' }
  ];

  
  const [paginaAtiva, setPaginaAtiva] = useState(itensMenu[0].texto);

  return (
    <menu>
      <div className="fachada">
        <img src={logo} alt="logo da empresa" className="logo" />
        <p>Guia ao Dispor</p>
      </div>
     <ul className="lista">
        {itensMenu.map((item) => {
          const ativo = item.texto === paginaAtiva;
          
          return (
            <li
              key={item.texto}
              onClick={() => setPaginaAtiva(item.texto)}
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