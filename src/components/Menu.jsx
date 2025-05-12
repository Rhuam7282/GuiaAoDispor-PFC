import { useState } from 'react'
import logo from '../assets/logo.svg';

const Menu = () => {
  const [paginaAtiva, setPaginaAtiva] = useState('início');

  return (
    <ul>
      <img src={logo} alt="logo da empresa" />
      {['Início', 'Perfil', 'Mensagem', 'Contato'].map((pagina) => (
        <li
          key={pagina}
          onClick={() => setPaginaAtiva(pagina)}
          className={`cursor-pointer ${pagina === paginaAtiva ? 'fonte-ativa' : 'fonte-normal'}`}
        >
          {pagina}
        </li>
      ))}
    </ul>
  );
};
export default Menu;
