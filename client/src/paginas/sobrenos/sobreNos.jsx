import React from 'react';
import Corpo from "@componentes/Layout/Corpo";
import SecaoSobre from './componentes/SecaoSobre';
import RedesSociais from './componentes/RedesSociais';
import FormularioContato from './componentes/FormularioContato';
import logo from '@recursos/icones/logo.png';
import './sobreNos.css';

const SobreNos = () => {
  return (
    <Corpo>
      <main className="container">
        {/* Texto explicativo */}
        <h1 className='titulo'>Sobre</h1>
        <section className="about-content">
          <article className="about-text">
            <img src={logo} alt="Logo do Guia ao Dispor - Plataforma de conexão para cuidados especiais" />
            <h2>Estudantes:</h2>
            <h3>Lucas Narciso e Rhuam de Ré</h3>
            <p>
              Formandos do ensino médio técnico em Técnico em Informática para a Internet, dentro do Instituto Federal do Paraná.
              Os estudantes desenvolveram o projeto para trazer uma mudança social positiva dentro da comunidade.
              Observando a dificuldade no cotidiano de pessoas com necessidades específicas próximas aos desenvolvedores.
              Com profissionais se especializando em áreas cada vez mais únicas torna ainda mais difícil encontrar ajuda.
              Visando resolver uma demanda real, o projeto foi desenvolvido com o objetivo de conectar pessoas com necessidades específicas a profissionais qualificados em cuidados especiais e acessibilidade.
              Assim garantindo o atendiemento dessas pessoas dentro da sociedade de forma inclusiva.
            </p>
          </article>
          <article className="about-text">
            <h2>Curso</h2>
            <p>
              Através do ensino técnico focado na criação de sistemas online, tais discetes trasnformaram a ideia do papel para dentro de um clique na rede.
              Feito dentro dos regulamentos e com o apoio dos profissinais do Instituto Federal.
              Por meio de matérias favoráveis ao desenvolvimento do projeto, como: Programação Web, IHC, Sistemas Gerenciadores de Conteúdo WEB entre outras.
            </p>
            <img src={logo} alt="Logo" />
          </article>
          <article className="about-text">
            <img src={logo} alt="Logo" />
            <h2>Orientadoras</h2>
            <h3>Paula Fabiane</h3>
            <p>

            </p>
            <h3>Caroline Barbieri</h3>
            <p>

            </p>
          </article>
        </section>

        {/* Formulário de contato */}
        <section className="enviarEmail">
          <h2>Entre em contato conosco</h2>
          <form className="contact-form">
            <input className='cartaoDestaque variacao3' type="text" placeholder="Seu nome" required />
            <input className='cartaoDestaque variacao3' type="email" placeholder="Seu email" required />
            <textarea className='cartaoDestaque variacao3' placeholder="Sua mensagem" required></textarea>
            <button type="submit">Enviar</button>
          </form>
          <aside className='redes'>
            {/* <div className="listaIcones vertical">
              {RedesSociais.map((rede, index) => {
                const Icone = rede.icone;
                return (
                  <div key={index} className="listaIcones">
                    <Icone size={18} />
                    <span>{rede.usuario}</span>
                  </div>
                );
              })}
            </div> */}
          </aside>
        </section>
      </main>
      <h1 className='titulo'>Sobre</h1>
      <SecaoSobre />
      <FormularioContato />
    </Corpo>
  );
};


export default SobreNos;

