import React from 'react';
import Corpo from "@componentes/layout/corpo";
import HeroPrincipal from './componentes/HeroPrincipal';
import BotaoAcao from './componentes/BotaoAcao';
import SecaoSobre from './componentes/SecaoSobre';
import './inicio.css';

const Inicio = () => {
  return (
    <Corpo>
      <main className="paginaInicial">
        <div className="container conteudoPrincipalInicio">
          <HeroPrincipal />
          <BotaoAcao />
          <SecaoSobre />
        </div>
      </main>
    </Corpo>
  );
};

export default Inicio;

