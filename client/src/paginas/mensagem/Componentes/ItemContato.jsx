import React from 'react';

const ItemContato = ({ contato, ativo, aoClicar }) => {
  return (
    <div 
      className={`message-item ${ativo ? 'active' : ''}`}
      onClick={() => aoClicar(contato)}
    >
      <div className="message-avatar">
        <div className="profile-circle-small"></div>
      </div>
      <div className="message-content">
        <div className="message-header">
          <h3>{contato.nome}</h3>
          <span className="message-time">{contato.horario}</span>
        </div>
        <p className="message-preview">{contato.visualizacao}</p>
      </div>
    </div>
  );
};

export default ItemContato;

