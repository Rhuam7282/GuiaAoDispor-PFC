import React from 'react';
import HeroPrincipal from './componentes/HeroPrincipal';
import BotoesAcao from './componentes/BotoesAcao';
import SecaoSobre from './componentes/SecaoSobre';
import CarrosselAcessibilidade from './componentes/CarrosselAcessibilidade';
import SecaoComentarios from './componentes/SecaoComentarios';
import Corpo from '@Componentes/layout/Corpo';
import './inicio.css';

const Inicio = () => {
  return (
    <Corpo>
      <div className="container conteudoPrincipalInicio">
          <HeroPrincipal />
          <BotoesAcao />
          <CarrosselAcessibilidade />
          <SecaoSobre />
          <SecaoComentarios />
          <article className="secaoVantagens">
            <h2>Por que escolher um Guia ao Dispor?</h2>
            <div className="containerVantagens">
              <div className="vantagemItem">
                <h3>🔒 Ferramentas de Segurança</h3>
                <p>Plataforma segura com verificação de identidade e avaliações de usuários para garantir confiabilidade em todos os serviços oferecidos.</p>
              </div>
              <div className="vantagemItem">
                <h3>✅ Verificação de Consultas</h3>
                <p>Sistema robusto de verificação que garante a qualidade dos profissionais e a autenticidade dos serviços prestados na plataforma.</p>
              </div>
            </div>
          </article>
        </div>
    </Corpo> 
  );
};

export default Inicio;
