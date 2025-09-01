import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contextos/AuthContext';
import './inicio.css';
import Corpo from "@componentes/layout/corpo";
import logo from '@recursos/logo.png';

const Inicio = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  /* Função para redirecionamento condicional do botão principal */
  const handleButtonClick = () => {
    if (isAuthenticated()) {
      /* Se logado, vai para página de qualificados */
      navigate('/qualificados');
    } else {
      /* Se não logado, vai para página de cadastro */
      navigate('/cadastro');
    }
  };

  return (
    <Corpo>
      <main className="paginaInicial">
        
        {/* Conteúdo principal */}
        <div className="container conteudoPrincipalInicio">
          <h1>Guia ao Dispor</h1>
          <p className="slogan">
            Conectando pessoas com necessidades específicas<br />
            com qualificados em cuidados especiais<br />
            e acessibilidade. <b>Juntos construímos inclusão</b>.
          </p>
         <button onClick={handleButtonClick} className="botaoPrimario">
              {isAuthenticated() ? 'Ver Qualificados' : 'Venha fazer parte'}
            </button>
          <section className="textoExplicativo">
          <h2>Porque?</h2>
          <p>
            A Guia ao Dispor foi inteiramente pensada para o público com necessidades específicas, buscando facilitar o acesso a serviços da área.
          </p>
          <h2>Como?</h2>
          <p>
            Por meio de de uma plataforma que, além de acessível e baseada em estudos, reúne a comunidade de qualificados em cuidados especiais e acessibilidade.
          </p>
          <h2>Sobre</h2>
          <p>
            Nascida de um projeto escolar, a Guia ao Dispor foi feita com pesquisa e auxilio de professores qualificados, pensando em criar uma ferramenta que ajude o mundo a ser mais acessível
          </p>
        </section>
        </div>

        {/* Texto explicativo abaixo */}
        
      </main>
    </Corpo>
  );
};

export default Inicio;