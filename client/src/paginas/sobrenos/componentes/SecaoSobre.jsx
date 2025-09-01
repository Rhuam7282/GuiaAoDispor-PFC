import React from 'react';
import ArtigoSobre from './ArtigoSobre';

const SecaoSobre = () => {
  const artigos = [
    {
      texto: "Iniciado em 2024 como um trabalho para o componente curricular Projeto Integrador II, no curso técnico de Informática para a Internet do IFPR - Campus Assis Chateaubriand, este projeto evoluiu para o desenvolvimento de uma plataforma web dedicada a conectar pessoas com necessidades específicas a indivíduos e profissionais capacitados para auxiliá-las. A ideia, que continua em desenvolvimento em 2025 como parte do Projeto Integrador III, visa criar um ecossistema de apoio e oportunidades no mercado de trabalho.",
      posicaoImagem: 'esquerda'
    },
    {
      texto: "A relevância do projeto foi validada por professoras do IFPR engajadas na área de inclusão (Dr. Celina de Oliveira Barbosa Gomes e Me. Paula Fabiane de Souza), que confirmaram a dificuldade real em encontrar profissionais qualificados para atender demandas de acessibilidade, tanto para a instituição quanto para si mesmas. A pesquisa se fundamenta na atual fase dos direitos das pessoas com deficiência, focada na adaptação do ambiente para garantir a inclusão, superando modelos históricos de exclusão e assistencialismo.",
      posicaoImagem: 'direita'
    },
    {
      texto: "O projeto adota uma abordagem inclusiva, utilizando o termo pessoas com particularidades ou com necessidades específicas para abranger um público mais amplo que a definição legal de Pessoa com Deficiência (PCD). Isso inclui a comunidade surda (que possui uma identidade linguística própria com a LIBRAS), neurodivergentes, idosos e outros grupos que enfrentam barreiras, mas não necessariamente se enquadram ou se identificam como PCD. Do outro lado, o termo sujeito habilitado foi criado para designar qualquer pessoa com capacidade de oferecer ajuda, seja ela um profissional certificado ou não.",
      posicaoImagem: 'esquerda'
    }
  ];

  return (
    <section className="about-content">
      {artigos.map((artigo, indice) => (
        <ArtigoSobre
          key={indice}
          texto={artigo.texto}
          posicaoImagem={artigo.posicaoImagem}
        />
      ))}
    </section>
  );
};

export default SecaoSobre;

