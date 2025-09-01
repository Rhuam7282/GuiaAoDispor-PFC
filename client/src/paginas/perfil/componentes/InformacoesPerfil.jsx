import React from 'react';
import { Star } from "lucide-react";

const InformacoesPerfil = ({ dadosPerfil, isAuthenticated, user, id, modoEdicao, setModoEdicao }) => {
  return (
    <div className="gridContainer gridTresColunas gapGrande margemInferiorGrande">
      <div className="alinharCentro">
        <img
          className="imagemPerfil imagemPerfilGrande"
          src={dadosPerfil.foto}
          alt={`${dadosPerfil.nome} - ${dadosPerfil.descricao} em ${dadosPerfil.localizacao}`}
        />
      </div>
      <div className="cartaoDestaque fundoMarromDestaqueTransparente textoEsquerda flexWrap">
        <p>{dadosPerfil.descricao}</p>
        <div className="listaHorizontal">
          <div className="flexLinha gapMedio alinharCentro">
            <div className="flexLinha gapPequeno alinharCentro">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(dadosPerfil.avaliacao)
                      ? "textoAmarelo preenchido"
                      : "textoMarromOfuscado"
                  }
                />
              ))}
              <span className="textoMarromEscuro">
                {dadosPerfil.avaliacao !== undefined && dadosPerfil.avaliacao !== null ? dadosPerfil.avaliacao.toFixed(1) : '0.0'}
              </span>
            </div>
            
            {isAuthenticated() && user && (!id || user._id === id) && (
              <button 
                className="botao botaoSecundario"
                onClick={() => setModoEdicao(!modoEdicao)}
              >
                {modoEdicao ? 'Cancelar Edição' : 'Editar Perfil'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformacoesPerfil;

