import Menu from './Menu';
import './corpo.css';
import { useLocation } from 'react-router-dom';

const Corpo = ({ children }) => {
  const localizacao = useLocation();
  const paginaInicial = localizacao.pathname === '/';
  
  return (
    <div className={`container-layout ${paginaInicial ? 'pagina-inicial' : ''}`}>
      {!paginaInicial && <Menu className="menu" />}
      <main className={`conteudo-principal ${paginaInicial ? 'conteudo-inteiro' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Corpo;