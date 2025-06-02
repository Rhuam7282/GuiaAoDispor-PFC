import { useState } from 'react';
import logo from '../assets/logo.svg';
import './Menu.css'; // Importe o arquivo CSS

const Menu = () => {
  const [paginaAtiva, setPaginaAtiva] = useState('Início');

  return (
    <menu>
      <div class="fachada">
        <img src={logo} alt="logo da empresa" class="logo"/>
        <h1>Guia ao Dispor</h1>
      </div>
      <ul class="lista">
        {['Início', 'Perfil', 'Mensagem', 'Contato'].map((pagina) => (
          <li
            key={pagina}
            onClick={() => setPaginaAtiva(pagina)}
            class={`menu-item ${
              pagina === paginaAtiva ? 'menu-item-active' : ''
            }`}
          >
            {pagina}
          </li>
        ))}
      </ul>
      <footer class="menu-footer">
        <p>© 2024 Todos os direitos reservados</p>
        <p class="menu-footer-developed-by">Desenvolvido por Lucas Narciso e Rhuam de Ré</p>
      </footer>
    </menu>
  );
};

export default Menu;