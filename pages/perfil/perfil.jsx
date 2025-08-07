import React from 'react';
import './perfil.css';
import Corpo from "../../components/layout/corpo";

import mariaSilva from '../../assets/mulher.png';
import micheleto from '../../assets/hospital.jpg';
import butantan from '../../assets/butantan.webp';
import portugues from '../../assets/portugues.jpg';

const Perfil = () => {
  // Dados do perfil
  const profileData = {
    name: "Maria Silva",
    foto: mariaSilva,
    location: "Assis Chateaibriand, PR",
    description: "Enfermeira especializada em geriatria com 10 anos de experiência.",
    professionalHistory: [
      {
        name: 'Hospital Micheletto - Assis Chateaubriand',
        image: micheleto,
        alt: "Hospital Micheletto"
      },
      {
        name: 'Instituto Butantan - São Paulo',
        image: butantan,
        alt: "Instituto Butantan"
      },
      {
        name: 'Hospital Beneficente Português - Belém',
        image: portugues,
        alt: "Hospital Beneficente Português"
      }
    ],
    academicHistory: [
      { name: 'Graduação em Enfermagem - USP' },
      { name: 'Pós-graduação em Geriatria - UNIFESP' }
    ]
  };

  return (
    <Corpo>
      <div className="profile-page">
        <h1 className="title">Perfil</h1>

        <div className="profile-header">
          <div className="profile-image-large">
            <div className="circle-image-large">
                <img
                  src={profileData.foto}
                  alt={`Foto de ${profileData.name}`}
                  className="profile-photo"
                />
            </div>
          </div>

          <div className="profile-description">
            <h1>{profileData.name}</h1>
            <div className="description-box">
              <p>{profileData.description}</p>
            </div>

            <div className="location-rating">
              <div className="location">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" style={{ marginRight: '5px' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{profileData.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="history-section">
          <h2>Histórico Acadêmico:</h2>
          {/* Adicione os itens acadêmicos aqui se necessário */}
        </div>

        <div className="history-section">
          <h2>Histórico Profissional:</h2>
          <div className="professional-history">
            {profileData.professionalHistory.map((item, index) => (
              <div key={index} className="professional-item">
                <div className="professional-image">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="professional-history-image"
                  />
                </div>
                <div className="professional-info">
                  <h3>{item.name}</h3>
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