import React from 'react';

const HistoricoProfissionalPerfil = ({ historicoProfissional, nomePerfil }) => {
  return (
    <div className="secaoHistorico">
      <h2>Histórico Profissional</h2>
      <div className="listaProfissional">
        {historicoProfissional.length > 0 ? (
          historicoProfissional.map((item, index) => (
            <div key={index} className="destaque2">
              <div className="imagemProfissional">
                <img
                  src={item.imagem}
                  alt={item.alt}
                />
              </div>
              <div className="infoProfissional">
                <h3>{item.nome}</h3>
              </div>
            </div>
          ))
        ) : (
          <div className="destaque2">
            <p>Nenhum histórico profissional cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoProfissionalPerfil;
