import React from "react";
import HeroPrincipal from "./Componentes/HeroPrincipal";
import BotoesAcao from "./Componentes/BotoesAcao";
import SecaoSobre from "./Componentes/SecaoSobre";
import CarrosselAcessibilidade from "./Componentes/CarrosselAcessibilidade";
import SecaoComentarios from "./Componentes/SecaoComentarios";
import Corpo from "../../componentes/layout/Corpo";
import Rodape from "./Componentes/Rodape";
import "./inicio.css";

const Inicio = () => {
  return (
    <Corpo>
      <div className="paginaInicial">
        <div className="conteudoInicial">
          <HeroPrincipal />
          <BotoesAcao />
        </div>
      </div>
      <div className="conteudoPrincipalInicio">
        <div className="container">
          <CarrosselAcessibilidade />
          <SecaoSobre />
          <SecaoComentarios />
        </div>
      </div>
      <Rodape />
    </Corpo>
  );
};

export default Inicio;