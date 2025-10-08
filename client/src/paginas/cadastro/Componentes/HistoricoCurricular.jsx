import React from 'react';

const HistoricoCurricular = ({ 
  historicosCurriculares, 
  adicionarHistoricoCurricular, 
  removerHistoricoCurricular, 
  alterarHistoricoCurricular 
}) => {
  return (
    <div className="cartaoDestaque variacao3">
      <h3>Histórico Curricular</h3>
      {historicosCurriculares.map((hc, indice) => (
        <div key={indice} className="item-historico">
          <div className="grupo-formulario">
            <label htmlFor={`hc-nome-${indice}`}>Título</label>
            <input
              type="text"
              id={`hc-nome-${indice}`}
              value={hc.nome}
              onChange={(e) => alterarHistoricoCurricular(indice, 'nome', e.target.value)}
            />
          </div>
          <div className="grupo-formulario">
            <label htmlFor={`hc-descricao-${indice}`}>Descrição</label>
            <textarea
              id={`hc-descricao-${indice}`}
              value={hc.descricao}
              onChange={(e) => alterarHistoricoCurricular(indice, 'descricao', e.target.value)}
              rows="2"
            />
          </div>
          <button type="button" onClick={() => removerHistoricoCurricular(indice)}>
            Remover
          </button>
        </div>
      ))}
      <button type="button" onClick={adicionarHistoricoCurricular}>
        Adicionar Histórico Curricular
      </button>
    </div>
  );
};

export default HistoricoCurricular;

