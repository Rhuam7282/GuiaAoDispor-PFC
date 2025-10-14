import React from "react";
import HeroPrincipal from "./Componentes/HeroPrincipal";
import BotoesAcao from "./Componentes/BotoesAcao";
import SecaoSobre from "./Componentes/SecaoSobre";
import CarrosselAcessibilidade from "./Componentes/CarrosselAcessibilidade";
import SecaoComentarios from "./Componentes/SecaoComentarios";
import Corpo from "../../Componentes/Layout/Corpo";
import Rodape from "./Componentes/Rodape";
import "./Inicio.css";

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