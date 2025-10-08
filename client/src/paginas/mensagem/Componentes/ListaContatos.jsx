import React from 'react';
import ItemContato from 'ItemContato';

const ListaContatos = ({ contatos, contatoAtivo, aoSelecionarContato }) => {
  return (
    <div className="messages-list">
      <h2>Lista de Contatos</h2>
      {contatos.map(contato => (
        <ItemContato
          key={contato.id}
          contato={contato}
          ativo={contatoAtivo?.id === contato.id}
          aoClicar={aoSelecionarContato}
        />
      ))}
    </div>
  );
};

export default ListaContatos;

