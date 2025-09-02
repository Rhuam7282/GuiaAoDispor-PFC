import React from 'react';

const HistoricoProfissionalPerfil = ({ historicoProfissional, nomePerfil }) => {
  return (
    <div className="flexItem margemInferiorGrande">
      <h2 className="bordaInferiorSubtle">Histórico Profissional</h2>
      <div className="gridContainer gridColunasAuto gapMedio">
        {historicoProfissional.length > 0 ? (
          historicoProfissional.map((item, index) => (
            <div key={index} className="cartao fundoAzulDestaque flexColuna gapPequeno alinharEsticar">
              <div className="containerImagem">
                <img
                  className="imagemAspecto"
                  src={item.imagem}
                  alt={`${item.nome} - Local de trabalho de ${nomePerfil}`}
                />
              </div>
              <div className="margemSuperiorZero">
                <h3>{item.nome}</h3>
              </div>
            </div>
          ))
        ) : (
          <div className="cartao fundoAzulDestaque">
            <p>Nenhum histórico profissional cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoProfissionalPerfil;

