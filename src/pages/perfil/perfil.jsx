import React from 'react';
import './perfil.css';
import Corpo from "../../components/layout/corpo";

import mariaSilva from '../../assets/mulher.png';
import micheleto from '../../assets/hospital.jpg';
import butantan from '../../assets/butantan.webp';
import portugues from '../../assets/portugues.jpg';
import { MapPin, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';

const Perfil = () => {
  const dadosPerfil = {
    nome: "Maria Silva",
    foto: mariaSilva,
    localizacao: "Assis Chateaibriand, PR",
    descricao: "Enfermeira especializada em geriatria com 10 anos de experiência.",
    redesSociais: [
      { icone: Mail, url: 'mailto:maria@exemplo.com' },
      { icone: Facebook, url: 'https://facebook.com/maria.silva' },
      { icone: Instagram, url: 'https://instagram.com/maria.silva' },
      { icone: Linkedin, url: 'https://linkedin.com/in/maria-silva' }
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
        descricao: 'Formada com honras em 2010'
      },
      { 
        nome: 'Pós-graduação em Geriatria', 
        instituicao: 'UNIFESP',
        descricao: 'Especialização concluída em 2013'
      }
    ]
  };

  return (
    <Corpo>
      <div className="paginaPerfil">
        <h2 className="tituloPerfil">{dadosPerfil.nome}</h2>

        <div className="cabecalhoPerfil">
          <div className="fotoPerfil">
            <img
              src={dadosPerfil.foto}
              alt={`Foto de ${dadosPerfil.nome}`}
              className="imagemPerfil"
              style={{ width: '235px', height: '235px' }}
            />
          </div>

          <div className="infoPerfil">
            <div className="cardDescricao">
              <p>{dadosPerfil.descricao}</p>
            </div>

            <div className="infoContato">
              <div className="localAvaliacao">
                <div className="localizacao">
                  <MapPin />
                  <span>{dadosPerfil.localizacao}</span>
                </div>
                <div className="avaliacao">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              <div className="redesSociais">
                {dadosPerfil.redesSociais.map((rede, index) => {
                  const Icone = rede.icone;
                  return (
                    <a key={index} href={rede.url} target="_blank" rel="noopener noreferrer">
                      <Icone />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="secaoHistorico">
          <h2>Histórico Acadêmico:</h2>
          <div className="listaAcademica">
            {dadosPerfil.historicoAcademico.map((item, index) => (
              <div key={index} className="cardAcademico">
                <h3>{item.nome}</h3>
                <p className="instituicao">{item.instituicao}</p>
                <p className="descricaoAcademica">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="secaoHistorico">
          <h2>Histórico Profissional:</h2>
          <div className="listaProfissional">
            {dadosPerfil.historicoProfissional.map((item, index) => (
              <div key={index} className="cardProfissional">
                <img
                  src={item.imagem}
                  alt={item.alt}
                  className="imagemProfissional"
                />
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