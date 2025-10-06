import React from 'react';

const HistoricoProfissional = ({ 
  historicosProfissionais, 
  adicionarHistoricoProfissional, 
  removerHistoricoProfissional, 
  alterarHistoricoProfissional,
  alterarFotoHistoricoProfissional 
}) => {
  return (
    <div className="cartaoDestaque variacao3">
      <h3>Histórico Profissional</h3>
      {historicosProfissionais.map((hp, indice) => (
        <div key={indice} className="item-historico">
          <div className="grupo-formulario">
            <label htmlFor={`hp-nome-${indice}`}>Título</label>
            <input
              type="text"
              id={`hp-nome-${indice}`}
              value={hp.nome}
              onChange={(e) => alterarHistoricoProfissional(indice, 'nome', e.target.value)}
            />
          </div>
          <div className="grupo-formulario">
            <label htmlFor={`hp-descricao-${indice}`}>Descrição</label>
            <textarea
              id={`hp-descricao-${indice}`}
              value={hp.descricao}
              onChange={(e) => alterarHistoricoProfissional(indice, 'descricao', e.target.value)}
              rows="2"
            />
          </div>
          <div className="grupo-formulario">
            <label htmlFor={`hp-foto-${indice}`}>Imagem</label>
            <input
              type="file"
              id={`hp-foto-${indice}`}
              accept="image/*"
              onChange={(e) => alterarFotoHistoricoProfissional(indice, e.target.files[0])}
            />
            {hp.foto && <img src={hp.foto} alt="Preview" className="imagemPerfil" />}
          </div>
          <button type="button" onClick={() => removerHistoricoProfissional(indice)}>
            Remover
          </button>
        </div>
      ))}
      <button type="button" onClick={adicionarHistoricoProfissional}>
        Adicionar Histórico Profissional
      </button>
    </div>
  );
};

export default HistoricoProfissional;

