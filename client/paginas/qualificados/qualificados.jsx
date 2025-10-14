import React, { useState, useEffect } from "react";
import Corpo from "../../Componentes/Layout/Corpo.jsx";
import Filtro from "./Componentes/Filtro.jsx";
import ListaProfissionais from "./Componentes/ListaProfissionais.jsx";
import "./Qualificados.css";

function Qualificados() {
  const [filtroSelecionado, setFiltroSelecionado] = useState("localizacao");
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dados mock para fallback
  const profissionaisMock = [
    {
      _id: "mock-1",
      imagem: "/imagens/mulher.png",
      nome: "Ana Silva",
      localizacao: "São Paulo, SP",
      experiencia: "Enfermeira com 5 anos de experiência"
    },
    {
      _id: "mock-2", 
      imagem: "/imagens/homem.png",
      nome: "Carlos Santos",
      localizacao: "Rio de Janeiro, RJ",
      experiencia: "Cuidador especializado"
    }
  ];

  const fetchProfissionais = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Buscando profissionais da API...');
      
      const response = await fetch('/api/profissionais', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Profissionais carregados:', data);
      
      setProfissionais(data);

    } catch (error) {
      console.error('❌ Erro ao carregar profissionais:', error);
      setError(`Não foi possível conectar com o servidor: ${error.message}`);
      // Usar dados mock em caso de erro
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
    if (perfil._id.includes('mock')) {
      alert(`📋 Dados de exemplo: ${perfil.nome}\n\nO backend está offline no momento.`);
    } else {
      alert(`Perfil de ${perfil.nome}`);
    }
  };

  const handleRetry = () => {
    fetchProfissionais();
  };

  return (
    <Corpo>
      <div className="container">
        {/* SEMPRE VISÍVEL - Título e Filtro */}
        <div className="row">
          <div className="col-12">
            <h2 className="titulo" style={{ marginBottom: '1rem' }}>Profissionais Qualificados</h2>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Filtro
                titulo="Filtros:"
                opcoes={opcoesFiltro}
                opcaoSelecionada={filtroSelecionado}
                aoMudar={setFiltroSelecionado}
              />
              
              {profissionais.length > 0 && (
                <small className="text-muted">
                  {profissionais.length} profissional{profissionais.length !== 1 ? 'es' : ''} 
                  {error && ' (dados de exemplo)'}
                </small>
              )}
            </div>
          </div>
        </div>

        {/* Área de Status */}
        {error && (
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning d-flex align-items-center" role="alert">
                <div>
                  <strong>⚠️ Aviso:</strong> {error}
                </div>
                <button 
                  className="btn btn-sm btn-outline-warning ms-3"
                  onClick={handleRetry}
                  disabled={loading}
                >
                  {loading ? 'Tentando...' : 'Tentar Novamente'}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="row">
            <div className="col-12 text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
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
                <p className="mb-0">Não há profissionais disponíveis no momento.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Corpo>
  );
}

export default Qualificados;