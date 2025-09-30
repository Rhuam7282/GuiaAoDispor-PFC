import React, { useState, useEffect } from "react";
import Corpo from "@Componentes/Layout/Corpo.jsx";
import Filtro from "./Componentes/Filtro.jsx";
import ListaProfissionais from "./componentes/ListaProfissionais.jsx";
import "./Qualificados.css";

function Qualificados() {
  const [filtroSelecionado, setFiltroSelecionado] = useState("localizacao");
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/profissionais`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProfissionais(data);
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
        setError("Não foi possível carregar os profissionais.");
      } finally {
        setLoading(false);
      }
    };

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
    alert(`Você clicou no perfil de ${perfil.nome}`);
  };

  if (loading) {
    return <Corpo><div className="container"><p>Carregando profissionais...</p></div></Corpo>;
  }

  if (error) {
    return <Corpo><div className="container"><p style={{ color: 'red' }}>{error}</p></div></Corpo>;
  }

  return (
    <Corpo>
      <div className="container">
        <h2 className="titulo">Profissionais</h2>
        
        <Filtro
          titulo="Filtros:"
          opcoes={opcoesFiltro}
          opcaoSelecionada={filtroSelecionado}
          aoMudar={setFiltroSelecionado}
        />
        
        <ListaProfissionais
          profissionais={profissionais}
          aoClicarPerfil={aoClicarPerfil}
        />
      </div>
    </Corpo>
  );
}

export default Qualificados;