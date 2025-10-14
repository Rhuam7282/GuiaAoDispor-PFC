import React from "react";

const ListaProfissionais = ({ profissionais, aoClicarPerfil }) => {
  const handleImageError = (e) => {
    console.log('🖼️ Erro ao carregar imagem, usando padrão');
    e.target.src = "/imagens/mulher.png"; // CORREÇÃO: caminho absoluto
  };

  // Debug: verificar dados recebidos
  console.log('📊 Profissionais recebidos no ListaProfissionais:', profissionais);

  return (
    <div className="profile-list">
      {!profissionais || profissionais.length === 0 ? (
        <div 
          style={{ 
            textAlign: "center", 
            padding: "3rem",
            gridColumn: "1 / -1" 
          }}
        >
          <p>Nenhum profissional encontrado.</p>
          <small className="text-muted">
            Tente recarregar a página ou verificar a conexão.
          </small>
        </div>
      ) : (
        profissionais.map((profissional) => (
          <div
            key={profissional._id || `prof-${Math.random()}`}
            className="cartaoDestaque variacao1"
            onClick={() => aoClicarPerfil(profissional)}
            style={{
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              marginBottom: "20px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--sombra) var(--corNeutraEscura)";
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
                padding: "20px",
              }}
            >
              <img
                src={profissional.imagem} // CORREÇÃO: campo 'imagem' do backend
                alt={`Perfil de ${profissional.nome}`}
                className="imagemPerfil"
                onError={handleImageError}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div className="profile-text-content">
                <span className="profile-name">{profissional.nome}</span>
                <span className="profile-location">
                  📍 {profissional.localizacao}
                </span>
                <span className="profile-experience">
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