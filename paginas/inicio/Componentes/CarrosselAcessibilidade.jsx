import React from 'react';
import './CarrosselAcessibilidade.css';

const CarrosselAcessibilidade = () => {
  const funcionalidades = [
    {
      titulo: 'Deficiência Visual',
      descricao: 'Nossa plataforma oferece recursos especializados para pessoas com deficiência visual, incluindo modo de alto contraste para melhor visualização, estruturação otimizada para leitores de tela, ajustes de contraste de cores personalizáveis e modo especial de suporte ao daltonismo com paletas de cores adaptadas.',
      icone: '👁️'
    },
    {
      titulo: 'Deficiência Intelectual',
      descricao: 'Desenvolvemos uma interface simplificada com linguagem clara e acessível, textos de apoio explicativos que facilitam a compreensão, e opções de navegação tanto por texto quanto por ícones intuitivos, garantindo que todos possam utilizar nossa plataforma com facilidade.',
      icone: '🧠'
    },
    {
      titulo: 'Deficiência Auditiva',
      descricao: 'Disponibilizamos recursos completos de acessibilidade auditiva, incluindo interpretação em LIBRAS (Língua Brasileira de Sinais) para garantir que pessoas surdas e com deficiência auditiva tenham acesso total ao conteúdo e funcionalidades da plataforma.',
      icone: '👂'
    },
    {
      titulo: 'Estresse Visual',
      descricao: 'Para usuários que enfrentam desconforto visual, oferecemos controles avançados de espaçamento entre linhas, colunas e letras, confirmação visual de cliques para feedback claro, e uma paleta de cores pastéis suaves que reduzem o cansaço visual durante a navegação.',
      icone: '✨'
    },
    {
      titulo: 'Deficiência Motora',
      descricao: 'Nossa plataforma inclui atalhos de navegação por teclado para facilitar o acesso sem mouse, cursor aumentado para melhor visibilidade, e controles adaptados que permitem navegação eficiente para pessoas com limitações motoras.',
      icone: '🦽'
    },
    {
      titulo: 'Dificuldade de Foco',
      descricao: 'Implementamos recursos especiais para auxiliar na concentração, como modo de ícones simplificado, máscara de leitura que destaca o conteúdo relevante, opção para pausar animações que possam distrair, e guia de leitura que facilita o acompanhamento do texto.',
      icone: '🎯'
    },
  ];

  return (
    <section className="carrosselAcessibilidade">
      <h2>Site feito para VOCÊ e que atende às SUAS necessidades:</h2>
      <p className="descricaoCarrossel">
        Conheça os recursos de acessibilidade que tornam nossa plataforma verdadeiramente inclusiva para todos os usuários
      </p>
      <div className="carrosselContainer">
        {funcionalidades.map((funcionalidade, index) => (
          <div key={index} className="carrosselItem">
            <div className="iconeContainer">
              <span className="icone">{funcionalidade.icone}</span>
            </div>
            <h3>{funcionalidade.titulo}</h3>
            <p>{funcionalidade.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CarrosselAcessibilidade;
