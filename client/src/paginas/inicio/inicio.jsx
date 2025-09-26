import React from 'react';
import HeroPrincipal from './Componentes/HeroPrincipal.jsx';
// import BotoesAcao from './Componentes/BotoesAcao.jsx'; // Importando o novo componente
import SecaoSobre from './Componentes/SecaoSobre.jsx';
import CarrosselAcessibilidade from './Componentes/CarrosselAcessibilidade.jsx';
import './Inicio.css';


// import { useAuth } from "../../contextos/autenticacao";

const Inicio = () => {
  // const { isAuthenticated } = useAuth();

  // const handleButtonClick = () => {
  //   // Lógica do botão aqui
  // };
  return (
    <div className="container conteudoPrincipalInicio">
          <HeroPrincipal />
          <CarrosselAcessibilidade />
          {/* <BotoesAcao /> Usando o novo componente BotoesAcao */}
          <SecaoSobre />
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
        </div>
  );
};

export default Inicio;

