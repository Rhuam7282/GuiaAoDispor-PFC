import { useState } from 'react';
import logo from '../assets/logo.svg';
import './Menu.css'; // Importe o arquivo CSS

const Menu = () => {
  const [paginaAtiva, setPaginaAtiva] = useState('Início');

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