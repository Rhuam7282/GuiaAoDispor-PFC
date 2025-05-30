import React from 'react';
import './Profissionais.css'; // Importe o arquivo CSS

const ProfileCard = ({ profile }) => {
  return (
    <div className="profile-card">
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
      <h1 className="profissionais-title">
        Profissionais Cadastrados
      </h1>

      {/* Lista de profissionais usando ProfileCard */} 
      <div className="profile-list">
        {localProfiles.map((profile, index) => (
          <ProfileCard key={index} profile={profile} />
        ))}
      </div>
    </div>
  );
}

export default Profissionais;