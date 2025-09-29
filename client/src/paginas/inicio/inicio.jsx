import React from 'react';
import Corpo from "@componentes/Layout/Corpo";
import HeroPrincipal from './componentes/HeroPrincipal';
import BotoesAcao from './componentes/BotoesAcao';
import SecaoSobre from './componentes/SecaoSobre';
import CarrosselAcessibilidade from './componentes/CarrosselAcessibilidade';
import './inicio.css';

const Inicio = () => {
  return (
    <Corpo>
      <main className="paginaInicial">
        <div className="container conteudoPrincipalInicio">
          <HeroPrincipal />
          <CarrosselAcessibilidade />
          <BotoesAcao />
          <SecaoSobre />
          <h2>Venha conhecer um pouco da nossa comunidade</h2>
          <aside>
            Comentários
            <p>
              <strong>
                Gostaria de sugerir mais alguma ferramenta ou melhorias? Contacte-nos. [Link do Contato]
              </strong>
            </p>
          </aside>
          <article>
            <h2>Por que escolher um Guia ao Dispor?</h2>
            <p>Ferramentas de segurança</p>
            <p>Verificação de consultas</p>
          </article>
        </div>
      </main>
    </Corpo>
  );
};

export default Inicio;