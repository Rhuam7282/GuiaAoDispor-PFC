import React from "react";

const ListaProfissionais = ({ profissionais, aoClicarPerfil }) => {
  const handleImageError = (e) => {
    e.target.style.filter = 'grayscale(100%)';
    e.target.style.opacity = '0.7';
    
    e.target.style.backgroundColor = '#f5f5f5';
    
    console.log('🖼️ Aplicando filtro cinza na imagem com erro');
  };

  const profissionaisComImagem = profissionais?.map(profissional => ({
    ...profissional,
    imagem: profissional.imagem?.startsWith('/') 
      ? profissional.imagem 
      : "/imagens/logo-cinza.png"
  })) || [];

  console.log('📊 Profissionais com imagem processada:', profissionaisComImagem.length);

  return (
    <div className="qualificados-profile-list">
      {profissionaisComImagem.length === 0 ? (
        <div className="qualificados-empty-state">
          <p>Nenhum profissional encontrado.</p>
          <small className="text-muted">
            Tente recarregar a página ou verificar a conexão.
          </small>
        </div>
      ) : (
        profissionaisComImagem.map((profissional) => (
          <div
            key={profissional._id}
            className="qualificados-cartaoDestaque"
            onClick={() => aoClicarPerfil(profissional)}
          >
            <div className="qualificados-profile-content">
              <img
                src={profissional.imagem}
                alt={`Perfil de ${profissional.nome}`}
                className="qualificados-imagemPerfil"
                onError={handleImageError}
                loading="lazy"
              />
              <div className="qualificados-profile-text-content">
                <span className="qualificados-profile-name">{profissional.nome}</span>
                <span className="qualificados-profile-location">
                  📍 {profissional.localizacao}
                </span>
                <span className="qualificados-profile-experience">
                  💼 {profissional.experiencia}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListaProfissionais;