import React, { useState, useEffect } from "react";
import "./profissionais.css";
import Filtro from "./Filtro";
import Corpo from "../../componentes/esqueleto/Corpo";
import ControlesAcessibilidade from "../../componentes/acessibilidade/ControlesAcessibilidade";

// Imagens locais como fallback enquanto a API não está populada
import mariaSilva from '../../recursos/mulher.png';
import joaoOliveira from '../../recursos/homem1.avif';
// ... outras imagens

const CartaoPerfil = ({ perfil }) => {
  const aoClicarNoCartao = () => {
    // Futuramente, navegar para a página de perfil dinâmico: navigate(`/perfil/${perfil.id}`)
    alert(`Você clicou no perfil de ${perfil.nome}`);
  };

  return (
    <div className="cartaoDestaque variacao1" onClick={aoClicarNoCartao}>
      <div className="containerImagemPerfil">
        <img
          src={perfil.imagem || 'caminho/para/imagem/padrao.png'}
          alt={perfil.imagemAlt}
          className="imagemPerfil"
        />
      </div>
      <div className="conteudoTextoPerfil">
        <h3 className="nomePerfil">{perfil.nome}</h3>
        <p className="localizacaoPerfil">{perfil.localizacao}</p>
        <p className="experienciaPerfil">{perfil.experiencia}</p>
      </div>
    </div>
  );
};

function Profissionais() {
  const [filtroSelecionado, setFiltroSelecionado] = useState("localizacao");
  const [perfis, setPerfis] = useState([]);

  useEffect(() => {
    const buscarProfissionais = async () => {
      try {
        const resposta = await fetch('/api/profissionais');
        const dados = await resposta.json();

        if (dados.status === 'sucesso' && dados.data.length > 0) {
          // Mapear dados da API para o formato esperado pelo componente
          const perfisFormatados = dados.data.map(p => ({
            id: p._id,
            nome: p.nome,
            imagem: p.fotoUrl || joaoOliveira, // Usar uma imagem padrão
            localizacao: p.localizacao?.nome || "Localização não informada",
            experiencia: p.descricaoBreve || "Descrição não disponível.",
            imagemAlt: `${p.nome}, profissional em ${p.localizacao?.nome}`
          }));
          setPerfis(perfisFormatados);
        } else {
          // Se a API não retornar dados, usar os dados locais como fallback
          throw new Error("API não retornou dados.");
        }
      } catch (erro) {
        console.warn("API indisponível ou sem dados. Usando dados locais.", erro);
        const perfisLocais = [
          { id: 1, imagem: mariaSilva, nome: "Maria Silva", localizacao: "São Paulo, SP", experiencia: "10 anos de experiência em enfermagem geriátrica" },
          { id: 2, imagem: joaoOliveira, nome: "João Oliveira", localizacao: "Rio de Janeiro, RJ", experiencia: "Especialista em LIBRAS com 8 anos de mercado" },
          // ... outros perfis locais
        ];
        const perfisLocaisFormatados = perfisLocais.map(p => ({
          ...p,
          imagemAlt: `${p.nome}, ${p.experiencia.toLowerCase()} em ${p.localizacao}`
        }));
        setPerfis(perfisLocaisFormatados);
      }
    };

    buscarProfissionais();
  }, []);

  const opcoesFiltro = [
    { value: "localizacao", label: "Localização" },
    { value: "disponibilidade", label: "Disponibilidade" },
    { value: "favoritos", label: "Favoritos" },
    { value: "avaliacao", label: "Bem avaliados" },
  ];

  return (
    <Corpo>
      <ControlesAcessibilidade />
      <div className="container">
        <h1 className="titulo">Profissionais</h1>
        <Filtro
          titulo="Filtros:"
          opcoes={opcoesFiltro}
          opcaoSelecionada={filtroSelecionado}
          aoMudar={setFiltroSelecionado}
        />
        <div className="listaDePerfis">
          {perfis.map(perfil => (
            <CartaoPerfil key={perfil.id} perfil={perfil} />
          ))}
        </div>
      </div>
    </Corpo>
  );
}

export default Profissionais;