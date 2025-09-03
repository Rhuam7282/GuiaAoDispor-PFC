import React, { useState } from "react";
import Corpo from "../../componentes/Layout/Corpo";
import Filtro from "./componentes/Filtro";
import ListaProfissionais from "./componentes/ListaProfissionais";
import "./qualificados.css";

import mariaSilva from '../../recursos/imagens/mulher.png';
import joaoOliveira from '../../recursos/imagens/homem1.avif';
import anaSantos from '../../recursos/imagens/mulher 3.webp';
import lucianaFerreira from '../../recursos/imagens/mulher2.jpg';
import carlosMendes from '../../recursos/imagens/homem2.jpg';

function Qualificados() {
  const [filtroSelecionado, setFiltroSelecionado] = useState("localizacao");

  const opcoesFiltro = [
    { value: "localizacao", label: "Localização" },
    { value: "disponibilidade", label: "Disponibilidade" },
    { value: "favoritos", label: "Favoritos" },
    { value: "avaliacao", label: "Bem avaliados" },
  ];

  const perfisProfissionais = [
    {
      imagem: mariaSilva,
      nome: "Maria Silva",
      localizacao: "São Paulo, SP",
      experiencia: "10 anos de experiência em enfermagem geriátrica",
    },
    {
      imagem: joaoOliveira,
      nome: "João Oliveira",
      localizacao: "Rio de Janeiro, RJ",
      experiencia: "Especialista em LIBRAS com 8 anos de mercado",
    },
    {
      imagem: anaSantos,
      nome: "Ana Santos",
      localizacao: "Belo Horizonte, MG",
      experiencia: "Fisioterapeuta especializada em reabilitação neurológica",
    },
    {
      imagem: carlosMendes,
      nome: "Carlos Mendes",
      localizacao: "Porto Alegre, RS",
      experiencia: "Psicólogo com foco em terceira idade - 12 anos",
    },
    {
      imagem: lucianaFerreira,
      nome: "Luciana Ferreira",
      localizacao: "Salvador, BA",
      experiencia: "Terapeuta ocupacional com experiência domiciliar",
    },
  ];

  const aoClicarPerfil = (perfil) => {
    console.log(`Perfil selecionado: ${perfil.nome}`);
    alert(`Você clicou no perfil de ${perfil.nome}`);
  };

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
          profissionais={perfisProfissionais}
          aoClicarPerfil={aoClicarPerfil}
        />
      </div>
    </Corpo>
  );
}

export default Qualificados;

