import { useState } from 'react';
import logo from '../assets/logo.png';
import './Menu.css';
import { Home, User, MessageSquare, Mail } from 'lucide-react';

const Menu = () => {
const [paginaAtiva, setPaginaAtiva] = useState('Início');
const itensMenu = [
  { icone: <Home size={18}/>, texto: 'Início' },
  { icone: <User size={18}/>, texto: 'Perfil' },
  { icone: <MessageSquare size={18}/>, texto: 'Mensagem' },
  { icone: <Mail size={18}/>, texto: 'Contato' }
];


  return (
    <menu>
      <div className="fachada">
        <img src={logo} alt="logo da empresa" className="logo" />
        <p>Guia ao Dispor</p>
      </div>
      <ul className="lista">
        {['🏠Início', '🧑‍🦲Perfil', '💬Mensagem', '✉️Contato'].map((pagina) => (
          <li
            key={pagina}
            onClick={() => setPaginaAtiva(pagina)}
            className={`menu-item ${pagina === paginaAtiva ? 'pag-ativa' : ''
              }`}
          >
            {pagina}
          </li>
        ))}
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