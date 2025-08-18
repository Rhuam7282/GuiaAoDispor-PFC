//importações de funcionalidades e bibliotecas
import React from 'react';
import './contato.css';
import Corpo from "@componentes/layout/corpo"

//===========================================================
//importações de imagens e ícones
import logo from '@recursos/logo.png';
import {Mail, Facebook, Instagram,} from 'lucide-react';


//===========================================================

//componente
const redesSociais = [
  { icone: Mail, usuario: "contato@guiaoadispor.com" },
  { icone: Facebook, usuario: "Guia ao Dispor" },
  { icone: Instagram, usuario: "@guiaoadispor" },
];

const SobreNosPage = () => {

//===========================================================
//Início do componente
  return (
    <Corpo>
      <main className="container">
      {/* Texto explicativo */}
      <h1 className='titulo'>Sobre</h1>
          <section className="about-content">
            <article className="about-text">
              <img src={logo} alt="Logo do Guia ao Dispor - Plataforma de conexão para cuidados especiais"/>
              <p>
                Iniciado em 2024 como um trabalho para o componente curricular Projeto Integrador II, no curso técnico de Informática para a Internet do IFPR - Campus Assis Chateaubriand, este projeto evoluiu para o desenvolvimento de uma plataforma web dedicada a conectar pessoas com necessidades específicas a indivíduos e profissionais capacitados para auxiliá-las. A ideia, que continua em desenvolvimento em 2025 como parte do Projeto Integrador III, visa criar um ecossistema de apoio e oportunidades no mercado de trabalho.
              </p>
            </article>
            <article className="about-text">
              <p>
                A relevância do projeto foi validada por professoras do IFPR engajadas na área de inclusão (Dr. Celina de Oliveira Barbosa Gomes e Me. Paula Fabiane de Souza), que confirmaram a dificuldade real em encontrar profissionais qualificados para atender demandas de acessibilidade, tanto para a instituição quanto para si mesmas. A pesquisa se fundamenta na atual fase dos direitos das pessoas com deficiência, focada na adaptação do ambiente para garantir a inclusão, superando modelos históricos de exclusão e assistencialismo.              </p>
              <img src={logo} alt="Logo" />
            </article>
            <article className="about-text">
              <img src={logo} alt="Logo"/>
              <p>
                O projeto adota uma abordagem inclusiva, utilizando o termo <u>pessoas com particularidades</u> ou com <u>necessidades específicas</u> para abranger um público mais amplo que a definição legal de Pessoa com Deficiência (PCD). Isso inclui a comunidade surda (que possui uma identidade linguística própria com a LIBRAS), neurodivergentes, idosos e outros grupos que enfrentam barreiras, mas não necessariamente se enquadram ou se identificam como PCD. Do outro lado, o termo <u>sujeito habilitado</u> foi criado para designar qualquer pessoa com capacidade de oferecer ajuda, seja ela um profissional certificado ou não.              </p>
            </article>
          </section>

          {/* Formulário de contato */}
          <section className="enviarEmail">
            <h2>Entre em contato conosco</h2>
            <form className="contact-form">
              <input className='cartaoDestaque variacao3' type="text" placeholder="Seu nome" required />
              <input className='cartaoDestaque variacao3' type="email" placeholder="Seu email" required />
              <textarea className='cartaoDestaque variacao3'placeholder="Sua mensagem" required></textarea>
              <button type="submit">Enviar</button>
            </form>
            <aside className='redes'>
              <div className="listaRedes">
              {redesSociais.map((rede, index) => {
                const Icone = rede.icone;
                return (
                  <div key={index} className="lista">
                    <Icone size={18} />
                    <span>{rede.usuario}</span>
                  </div>
                );
              })}
            </div>
            </aside>
          </section>
        </main>
    </Corpo>
  );
};
export default SobreNosPage;