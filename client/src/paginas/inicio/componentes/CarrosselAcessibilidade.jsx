import React from 'react';
import './CarrosselAcessibilidade.css';

const CarrosselAcessibilidade = () => {
  const funcionalidades = [
    {
      titulo: 'Deficiência Visual',
      descricao: 'Modo Contraste, Estruturação para Leituras de Tela, Contraste de Cores, Modo de suporte ao Daltonismo.'
    },
    {
      titulo: 'Deficiência Intelectual',
      descricao: 'Simplicidade textual, textos de apoio explicativos, modo de texto ou de ícones.'
    },
    {
      titulo: 'Deficiência Auditiva',
      descricao: 'LIBRAS.'
    },
    // {
    //   titulo: 'Estresse Visual',
    //   descricao: 'Mudança de espaçamento entre linhas, colunas e letras. Além de confirmação de clique e cores pastéis.'
    // },
    // {
    //   titulo: 'Deficiência Motora',
    //   descricao: 'Atalhos de navegação e cursor grande.'
    // },
    // {
    //   titulo: 'Dificuldade de Foco',
    //   descricao: 'Modo de ícones, máscara de leitura, pausar animações, guia de leitura.'
    // },
  ];

  return (
    <section className="carrosselAcessibilidade">
      <h2>Site feito para VOCÊ e que atende às SUAS necessidades:</h2>
      <div className="carrosselContainer">
        {funcionalidades.map((funcionalidade, index) => (
          <div key={index} className="carrosselItem">
            <h3>{funcionalidade.titulo}</h3>
            <p>{funcionalidade.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CarrosselAcessibilidade;