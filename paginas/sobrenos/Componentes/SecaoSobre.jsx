import React from 'react';
import ArtigoSobre from './ArtigoSobre.jsx';
import Orientadoras from './Orientadoras.jsx';
import Alunos from './Alunos.jsx';

const SecaoSobre = () => {
  const artigos = [
    {
      titulo: "Ideia do Projeto",
      texto: "Somos um projeto escolar sem fins lucrativos que busca facilitar o acesso de indivíduos com necessidades específicas aos devidos qualificados para suas necessidades individuais. Com o intuito de promover inclusão, contribuir para uma sociedade cada vez mais justa, igualitária e inclusiva. Com o foco principal para a interação entre o qualificado e o cliente, para que seja atendido suas devidas especificidades",
    }
  ];

  return (
    <section className="about-content">
      {artigos.map((artigo, indice) => (
        <ArtigoSobre
          titulo={artigo.titulo}
          key={indice}
          texto={artigo.texto}
          posicaoImagem={artigo.posicaoImagem}
        />
      ))}
      <Alunos />
      <Orientadoras />
    </section>
  );
};

export default SecaoSobre;