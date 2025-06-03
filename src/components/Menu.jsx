import { useState } from 'react';
import logo from '../assets/logo.svg';
import './Menu.css'; // Importe o arquivo CSS

const Menu = () => {
  const [paginaAtiva, setPaginaAtiva] = useState('Início');

  return (
    <menu>
      <div class="fachada">
        <img src={logo} alt="logo da empresa" class="logo" />
        <p>Guia ao Dispor</p>
      </div>
      <ul class="lista">
        {['🏠Início', '🧑‍🦲Perfil', '💬Mensagem', '✉️Contato'].map((pagina) => (
          <li
            key={pagina}
            onClick={() => setPaginaAtiva(pagina)}
            class={`menu-item ${pagina === paginaAtiva ? 'pag-ativa' : ''
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