import React from 'react';
import './SecaoSobre.css';

const SecaoSobre = () => {
  const marcos = [
    {
      ano: '2024',
      titulo: 'Início do Projeto',
      descricao: 'Nascimento da ideia durante o Projeto Integrador II no IFPR'
    },
    {
      ano: '2024',
      titulo: 'Validação Acadêmica',
      descricao: 'Aprovação e apoio de professoras especialistas em inclusão'
    },
    {
      ano: '2024',
      titulo: 'Desenvolvimento',
      descricao: 'Criação da plataforma web com foco em acessibilidade total'
    },
    {
      ano: '2025',
      titulo: 'Lançamento',
      descricao: 'Disponibilização da plataforma para a comunidade'
    }
  ];

  const diferenciais = [
    {
      icone: '🎯',
      titulo: 'Abordagem Inclusiva',
      descricao: 'Utilizamos terminologia respeitosa como "pessoas com particularidades" para abranger um público mais amplo que a definição legal de PCD.'
    },
    {
      icone: '🏫',
      titulo: 'Base Acadêmica Sólida',
      descricao: 'Projeto desenvolvido no IFPR com validação de especialistas em inclusão e acessibilidade.'
    },
    {
      icone: '🌐',
      titulo: 'Tecnologia Acessível',
      descricao: 'Plataforma web desenvolvida com os mais altos padrões de acessibilidade digital.'
    },
    {
      icone: '🤝',
      titulo: 'Conexão Humana',
      descricao: 'Facilitamos o encontro entre pessoas que precisam de apoio e profissionais qualificados.'
    }
  ];

  return (
    <section className="secaoSobre">
      <div className="containerSobre">
        <div className="cabecalhoSobre">
          <h2>Sobre o Projeto</h2>
          <p className="descricaoIntro">
            Uma iniciativa que nasceu da necessidade real de conectar pessoas com necessidades específicas 
            a profissionais qualificados, transformando desafios em oportunidades de inclusão.
          </p>
        </div>

        <div className="conteudoPrincipal">
          <div className="textoExplicativo">
            <div className="paragrafoDestaque">
              <p>
                <strong>Iniciado em 2024</strong> como um trabalho para o componente curricular 
                <span className="destaque"> Projeto Integrador II</span>, no curso técnico de 
                <span className="destaque"> Informática para a Internet do IFPR</span> - Campus Assis Chateaubriand, 
                este projeto evoluiu para o desenvolvimento de uma plataforma web dedicada a conectar 
                pessoas com necessidades específicas a indivíduos e profissionais capacitados para auxiliá-las.
              </p>
            </div>

            <div className="paragrafoValidacao">
              <p>
                A <strong>relevância do projeto foi validada</strong> por professoras do IFPR engajadas na área de inclusão, 
                que confirmaram a <span className="problemaDestaque">dificuldade real em encontrar profissionais qualificados</span> 
                para atender demandas de acessibilidade, tanto para a instituição quanto para si mesmas.
              </p>
            </div>

            <div className="paragrafoAbordagem">
              <p>
                O projeto adota uma <strong>abordagem inclusiva</strong>, utilizando o termo 
                <span className="termoDestaque"> pessoas com particularidades</span> ou com 
                <span className="termoDestaque"> necessidades específicas</span> para abranger um público mais amplo 
                que a definição legal de Pessoa com Deficiência (PCD).
              </p>
            </div>
          </div>

          <div className="timelineProjeto">
            <h3>Linha do Tempo</h3>
            <div className="containerTimeline">
              {marcos.map((marco, index) => (
                <div key={index} className="itemTimeline">
                  <div className="anoTimeline">{marco.ano}</div>
                  <div className="conteudoTimeline">
                    <h4>{marco.titulo}</h4>
                    <p>{marco.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="diferenciais">
          <h3>Nossos Diferenciais</h3>
          <div className="containerDiferenciais">
            {diferenciais.map((diferencial, index) => (
              <div key={index} className="cartaoDiferencial">
                <div className="iconeDiferencial">{diferencial.icone}</div>
                <h4>{diferencial.titulo}</h4>
                <p>{diferencial.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecaoSobre;
