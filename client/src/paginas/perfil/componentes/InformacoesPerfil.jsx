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
        <div className="listaHorizontal ">
          <div className="gapMedio">
            <div className="flexCentro gapPequeno">
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
          </div>
        </div>

      </div>
      <div>
        <h3>Contatos</h3>
        <div className="listaIcones vertical">
          {(dadosPerfil.redesSociais || []).map((rede, index) => {
            const Icone = rede.icone;
            return (
              <div key={index} className="listaIcones">
                <Icone size={18} />
                <span>{rede.usuario}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InformacoesPerfil;

