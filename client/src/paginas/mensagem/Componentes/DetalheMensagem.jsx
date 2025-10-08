import React from 'react';
import CampoMensagem from 'CampoMensagem';

const DetalheMensagem = ({ 
  contatoSelecionado, 
  mensagem, 
  aoAlterarMensagem, 
  aoEnviarMensagem 
}) => {
  return (
    <div className="message-detail">
      <div className="message-detail-header">
        <div className="contact-info">
          <div className="profile-circle-small"></div>
          <h3>{contatoSelecionado?.nome || 'Selecione um contato'}</h3>
        </div>
      </div>
      
      <div className="message-conversation">
        {contatoSelecionado ? (
          <div className="conversa-placeholder">
            <p>Conversa com {contatoSelecionado.nome}</p>
          </div>
        ) : (
          <div className="sem-conversa">
            <p>Selecione um contato para iniciar a conversa</p>
          </div>
        )}
      </div>
      
      {contatoSelecionado && (
        <CampoMensagem
          mensagem={mensagem}
          aoAlterarMensagem={aoAlterarMensagem}
          aoEnviarMensagem={aoEnviarMensagem}
        />
      )}
    </div>
  );
};

export default DetalheMensagem;

