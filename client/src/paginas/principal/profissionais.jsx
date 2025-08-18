import React, { useState } from "react";
import "./profissionais.css"; // O CSS existente será mantido e ajustado
import Filtro from "./filtro";
import Corpo from "../../componentes/layout/corpo.jsx";
import PainelControle from "../../components/acessibilidade/controles"; // Adicionado para consistência

// Imagens dos perfis
import mariaSilva from '../../assets/mulher.png';
import joaoOliveira from '../../assets/homem1.avif';
import anaSantos from '../../assets/mulher 3.webp';
import lucianaFerreira from '../../assets/mulher2.jpg';
import carlosMendes from '../../assets/homem2.jpg';

// Componente do Card de Perfil (sem alterações)
const ProfileCard = ({ profile }) => {
  const handleCardClick = () => {
    // A navegação para a página de perfil pode ser implementada aqui
    alert(`Você clicou no perfil de ${profile.name}`);
  };

  return (
    <div className="destaque1" onClick={handleCardClick}>
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
      <PainelControle />
      <div className="container">
        
        {/* SEÇÃO DE EXPLICAÇÃO INSERIDA AQUI */}
        <div className="secao-explicativa">
          <h1 className="titulo-principal">Guia ao Dispor</h1>
          <p>
            O projeto Guia ao Dispor nasceu da necessidade de criar uma ponte entre pessoas com necessidades específicas e o mercado de trabalho. Nosso objetivo é desenvolver um site que sirva como uma ferramenta de auxílio, inclusão e conexão.
          </p>
          <p>
            Abaixo, você encontra uma lista de profissionais qualificados e dedicados. Utilize os filtros para encontrar o auxílio que você precisa, de forma fácil e segura.
          </p>
        </div>

        {/* Conteúdo original da página */}
        <h2 className="titulo-secao">Profissionais</h2>
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
    </Corpo>
  );
}

export default Profissionais;
