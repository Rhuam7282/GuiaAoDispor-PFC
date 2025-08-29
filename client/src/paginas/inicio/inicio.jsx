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
            a profissionais qualificados em cuidados especiais<br />
            e acessibilidade. Juntos construímos inclusão.
          </p>
         <button onClick={handleButtonClick} className="botaoPrimario">
              {isAuthenticated() ? 'Ver Qualificados' : 'Venha fazer parte'}
            </button>
          <section className="textoExplicativo">
          <h2>Sobre o Projeto</h2>
          <p>
            Iniciado em 2024 como um trabalho para o componente curricular Projeto Integrador II, 
            no curso técnico de Informática para a Internet do IFPR - Campus Assis Chateaubriand, 
            este projeto evoluiu para o desenvolvimento de uma plataforma web dedicada a conectar 
            pessoas com necessidades específicas a indivíduos e profissionais capacitados para auxiliá-las.
          </p>
          <p>
            A relevância do projeto foi validada por professoras do IFPR engajadas na área de inclusão, 
            que confirmaram a dificuldade real em encontrar profissionais qualificados para atender 
            demandas de acessibilidade, tanto para a instituição quanto para si mesmas.
          </p>
          <p>
            O projeto adota uma abordagem inclusiva, utilizando o termo <u>pessoas com particularidades</u> 
            ou com <u>necessidades específicas</u> para abranger um público mais amplo que a definição legal 
            de Pessoa com Deficiência (PCD).
          </p>
        </section>
        </div>

        {/* Texto explicativo abaixo */}
        
      </main>
    </Corpo>
  );
};

export default Inicio;