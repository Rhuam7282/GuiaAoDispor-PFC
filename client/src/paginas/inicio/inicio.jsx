import React from "react";
import HeroPrincipal from "./Componentes/HeroPrincipal";
import BotoesAcao from "./Componentes/BotoesAcao";
import SecaoSobre from "./Componentes/SecaoSobre";
import CarrosselAcessibilidade from "./Componentes/CarrosselAcessibilidade";
import SecaoComentarios from "./Componentes/SecaoComentarios";
import Corpo from "../../componentes/Layout/Corpo";
import Rodape from "./Componentes/Rodape";
import styles from "./Inicio.module.css";

const Inicio = () => {
  return (
    <Corpo>
      <main className={styles.paginaInicial}> {/* ✅ SEMÂNTICA */}
        <div className={styles.conteudoInicial}>
          <HeroPrincipal />
          <BotoesAcao />
        </div>
      </main>
      <div className={styles.conteudoPrincipalInicio}>
        <div className={styles.container}>
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