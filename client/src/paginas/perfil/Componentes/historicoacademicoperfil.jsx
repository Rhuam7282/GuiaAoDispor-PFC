import React from 'react';

const HistoricoAcademicoPerfil = ({ historicoAcademico }) => {
  return (
    <div className="secaoHistorico">
      <h2>Histórico Acadêmico</h2>
      <div className="listaAcademica">
        {historicoAcademico.length > 0 ? (
          historicoAcademico.map((item, index) => (
            <div key={index} className="destaque2">
              <h3>{item.nome}</h3>
              <p>{item.instituicao}</p>
              <p className="periodo">{item.periodo}</p>
            </div>
          ))
        ) : (
          <div className="destaque2">
            <p>Nenhum histórico acadêmico cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoAcademicoPerfil;
