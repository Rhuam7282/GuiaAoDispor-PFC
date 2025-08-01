import React, { useState } from 'react';
import './contato.css';
import Corpo from "../../components/layout/corpo";
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const SobreNosPage = () => {
  const [comment, setComment] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Comentário enviado:', comment);
    setComment('');
    // Lógica para enviar o comentário
  };

  return (
    <Corpo>
      <div className="contato-page">
        <h2 className="title">Sobre Nós</h2>

        {/* Bloco Sobre Nós */}
        <div className="sobre-nos-content">
          <div className="about-section">
            <div className="about-text">
              <p>
                A Guia ao Dispor é um protótipo que viabiliza a divulgação de profissionais da área de cuidados especiais, 
                especializados em serviços e tratos para a comunidade com especificidades. O projeto apresenta design simples 
                e intuitivo para boa parte dos requerimentos provindos das características especiais do cliente, promovendo 
                conforto para o nosso principal público.
              </p>
              <p>
                Aos nossos requeridos profissionais, também pensamos em diversas técnicas de facilitar e auxiliar em seu trabalho, 
                como uma aba de conversa e de visualização dinâmica para contato com o cliente, além do acesso de um currículo 
                e das capacidades do profissional. Tudo para fornecer o melhor trabalho de divulgação que podemos oferecer.
              </p>
              <p className="assinatura">Guia ao Dispor</p>
            </div>
          </div>
        </div>

        {/* Seção de Contato e Mensagem */}
        <div className="contact-message-container">
          {/* Coluna de Contato */}
          <div className="contact-column">
            <div className="contact-card">
              <h3>Contato</h3>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-details">
                  <div className="contact-label">Email</div>
                  <div className="contact-value">contato@guiaaodispor.com.br</div>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={20} />
                </div>
                <div className="contact-details">
                  <div className="contact-label">Telefone</div>
                  <div className="contact-value">(11) 9999-9999</div>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-details">
                  <div className="contact-label">Endereço</div>
                  <div className="contact-value">Rua dos Guias, 123 - São Paulo, SP</div>
                </div>
              </div>
              
              <div className="social-section">
                <h4>Redes Sociais</h4>
                <div className="social-tags">
                  <div className="social-tag">@guia_ao_dispor</div>
                  <div className="social-tag">@guia_ao_dispor</div>
                  <div className="social-tag">@guia_ao_dispor</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Coluna de Mensagem */}
          <div className="message-column">
            <div className="message-card">
              <h3>Digite seu comentário aqui</h3>
              
              <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                  className="comment-input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escreva seu comentário..."
                  rows={5}
                  required
                />
                
                <button type="submit" className="send-button">
                  <Send size={18} className="send-icon" />
                  Enviar comentário
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Corpo>
  );
};

export default SobreNosPage;