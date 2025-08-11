import React, { useState } from "react";
import "./profissionais.css"; // Importe o arquivo CSS
import Filtro from "./filtro"; // Importe o componente Filtro
import Corpo from "../../components/layout/corpo";

import mariaSilva from '../../assets/mulher.png';
import joaoOliveira from '../../assets/homem1.avif';
import anaSantos from '../../assets/mulher 3.webp';
import lucianaFerreira from '../../assets/mulher2.jpg';
import carlosMendes from '../../assets/homem2.jpg';

const ProfileCard = ({ profile }) => {
  const handleCardClick = () => {
    console.log(`Card clicado: ${profile.name}`);
    alert(`Você clicou no perfil de ${profile.name}`);
  };

  return (
    <div className="destaque1" onClick={handleCardClick}>
      {}
      <div className="imagemPerfilContainer">
        <img
          src={profile.image}
          alt={profile.imageAlt || `Perfil de ${profile.name}`}
          className="imagemPerfil"
        />
      </div>

      {/* Text Content */}
      <div className="profile-text-content">
        <h3 className="profile-name">{profile.name}</h3>
        <p className="profile-location">{profile.location}</p>
        <p className="profile-experience">{profile.experience}</p>
      </div>
    </div>
  );
};

function Profissionais() {
  const [selectedFilter, setSelectedFilter] = useState("localizacao");

  // Opções de filtro formatadas corretamente como objetos
  const filterOptions = [
    { value: "localizacao", label: "Localização" },
    { value: "disponibilidade", label: "Disponibilidade" },
    { value: "favoritos", label: "Favoritos" },
    { value: "avaliacao", label: "Bem avaliados" },
  ];

  const localProfiles = [
    {
      image: mariaSilva,
      name: "Maria Silva",
      location: "São Paulo, SP",
      experience: "10 anos de experiência em enfermagem geriátrica",
    },
    {
      image: joaoOliveira,
      name: "João Oliveira",
      location: "Rio de Janeiro, RJ",
      experience: "Especialista em LIBRAS com 8 anos de mercado",
    },
    {
      image: anaSantos,
      name: "Ana Santos",
      location: "Belo Horizonte, MG",
      experience: "Fisioterapeuta especializada em reabilitação neurológica",
    },
    {
      image: carlosMendes,
      name: "Carlos Mendes",
      location: "Porto Alegre, RS",
      experience: "Psicólogo com foco em terceira idade - 12 anos",
    },
    {
      image: lucianaFerreira,
      name: "Luciana Ferreira",
      location: "Salvador, BA",
      experience: "Terapeuta ocupacional com experiência domiciliar",
    },
  ];
  return (
    <Corpo>
      <div className="container">
        <h1 className="titulo">Profissionais</h1>
        {/* Componente de filtro com todas as props necessárias */}
        <Filtro
          title="Filtros:"
          options={filterOptions}
          selectedOption={selectedFilter}
          onChange={setSelectedFilter}
        />
        <div className="profile-list">
          {localProfiles.map((profile, index) => (
            <ProfileCard key={index} profile={{profile, imageAlt: `${profile.name}, ${profile.experience.toLowerCase()} em ${profile.location}`}} />
          ))}
        </div>
      </div>
    </Corpo>
  );
}

export default Profissionais;
