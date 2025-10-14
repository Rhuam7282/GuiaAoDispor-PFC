import React from 'react';

const HistoricoAcademicoPerfil = ({ historicoAcademico }) => {
  return (
    <div className="flexItem margemInferiorGrande">
      <h2 className="bordaInferiorSubtle">Histórico Acadêmico</h2>
      <div className="gridContainer gridColunasAuto gapPequeno">
        {historicoAcademico.length > 0 ? (
          historicoAcademico.map((item, index) => (
            <div key={index} className="cartaoAcademico">
              <h3>{item.nome}</h3>
              <p>{item.instituicao}</p>
              <p className="textoMarromEscuro">{item.periodo}</p>
            </div>
          ))
        ) : (
          <div className="cartaoAcademico">
            <p>Nenhum histórico acadêmico cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoAcademicoPerfil;