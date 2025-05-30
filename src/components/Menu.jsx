import { useState } from 'react';
import logo from '../assets/logo.svg';
import './Menu.css'; // Importe o arquivo CSS

const Menu = () => {
  const [paginaAtiva, setPaginaAtiva] = useState('Início');

  return (
    <div className="menu-container">
      <img src={logo} alt="logo da empresa" className="menu-logo"/>
      <ul className="menu-list">
        {['Início', 'Perfil', 'Mensagem', 'Contato'].map((pagina) => (
          <li
            key={pagina}
            onClick={() => setPaginaAtiva(pagina)}
            className={`menu-item ${
              pagina === paginaAtiva ? 'menu-item-active' : ''
            }`}
          >
            {pagina}
          </li>
        ))}
      </ul>
      <footer className="menu-footer">
        <p>© 2024 Todos os direitos reservados</p>
        <p className="menu-footer-developed-by">Desenvolvido por Lucas Narciso e Rhuam de Ré</p>
      </footer>
    </div>
  );
};

export default Menu;