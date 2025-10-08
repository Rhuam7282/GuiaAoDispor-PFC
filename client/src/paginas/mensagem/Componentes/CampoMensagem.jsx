import React from 'react';

const CampoMensagem = ({ mensagem, aoAlterarMensagem, aoEnviarMensagem }) => {
  const aoSubmeter = (e) => {
    e.preventDefault();
    if (mensagem.trim()) {
      aoEnviarMensagem(mensagem);
    }
  };

  return (
    <form onSubmit={aoSubmeter} className="message-input">
      <textarea 
        placeholder="Digite sua mensagem..." 
        value={mensagem}
        onChange={(e) => aoAlterarMensagem(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            aoSubmeter(e);
          }
        }}
      />
      <button type="submit" className="botao-enviar">
        Enviar
      </button>
    </form>
  );
};

export default CampoMensagem;

