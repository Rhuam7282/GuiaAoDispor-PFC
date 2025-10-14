import React from 'react';
import Lucas from '../../../Recursos/Imagens/lucas.png';
import Rhuam from '../../../Recursos/Imagens/rhuam.png';


const Alunos = () => {
  return (
    <article className="alunos-section">
      <h2>Desenvolvedores</h2>
      
      <div className="alunos-texto">
        <p>Rhuam e Lucas são estudantes do Instituto Federal do Paraná Câmpus Assis Chateaubriand que cursam o Técnico de Informática para Internet integrado ao Ensino Médio. Que criaram o Guia ao Dispor, incentivados pela busca de um tema com valor social e inovador para o desenvolvimento do Projeto Final do Cursos.</p>
      </div>
      
      <div className="alunos-container">
        <div className="aluno">
          <img src={Rhuam} alt="Rhuam" />
          <div className="aluno-legenda">Rhuam</div>
        </div>
        
        <div className="aluno">
          <img src={Lucas} alt="Lucas" />
          <div className="aluno-legenda">Lucas</div>
        </div>
      </div>
    </article>
  );
};

export default Alunos;