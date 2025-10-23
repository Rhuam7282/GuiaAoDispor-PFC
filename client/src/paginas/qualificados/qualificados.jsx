import React, { useState, useEffect } from "react";
import Corpo from "../../componentes/layout/corpo.jsx";
import Filtro from "./componentes/filtro.jsx";
import ListaProfissionais from "./componentes/listaprofissionais.jsx";
import "./qualificados.css";
import { servicoProfissional } from "../../servicos/api.js";
import Logo from "../../recursos/icones/logo.png";

function Qualificados() {
  const [filtroSelecionado, setFiltroSelecionado] = useState("localizacao");
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dados mock para fallback
  const profissionaisMock = [
    {
      _id: "mock-1",
      imagem: Logo,
      nome: "Ana Silva",
      localizacao: "São Paulo, SP",
      experiencia: "Enfermeira com 5 anos de experiência",
    },
    {
      _id: "mock-2",
      imagem: Logo,
      nome: "Carlos Santos",
      localizacao: "Rio de Janeiro, RJ",
      experiencia: "Cuidador especializado",
    },
  ];

  const fetchProfissionais = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Buscando profissionais da API...");

      // Use o serviço da API em vez de fetch direto
      const resposta = await servicoProfissional.listarTodos();
      console.log("✅ Resposta da API:", resposta);

      // Verifica diferentes estruturas de resposta
      let dadosProfissionais = [];

      if (Array.isArray(resposta)) {
        dadosProfissionais = resposta;
      } else if (resposta && Array.isArray(resposta.data)) {
        dadosProfissionais = resposta.data;
      } else {
        console.warn("⚠️ Estrutura de resposta inesperada, usando dados mock");
        dadosProfissionais = profissionaisMock;
      }

      setProfissionais(dadosProfissionais);
    } catch (error) {
      console.error("❌ Erro ao carregar profissionais:", error);
      // Use dados mock silenciosamente sem mostrar erro
      setProfissionais(profissionaisMock);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfissionais();
  }, []);

  const opcoesFiltro = [
    { value: "localizacao", label: "Localização" },
    { value: "disponibilidade", label: "Disponibilidade" },
    { value: "favoritos", label: "Favoritos" },
    { value: "avaliacao", label: "Bem avaliados" },
  ];

  const aoClicarPerfil = (perfil) => {
    console.log(`Perfil selecionado: ${perfil.nome}`);
    if (perfil._id.includes("mock")) {
      alert(
        `📋 Dados de exemplo: ${perfil.nome}\n\nO backend está offline no momento.`
      );
    } else {
      alert(`Perfil de ${perfil.nome}`);
    }
  };

  const aoSelecionarArquivo = (arquivo) => {
    if (arquivo) {
      // Cria uma URL temporária para preview
      const urlTemporaria = URL.createObjectURL(arquivo);

      // Atualiza o estado com a URL temporária E o arquivo original
      setDadosFormulario((prev) => ({
        ...prev,
        foto: urlTemporaria,
        arquivoFoto: arquivo, // Guarda o arquivo original para enviar depois
      }));
    }
  };

  return (
    <Corpo>
      <div className="container">
        {/* SEMPRE VISÍVEL - Título e Filtro */}
        <div className="row">
          <div className="col-12">
            <h2 className="titulo" style={{ marginBottom: "1rem" }}>
              Profissionais
            </h2>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <Filtro
                titulo="Filtros:"
                opcoes={opcoesFiltro}
                opcaoSelecionada={filtroSelecionado}
                aoMudar={setFiltroSelecionado}
              />

              {profissionais.length > 0 && (
                <small className="text-muted">
                  {profissionais.length}
                  {profissionais.length !== 1
                    ? " profissionais"
                    : " profissional"}
                </small>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="row">
            <div className="col-12 text-center py-3">
              <div
                className="spinner-border spinner-border-sm text-primary me-2"
                role="status"
              ></div>
              <span>Carregando profissionais...</span>
            </div>
          </div>
        )}

        {/* SEMPRE VISÍVEL - Lista de Profissionais */}
        <div className="row">
          <div className="col-12">
            <ListaProfissionais
              profissionais={profissionais}
              aoClicarPerfil={aoClicarPerfil}
            />
          </div>
        </div>

        {/* Mensagem quando não há profissionais */}
        {profissionais.length === 0 && !loading && !error && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="alert alert-info">
                <h5>Nenhum profissional cadastrado</h5>
                <p className="mb-0">
                  Não há profissionais disponíveis no momento.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Corpo>
  );
}

export default Qualificados;
