import React from "react";
import HeroPrincipal from "./componentes/heroprincipal";
import BotoesAcao from "./componentes/botoesacao";
import SecaoSobre from "./componentes/secaosobre";
import CarrosselAcessibilidade from "./componentes/carrosselacessibilidade";
import SecaoComentarios from "./componentes/secaocomentarios";
import Corpo from "../../componentes/layout/corpo";
import Rodape from "./componentes/rodape";
import "./inicio.css";

const Inicio = () => {
  return (
    <Corpo>
      <main className="paginaInicial"> {/* ✅ SEMÂNTICA */}
        <div className="conteudoInicial">
          <HeroPrincipal />
          <BotoesAcao />
        </div>
      </main>
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