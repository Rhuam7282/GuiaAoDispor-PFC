import React from 'react';
import Paula from '../../../Recursos/Imagens/paula.png';
import Caroline from '../../../Recursos/Imagens/caroline.jpg';

const Orientadoras = () => {
  return (
    <article className="orientadoras-section">
      <h2>Orientação</h2>
      
      <div className="orientadoras-container">
        <div className="orientadora">
          <img src={Paula} alt="Mestra Paula Fabiane de Souza" />
          <div className="orientadora-info">
            <h3>Mestra Paula Fabiane de Souza</h3>
            <dl>
              <dt>Especialização em Educação Especial (2006)</dt>
              <dt>Especialização em PSICOPEDAGOGIA CLÍNICA, INSTITUCIONAL E HOSPITALAR (2019)</dt>
              <dt>Mestrado em Letras - Linguagem e Sociedade (2009)</dt>
            </dl>
          </div>
        </div>
        
        <div className="orientadora reverse">
          <div className="orientadora-info">
            <h3>Doutora Caroline Domingues Porto do Nascimento Barbieri</h3>
            <dl>
              <dt>Doutorado em Engenharia Elétrica (2018)</dt>
              <dt>Graduação em Sistemas de Informação (2011)</dt>
            </dl>
          </div>
          <img src={Caroline} alt="Doutora Caroline Domingues Porto do Nascimento Barbieri" />
        </div>
      </div>
      
      <div className="conclusao-orientadoras">
        <p>Que nos guiaram e trouxeram maior fundamentação para o trabalho. Seja com o conteúdo técnico utilizado para a implementação e realização do site. Como suporte teórico aos estudos às deficiências e educação especial.</p>
      </div>
    </article>
  );
};

export default Orientadoras;