import React, { useState } from "react";
import "./qualificados.css";
import Filtro from "./filtro";
import Corpo from "../../componentes/layout/corpo";

// Corrigindo os caminhos dos assets, assumindo que estão em 'src/assets'
import mariaSilva from '../../recursos/mulher.png';
import joaoOliveira from '../../recursos/homem1.avif';
import anaSantos from '../../recursos/mulher 3.webp';
import lucianaFerreira from '../../recursos/mulher2.jpg';
import carlosMendes from '../../recursos/homem2.jpg';

// Componente do Card de Perfil (sem alterações, preservando seu código original)
const ProfileCard = ({ profile }) => {
  const handleCardClick = () => {
    alert(`Você clicou no perfil de ${profile.name}`);
  };

  return (
    <div className="cartaoDestaque variacao1" onClick={handleCardClick}>
      <div className="imagemPerfilContainer">
        <img
          src={profile.image}
          alt={profile.imageAlt || `Perfil de ${profile.name}`}
          className="imagemPerfil"
        />
      </div>
      <div className="profile-text-content">
        <h3 className="profile-name">{profile.name}</h3>
        <p className="profile-location">{profile.location}</p>
        <p className="profile-experience">{profile.experience}</p>
      </div>
    </div>
  );
};

// Componente principal da página
function Profissionais() {
  const [selectedFilter, setSelectedFilter] = useState("localizacao");

  const filterOptions = [
    { value: "localizacao", label: "Localização" },
    { value: "disponibilidade", label: "Disponibilidade" },
    { value: "favoritos", label: "Favoritos" },
    { value: "avaliacao", label: "Bem avaliados" },
  ];

  const localProfiles = [
    { image: mariaSilva, name: "Maria Silva", location: "São Paulo, SP", experience: "10 anos de experiência em enfermagem geriátrica" },
    { image: joaoOliveira, name: "João Oliveira", location: "Rio de Janeiro, RJ", experience: "Especialista em LIBRAS com 8 anos de mercado" },
    { image: anaSantos, name: "Ana Santos", location: "Belo Horizonte, MG", experience: "Fisioterapeuta especializada em reabilitação neurológica" },
    { image: carlosMendes, name: "Carlos Mendes", location: "Porto Alegre, RS", experience: "Psicólogo com foco em terceira idade - 12 anos" },
    { image: lucianaFerreira, name: "Luciana Ferreira", location: "Salvador, BA", experience: "Terapeuta ocupacional com experiência domiciliar" },
  ];

  return (
    <Corpo>
      <div className="container">
        
        {/* Seção explicativa com classes BEM específicas para evitar conflitos */}
        <div className="projeto-intro-container">
          <h1 className="projeto-intro-container__titulo">Bem-vindo ao Guia ao Dispor</h1>
          <p className="projeto-intro-container__paragrafo">
            O projeto Guia ao Dispor nasceu da necessidade de criar uma ponte entre pessoas com necessidades específicas e o mercado de trabalho. Iniciado em 2024 como parte do Projeto Integrador do curso técnico de informática do IFPR - Campus Assis Chateaubriand, nosso objetivo é desenvolver um site que sirva como uma ferramenta de auxílio e inclusão.
          </p>
          <p className="projeto-intro-container__paragrafo">
            A plataforma visa facilitar a busca por profissionais qualificados e, ao mesmo tempo, oferecer um espaço para que pessoas com diversas particularidades possam encontrar oportunidades e se sentirem mais incluídas na sociedade.
          </p>
        </div>

        {/* Conteúdo original da página (lista de profissionais) */}
        <div className="profissionais-lista-container">
          <h2 className="profissionais-lista-container__titulo">Profissionais Disponíveis</h2>
          <Filtro
            titulo="Filtros:"
            opcoes={filterOptions}
            opcaoSelecionada={selectedFilter}
            aoMudar={setSelectedFilter}
          />
          <div className="profile-list">
            {localProfiles.map((profile, index) => (
              <ProfileCard key={index} profile={{...profile, imageAlt: `${profile.name}, ${profile.experience.toLowerCase()} em ${profile.location}`}} />
            ))}
          </div>
        </div>
      </div>
    </Corpo>
  );
}

export default Profissionais;
