import React, { useState } from 'react';
import Corpo from "@componentes/Layout/Corpo";
import ListaContatos from './componentes/ListaContatos';
import DetalheMensagem from './componentes/DetalheMensagem';
import './mensagem.css';

const Mensagens = () => {
  const [mensagem, setMensagem] = useState('');
  const [contatoSelecionado, setContatoSelecionado] = useState(null);
  
  const contatos = [
    {
      id: 1,
      nome: 'Nome do Contato',
      horario: '10:30',
      visualizacao: 'Olá, gostaria de saber mais sobre sua experiência...'
    },
    {
      id: 2,
      nome: 'Nome do Contato',
      horario: '09:15',
      visualizacao: 'Estou interessado em seu trabalho na área de...'
    },
    {
      id: 3,
      nome: 'Nome do Contato',
      horario: 'Ontem',
      visualizacao: 'Podemos marcar uma reunião para discutir...'
    }
  ];
  
  const aoSelecionarContato = (contato) => {
    setContatoSelecionado(contato);
  };
  
  const aoAlterarMensagem = (novaMensagem) => {
    setMensagem(novaMensagem);
  };
  
  const aoEnviarMensagem = (mensagemEnviada) => {
    console.log('Mensagem enviada:', mensagemEnviada);
    setMensagem('');
  };
  
  return (
    <Corpo>
      <div className="messages-page">
        <h1 className='titulo'>Mensagens</h1>
        <div className="messages-container">
          <ListaContatos
            contatos={contatos}
            contatoAtivo={contatoSelecionado}
            aoSelecionarContato={aoSelecionarContato}
          />
          
          <DetalheMensagem
            contatoSelecionado={contatoSelecionado}
            mensagem={mensagem}
            aoAlterarMensagem={aoAlterarMensagem}
            aoEnviarMensagem={aoEnviarMensagem}
          />
        </div>
      </div>
    </Corpo>
  );
};

export default Mensagens;

