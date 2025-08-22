import Menu from './Menu';
import './corpo.css';
import PainelControle from "@componentes/acessibilidade/controles"; 
import { useLocation } from 'react-router-dom';

const Corpo = ({ children }) => {
  const localizacao = useLocation();
  const paginaInicial = localizacao.pathname === '/';
  
  return (
    <div className={`container-layout ${paginaInicial ? 'pagina-inicial' : ''}`}>
      <PainelControle />
      {!paginaInicial && <Menu className="menu" />}
      <main className={`conteudo-principal ${paginaInicial ? 'conteudo-inteiro' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Corpo;