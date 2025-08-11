import React from 'react';
import './mensagem.css';
import Corpo from "../../components/layout/corpo"

const Mensagens = () => {
  // Estado para a mensagem atual
  const [message, setMessage] = React.useState('');
  
  // Dados de exemplo para contatos
  const contacts = [
    {
      id: 1,
      name: 'Nome do Contato',
      time: '10:30',
      preview: 'Olá, gostaria de saber mais sobre sua experiência...',
      active: false
    },
    {
      id: 2,
      name: 'Nome do Contato',
      time: '09:15',
      preview: 'Estou interessado em seu trabalho na área de...',
      active: true
    },
    {
      id: 3,
      name: 'Nome do Contato',
      time: 'Ontem',
      preview: 'Podemos marcar uma reunião para discutir...',
      active: false
    }
  ];
  
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  
  
  return (
    <Corpo>
      <div className="messages-page">
        <h1 className='titulo'>Mensagens</h1>
        <div className="messages-container">
          <div className="messages-list">
            <h2>Lista de Contatos</h2>
            
            {contacts.map(contact => (
              <div key={contact.id} className={`message-item ${contact.active ? 'active' : ''}`}>
                <div className="message-avatar">
                  <div className="profile-circle-small"></div>
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <h3>{contact.name}</h3>
                    <span className="message-time">{contact.time}</span>
                  </div>
                  <p className="message-preview">{contact.preview}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="message-detail">
            <div className="message-detail-header">
              <div className="contact-info">
                <div className="profile-circle-small"></div>
                <h3>Nome do Contato</h3>
              </div>
            </div>
            
            <div className="message-input">
              <textarea 
                placeholder="Digite sua mensagem..." 
                value={message}
                onChange={handleMessageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </Corpo>
  );
};

export default Mensagens;
