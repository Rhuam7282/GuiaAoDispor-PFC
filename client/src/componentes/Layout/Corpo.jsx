import Menu from './Menu/Menu.jsx';
import { Outlet, useLocation } from 'react-router-dom';
import './Corpo.css';

const Corpo = () => {
  const localizacao = useLocation();
    return (
    <div className="containerLayout gridContainer gridDuasColunas">
      <Menu className="menu" />
      <main className="conteudoPrincipal transicaoSuave">
        <Outlet />
      </main>
    </div>
  );
};

export default Corpo;

