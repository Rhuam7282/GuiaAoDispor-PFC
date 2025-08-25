import React from "react";
import "./perfil.css";
import Corpo from "@componentes/layout/corpo";
import { useProfissional } from "@ganchos/useProfissional"; // Hook personalizado para buscar dados
import { useParams } from 'react-router-dom';
import {
  Star,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Phone
} from "lucide-react";

const Perfil = () => {
  const { id } = useParams(); // Obtenha o ID da URL
  const { profissional, loading, error } = useProfissional(id);

  if (loading) {
    return (
      <Corpo>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Carregando perfil...</h2>
            <p>Isso pode levar alguns instantes</p>
          </div>
        </div>
      </Corpo>
    );
  }
  if (!id) {
    return (
      <Corpo>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>ID do profissional não especificado</h2>
            <p>Por favor, verifique o URL e tente novamente.</p>
          </div>
        </div>
      </Corpo>
    );
  }

  if (error) {
    return (
      <Corpo>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            <h2>Erro ao carregar perfil</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Tentar novamente
            </button>
          </div>
        </div>
      </Corpo>
    );
  }
  if (error) return <div>Erro ao carregar perfil: {error.message}</div>;
  if (!profissional) return <div>Profissional não encontrado</div>;

  // Mapear redes sociais
  const redesSociais = [
    { icone: Mail, usuario: profissional.email },
    { icone: Facebook, usuario: profissional.face },
    { icone: Instagram, usuario: profissional.inst },
    { icone: Linkedin, usuario: profissional.linkedin },
    { icone: Phone, usuario: profissional.num }
  ].filter(rede => rede.usuario); // Remove redes vazias

  return (
    <Corpo>
      <div className="container">
        <h1 className="titulo">{profissional.nome}</h1>

        <div className="containerPrincipal">
          <div className="colunaFoto">
            <img
              className="imagemPerfil"
              src={profissional.foto || '/caminho/para/imagem/padrao.jpg'}
              alt={`${profissional.nome} - ${profissional.desc}`}
              onError={(e) => {
                e.target.src = '/caminho/para/imagem/padrao.jpg';
              }}
            />
          </div>
          <div className="cartaoDestaque variacao3">
            <p>{profissional.desc}</p>
            <div className="detalhesPerfil">
              <div className="icone">
                <MapPin size={20} />
                <span>{profissional.localizacao?.nome}</span>
              </div>

              <div className="icone">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < Math.floor(profissional.nota || 0) ? "#54453B" : "none"}
                    stroke="#54453B"
                  />
                ))}
                <span className="valorAvaliacao">{profissional.nota || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Coluna direita com contatos */}
          <div className="colunaContatos">
            <h3>Contatos</h3>
            <div className="listaIcones vertical">
              {redesSociais.map((rede, index) => {
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

        {/* Histórico Acadêmico */}
        {profissional.historicoAcademico?.length > 0 && (
          <div className="secaoHistorico">
            <h2>Histórico Acadêmico</h2>
            <div className="listaAcademica">
              {profissional.historicoAcademico.map((item, index) => (
        "conteúdo do histórico acadêmico"
      ))};
            </div>
          </div>
        )}

        {profissional.historicoProfissional?.length > 0 && (
          <div className="secaoHistorico">
            <h2>Histórico Profissional</h2>
            <div className="listaProfissional">
              {profissional.historicoProfissional.map((item, index) => (
        "conteúdo do histórico profissional"
      ))}
            </div>
          </div>
        )}
      </div>
    </Corpo>
  );
};

export default Perfil;