import React, { useState } from 'react';
import './contato.css';
import Corpo from "../../components/layout/corpo"
import logo from '../../assets/logo.png';
import {Mail, Facebook, Instagram,} from 'lucide-react';

const redesSociais = [
  { icone: Mail, usuario: "contato@guiaoadispor.com" },
  { icone: Facebook, usuario: "Guia ao Dispor" },
  { icone: Instagram, usuario: "@guiaoadispor" },
];

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
      <h1>Sobre Nós</h1>
      <div className="sobre-nos-page">
          <div className="about-content">
            <div className="about-text">
              <img src={logo} alt="Logo" className="about-logo" />
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
            <div className="about-text">
              <p>
                A Guia ao Dispor é um protótipo, que viabiliza a divulgação de profissionais da área de cuidados especiais, especializados em serviços e tratos para a comunidade com especificidades. O projeto apresenta design simples e intuitivo para boa parte dos requerimentos provindos das características especiais do cliente, promovendo conforto para o nosso principal público.
Aos nossos requeridos profissionais, também pensamos em diversas técnicas de facilitar e auxiliar em seu trabalho, como uma aba de conversa e de visualização dinâmica para contato com o cliente, além do acesso de um currículo e das capacidades do profissional. Tudo para fornecer o melhor trabalho de divulgação que podemos oferecer.
Desejamos boas negociações e contratos saudáveis e duradouros, com o intuito de um mundo cada vez mais inclusivo e informativo a respeito das especificidades com que convivemos.
Venha conosco e se torne um “Guia ao Dispor” ou um de nossos clientes mais do que especiais.
              </p>
            <img src={logo} alt="Logo" className="about-logo" />
            </div>
          </div>
          <div className="enviarEmail">
            <h2>Entre em contato conosco</h2>
            <form className="contact-form">
              <input type="text" placeholder="Seu nome" required />
              <input type="email" placeholder="Seu email" required />
              <textarea placeholder="Sua mensagem" required></textarea>
              <button type="submit">Enviar</button>
            </form>
            <aside className='redes'>
              <div className="listaRedes">
              {redesSociais.map((rede, index) => {
                const Icone = rede.icone;
                return (
                  <div key={index} className="itemRede">
                    <Icone size={18} />
                    <span>{rede.usuario}</span>
                  </div>
                );
              })}
            </div>
            </aside>
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
                <div className="contact-details">
                  <div className="contact-label">Telefone</div>
                  <div className="contact-value">(11) 9999-9999</div>
                </div>
              </div>
              
              <div className="contact-item">
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
                  Enviar comentário
                </button>
              </form>
            </div>
          </div>
        </div>
    </Corpo>
  );
};

export default SobreNosPage;