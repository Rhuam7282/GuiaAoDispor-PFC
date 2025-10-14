import React from 'react';
import './HeroPrincipal.css';

const HeroPrincipal = () => {
  return (
    <div className="heroPrincipal">
      <div className="containerTitulo">
        <h1 className="tituloDestaque">
          <span className="tituloGradiente">Guia ao Dispor</span>
        </h1>
      </div>
      <div className="sloganContainer">
        <p className="slogan">
          <span className="sloganDestaque">Conectando pessoas</span> com necessidades específicas<br />
          a <span className="sloganDestaque">profissionais qualificados</span> em cuidados especiais<br />
          e acessibilidade. <span className="sloganFinal">Juntos construímos inclusão.</span>
        </p>
      </div>
    </div>
  );
};

export default HeroPrincipal;
