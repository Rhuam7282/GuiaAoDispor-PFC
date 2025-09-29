// componentes/ListaProfissionais.jsx
import React from "react";

const ListaProfissionais = ({ profissionais, aoClicarPerfil }) => {
  const handleImageError = (e) => {
    e.target.src = "@recursos/imagens/mulher.png"; // Caminho para a imagem padrão
  };

  return (
    <div className="profile-list">
      {profissionais.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Nenhum profissional encontrado.
        </div>
      ) : (
        profissionais.map((profissional) => (
          <div
            key={profissional._id}
            className="cartaoDestaque variacao1"
            onClick={() => aoClicarPerfil(profissional)}
            style={{
              cursor: "pointer",
              transition: "transform 0.2s",
              marginBottom: "20px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
                padding: "15px",
              }}
            >
              <img
                src={profissional.imagem} // CORREÇÃO: mudado de 'perfil' para 'profissional'
                alt={`Perfil de ${profissional.nome}`} // CORREÇÃO: mesma correção aqui
                className="imagemPerfil"
                onError={handleImageError} // Adicionei o handler de erro
              />
              <div className="profile-text-content">
                <span className="profile-name">{profissional.nome}</span>
                <span className="profile-location">
                  {profissional.localizacao}
                </span>
                <span className="profile-experience">
                  {profissional.experiencia}
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