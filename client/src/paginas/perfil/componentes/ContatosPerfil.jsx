import React from 'react';

const ContatosPerfil = ({ redesSociais = [] }) => {
  return (
    <div>
      <h3>Contatos</h3>
      <div className="listaIcones vertical">
        {redesSociais.map((rede, index) => {
          const Icone = rede.icone;
          return (
            <div key={index} className="listaIcones">
              <Icone size={18} />
              <span>{rede.usuario}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContatosPerfil;

