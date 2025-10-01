import React from 'react';
import HeroPrincipal from './componentes/HeroPrincipal';
import BotoesAcao from './componentes/BotoesAcao';
import SecaoSobre from './componentes/SecaoSobre';
import CarrosselAcessibilidade from './componentes/CarrosselAcessibilidade';
import SecaoComentarios from './componentes/SecaoComentarios';
import Corpo from '../../componentes/layout/Corpo';
import Rodape from './componentes/Rodape';
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
      </div>
      <Rodape />
    </Corpo> 
  );
};

export default Inicio;
