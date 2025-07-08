import React from 'react';
import './contato.css';
import Corpo from "../../components/layout/corpo"

const SobreNosPage = () => {
  
  return (
    <Corpo>
      <div className="sobre-nos-page">
          <div className="about-content">
            <div className="about-image">
              <div className="circle-image"></div>
            </div>
            
            <div className="about-text">
              <p>
                A Guia ao Dispor é um protótipo, que viabiliza a divulgação de profissionais da área de cuidados especiais, especializados em serviços e tratos para a comunidade com especificidades. O projeto apresenta design simples e intuitivo para boa parte dos requerimentos provindos das características especiais do cliente, promovendo conforto para o nosso principal público.
Aos nossos requeridos profissionais, também pensamos em diversas técnicas de facilitar e auxiliar em seu trabalho, como uma aba de conversa e de visualização dinâmica para contato com o cliente, além do acesso de um currículo e das capacidades do profissional. Tudo para fornecer o melhor trabalho de divulgação que podemos oferecer.
Desejamos boas negociações e contratos saudáveis e duradouros, com o intuito de um mundo cada vez mais inclusivo e informativo a respeito das especificidades com que convivemos.
Venha conosco e se torne um “Guia ao Dispor” ou um de nossos clientes mais do que especiais.
              </p>
            </div>
          </div>
      </div>
    </Corpo>
  );
};

export default SobreNosPage;
