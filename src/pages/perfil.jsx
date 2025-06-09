import React from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import RatingStars from '../components/ui/RatingStars';
import SocialLinks from '../components/page/SocialLinks';
import ImageGallery from '../components/page/ImageGallery';
import '../styles/global.css';
import './ProfilePage.css';

const ProfilePage = () => {
  // Dados de exemplo para redes sociais
  const socialLinks = [
    { type: 'facebook', username: '@exemplo', url: '#' },
    { type: 'instagram', username: '@exemplo', url: '#' },
    { type: 'youtube', username: '@exemplo', url: '#' }
  ];
  
  // Dados de exemplo para histórico profissional
  const professionalHistory = [
    { name: 'Hospital Micheletto - Assis Chateaubriand' },
    { name: 'Instituto Butantan - São Paulo' },
    { name: 'Hospital Beneficente Português - Belém' }
  ];
  
  return (
    <Layout>
      <div className="profile-page">
        <h1>Nome</h1>
        
        <div className="profile-header">
          <div className="profile-image-large">
            <div className="circle-image-large"></div>
          </div>
          
          <div className="profile-description">
            <h3>Descrição</h3>
            <div className="description-box">
              <p>Informações detalhadas sobre o perfil do usuário...</p>
            </div>
            
            <SocialLinks links={socialLinks} />
          </div>
        </div>
        
        <div className="location-rating">
          <div className="location">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" style={{ marginRight: '5px' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Localização</span>
          </div>
          <RatingStars rating={5} />
        </div>
        
        <div className="history-section">
          <h2>Histórico Acadêmico:</h2>
          <ImageGallery />
        </div>
        
        <div className="history-section">
          <h2>Histórico Profissional:</h2>
          <div className="professional-history">
            {professionalHistory.map((item, index) => (
              <div key={index} className="professional-item">
                <div className="professional-image"></div>
                <div className="professional-info">
                  <h3>{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
