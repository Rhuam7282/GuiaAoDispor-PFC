// src/componentes/layout/Corpo.jsx
import Menu from './menu/menu.jsx';
import './corpo.css';
import { useLocation } from 'react-router-dom';

const Corpo = ({ children }) => {
  const localizacao = useLocation();
  const paginaInicial = localizacao.pathname === '/';
  
  return (
    <div className={`containerLayout gridContainer ${paginaInicial ? 'gridUmaColuna' : 'gridDuasColunas'}`}>
      {!paginaInicial && <Menu className="menu" />}
      <main className={`conteudoPrincipal transicaoSuave ${paginaInicial ? 'larguraViewport' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Corpo;