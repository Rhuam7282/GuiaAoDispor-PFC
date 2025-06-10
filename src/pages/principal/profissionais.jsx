import React, { useState } from 'react';
import './profissionais.css'; // Importe o arquivo CSS
import Filtro from './filtro'; // Importe o componente Filtro
import Menu from '../../components/Menu';

const ProfileCard = ({ profile }) => {
  const handleCardClick = () => {
    console.log(`Card clicado: ${profile.name}`);
    // Aqui você pode adicionar a lógica desejada, como:
    // - Abrir um modal com mais detalhes
    // - Navegar para uma página de perfil
    // - Mostrar informações de contato
    alert(`Você clicou no perfil de ${profile.name}`);
  };

  return (
    <div className="profile-card" onClick={handleCardClick}>
      {/* Profile Image */}
      <div className="profile-image-container">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          alt={`Perfil de ${profile.name}`}
          className="profile-image"
        />
      </div>
      
      {/* Text Content */}
      <div className="profile-text-content">
        <h3 className="profile-name">
          {profile.name}
        </h3>
        <p className="profile-location">
          {profile.location}
        </p>
        <p className="profile-experience">
          {profile.experience}
        </p>
      </div>
    </div>
  );
};

function Profissionais() {

  const [selectedFilter, setSelectedFilter] = useState('localizacao');

   // Opções de filtro formatadas corretamente como objetos
  const filterOptions = [
    { value: 'localizacao', label: 'Localização' },
    { value: 'disponibilidade', label: 'Disponibilidade' },
    { value: 'favoritos', label: 'Favoritos' },
    { value: 'avaliacao', label: 'Bem avaliados' }
  ];

  const localProfiles = [
    { 
      name: "Maria Silva", 
      location: "São Paulo, SP", 
      experience: "10 anos de experiência em enfermagem geriátrica"
    },
    { 
      name: "João Oliveira", 
      location: "Rio de Janeiro, RJ", 
      experience: "Especialista em LIBRAS com 8 anos de mercado"
    },
    { 
      name: "Ana Santos", 
      location: "Belo Horizonte, MG", 
      experience: "Fisioterapeuta especializada em reabilitação neurológica"
    },
    { 
      name: "Carlos Mendes", 
      location: "Porto Alegre, RS", 
      experience: "Psicólogo com foco em terceira idade - 12 anos"
    },
    { 
      name: "Lucia Ferreira", 
      location: "Salvador, BA", 
      experience: "Terapeuta ocupacional com experiência domiciliar"
    }
  ];
  return (
    <div className="profissionais-container">
      <h2 className="profissionais-title">Profissionais</h2>
      {/* Componente de filtro com todas as props necessárias */}
      <Filtro 
        title="Filtros:"
        options={filterOptions}
        selectedOption={selectedFilter}
        onChange={setSelectedFilter}
      />
      <div className="profile-list">
        {localProfiles.map((profile, index) => (
          <ProfileCard key={index} profile={profile} />
        ))}
      </div>
    </div>
  );
}

export default Profissionais;