import React from 'react';
import './perfil.css';
import Corpo from "../../components/layout/corpo";
import { Star, MapPin, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import PainelControle from "../../components/acessibilidade/controles"; // 

import mariaSilva from '../../assets/mulher.png';
import micheleto from '../../assets/hospital.jpg';
import butantan from '../../assets/butantan.webp';
import portugues from '../../assets/portugues.jpg';

const Perfil = () => {
  const dadosPerfil = {
    nome: "Maria Silva",
    foto: mariaSilva,
    localizacao: "Assis Chateaibriand, PR",
    descricao: "Enfermeira especializada em geriatria com 10 anos de experiência.",
    avaliacao: 4.8,
    redesSociais: [
      { icone: Mail, usuario: "maria.silva@exemplo.com" },
      { icone: Facebook, usuario: "/maria.silva" },
      { icone: Instagram, usuario: "@maria_silva" },
      { icone: Linkedin, usuario: "linkedin.com/in/maria-silva" }
    ],
    historicoProfissional: [
      {
        nome: 'Hospital Micheletto - Assis Chateaubriand',
        imagem: micheleto,
        alt: "Hospital Micheletto"
      },
      {
        nome: 'Instituto Butantan - São Paulo',
        imagem: butantan,
        alt: "Instituto Butantan"
      },
      {
        nome: 'Hospital Beneficente Português - Belém',
        imagem: portugues,
        alt: "Hospital Beneficente Português"
      }
    ],
    historicoAcademico: [
      { 
        nome: 'Graduação em Enfermagem', 
        instituicao: 'USP',
        periodo: '2010-2014'
      },
      { 
        nome: 'Pós-graduação em Geriatria', 
        instituicao: 'UNIFESP',
        periodo: '2015-2017'
      }
    ]
  };

  return (
    <Corpo>
      <PainelControle />
      <div className="container">
        <h1 className="titulo">{dadosPerfil.nome}</h1>

        <div className="containerPrincipal">
          <div className="colunaFoto">
              <img className="imagemPerfil"
                src={dadosPerfil.foto}
                alt={`Foto de ${dadosPerfil.nome}`}
              />
          </div>
          <div className="destaque3">
              <p>{dadosPerfil.descricao}</p>
            <div className="detalhesPerfil">
              <div className="icone">
                <MapPin size={20} />
                <span>{dadosPerfil.localizacao}</span>
              </div>
              
                <div className="icone">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < Math.floor(dadosPerfil.avaliacao) ? "#54453B" : "none"} 
                      stroke="#54453B" 
                    />
                  ))}
                <span className="valorAvaliacao">{dadosPerfil.avaliacao}</span>
                </div>
              </div>
            </div>

          {/* Coluna direita com contatos */}
          <div className="colunaContatos">
            <h3>Contatos</h3>
            <div className="listaRedes">
              {dadosPerfil.redesSociais.map((rede, index) => {
                const Icone = rede.icone;
                return (
                  <div key={index} className="lista">
                    <Icone size={18} />
                    <span>{rede.usuario}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Histórico Acadêmico */}
        <div className="secaoHistorico">
          <h2>Histórico Acadêmico</h2>
          <div className="listaAcademica">
            {dadosPerfil.historicoAcademico.map((item, index) => (
              <div key={index} className="destaque2">
                <h3>{item.nome}</h3>
                <p>{item.instituicao}</p>
                <p className="periodo">{item.periodo}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico Profissional */}
        <div className="secaoHistorico">
          <h2>Histórico Profissional</h2>
          <div className="listaProfissional">
            {dadosPerfil.historicoProfissional.map((item, index) => (
              <div key={index} className="destaque2">
                <div className="imagemProfissional">
                  <img
                    src={item.imagem}
                    alt={item.alt}
                  />
                </div>
                <div className="infoProfissional">
                  <h3>{item.nome}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Corpo>
  );
};

export default Perfil;