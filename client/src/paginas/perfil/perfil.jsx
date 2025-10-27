import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Corpo from "../../componentes/layout/corpo.jsx";
import InformacoesPerfil from "./componentes/informacoesperfil.jsx";
import HistoricoAcademicoPerfil from "./componentes/historicoacademicoperfil.jsx";
import HistoricoProfissionalPerfil from "./componentes/historicoprofissionalperfil.jsx";
import {
  servicoProfissional,
  servicoHCurricular,
  servicoHProfissional,
  servicoAuth,
} from "../../servicos/api.js";
import { useAuth } from "../../contextos/autenticacao.jsx";
import "./perfil.css";

import { LogOut } from "lucide-react";

import mariaSilva from "../../recursos/imagens/mulher.png";
import micheleto from "../../recursos/imagens/hospital.jpg";
import butantan from "../../recursos/imagens/butantan.webp";
import portugues from "../../recursos/imagens/portugues.jpg";

const Perfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, estaAutenticado, logout } = useAuth();

  const [dadosPerfil, setDadosPerfil] = useState(null);
  const [historicoAcademico, setHistoricoAcademico] = useState([]);
  const [historicoProfissional, setHistoricoProfissional] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  // Dados estáticos para fallback
  const dadosEstaticos = {
    nome: "Maria Silva",
    foto: mariaSilva,
    localizacao: "Assis Chateaibriand, PR",
    descricao:
      "Enfermeira especializada in geriatria com 10 anos de experiência.",
    avaliacao: 4.8,
    email: "",
    face: "",
    inst: "",
    linkedin: "",
    historicoProfissional: [
      {
        nome: "Hospital Micheletto - Assis Chateaubriand",
        imagem: micheleto,
        alt: "Hospital Micheletto",
      },
      {
        nome: "Instituto Butantan - São Paulo",
        imagem: butantan,
        alt: "Instituto Butantan",
      },
      {
        nome: "Hospital Beneficente Português - Belém",
        imagem: portugues,
        alt: "Hospital Beneficente Português",
      },
    ],
    historicoAcademico: [
      {
        nome: "Graduação em Enfermagem",
        instituicao: "USP",
        periodo: "2010-2014",
      },
      {
        nome: "Pós-graduação em Geriatria",
        instituicao: "UNIFESP",
        periodo: "2015-2017",
      },
    ],
  };

  // Função para logout
  const handleLogout = () => {
    logout();
  };

  // Função para formatar dados do perfil de forma consistente
  const formatarDadosPerfil = (dadosUsuario) => {
    if (!dadosUsuario) return dadosEstaticos;

    console.log("📋 Formatando dados do perfil:", dadosUsuario);

    // Extrair localização de forma robusta
    let localizacaoFormatada = "Localização não informada";
    if (dadosUsuario.localizacao) {
      if (typeof dadosUsuario.localizacao === "string") {
        localizacaoFormatada = dadosUsuario.localizacao;
      } else if (typeof dadosUsuario.localizacao === "object") {
        localizacaoFormatada =
          dadosUsuario.localizacao.nome ||
          `${dadosUsuario.localizacao.cidade || ""} ${
            dadosUsuario.localizacao.estado || ""
          }`.trim() ||
          "Localização não informada";
      }
    }

    return {
      _id: dadosUsuario._id,
      nome: dadosUsuario.nome || "Nome não informado",
      foto: dadosUsuario.foto || dadosUsuario.picture || mariaSilva,
      localizacao: localizacaoFormatada,
      descricao:
        dadosUsuario.desc ||
        dadosUsuario.descricao ||
        "Descrição não informada",
      avaliacao: dadosUsuario.avaliacao || dadosUsuario.nota || 0,
      email: dadosUsuario.email || "",
      face: dadosUsuario.face || dadosUsuario.facebook || "",
      inst: dadosUsuario.inst || dadosUsuario.instagram || "",
      linkedin: dadosUsuario.linkedin || "",
      tipoPerfil: dadosUsuario.tipoPerfil || "Pessoal",
    };
  };

  // Nova função para carregar perfil profissional
  const carregarPerfilProfissional = async (profissionalId) => {
    try {
      const [perfilResposta, hcurricularResposta, hprofissionalResposta] =
        await Promise.all([
          servicoProfissional.buscarPorId(profissionalId).catch(() => null),
          servicoHCurricular.listarTodos().catch(() => ({ data: [] })),
          servicoHProfissional.listarTodos().catch(() => ({ data: [] })),
        ]);

      // Se não encontrou o perfil profissional, usar dados do usuário comum
      if (!perfilResposta || !perfilResposta.data) {
        console.log(
          "🔍 Perfil profissional não encontrado, buscando como usuário comum..."
        );
        const respostaUsuario = await servicoAuth.buscarPerfilLogado(
          profissionalId
        );

        if (respostaUsuario && respostaUsuario.data) {
          const perfilFormatado = formatarDadosPerfil(respostaUsuario.data);
          setDadosPerfil(perfilFormatado);

          // Limpar históricos já que é usuário comum
          setHistoricoAcademico([]);
          setHistoricoProfissional([]);

          console.log("✅ Perfil de usuário comum carregado com sucesso");
          return;
        } else {
          throw new Error("Perfil não encontrado");
        }
      }

      const perfil = perfilResposta.data;
      const perfilFormatado = formatarDadosPerfil(perfil);
      setDadosPerfil(perfilFormatado);

      // Filtrar históricos por profissional
      const hcurriculares = Array.isArray(hcurricularResposta?.data)
        ? hcurricularResposta.data.filter(
            (hc) => hc.profissional === profissionalId
          )
        : [];

      const hprofissionais = Array.isArray(hprofissionalResposta?.data)
        ? hprofissionalResposta.data.filter(
            (hp) => hp.profissional === profissionalId
          )
        : [];

      const academicoFormatado = hcurriculares.map((hc) => ({
        nome: hc.nome || "Curso não informado",
        instituicao: hc.instituicao || "Instituição não informada",
        periodo: hc.periodo || "Período não informado",
      }));

      const profissionalFormatado = hprofissionais.map((hp) => ({
        nome: hp.nome || "Empresa não informada",
        imagem: hp.foto || micheleto,
        alt: hp.nome || "Empresa",
      }));

      setHistoricoAcademico(academicoFormatado);
      setHistoricoProfissional(profissionalFormatado);

      console.log("✅ Perfil profissional carregado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao carregar perfil profissional:", error);
      throw error;
    }
  };

  // Nova função para carregar históricos do profissional
  const carregarHistoricosProfissional = async (profissionalId) => {
    try {
      const [hcurricularResposta, hprofissionalResposta] = await Promise.all([
        servicoHCurricular.listarTodos().catch(() => ({ data: [] })),
        servicoHProfissional.listarTodos().catch(() => ({ data: [] })),
      ]);

      // Filtrar históricos por profissional
      const hcurriculares = Array.isArray(hcurricularResposta?.data)
        ? hcurricularResposta.data.filter(
            (hc) => hc.profissional === profissionalId
          )
        : [];

      const hprofissionais = Array.isArray(hprofissionalResposta?.data)
        ? hprofissionalResposta.data.filter(
            (hp) => hp.profissional === profissionalId
          )
        : [];

      const academicoFormatado = hcurriculares.map((hc) => ({
        nome: hc.nome || "Curso não informado",
        instituicao: hc.instituicao || "Instituição não informada",
        periodo: hc.periodo || "Período não informado",
      }));

      const profissionalFormatado = hprofissionais.map((hp) => ({
        nome: hp.nome || "Empresa não informada",
        imagem: hp.foto || micheleto,
        alt: hp.nome || "Empresa",
      }));

      setHistoricoAcademico(academicoFormatado);
      setHistoricoProfissional(profissionalFormatado);
    } catch (error) {
      console.error("Erro ao carregar históricos do profissional:", error);
      setHistoricoAcademico([]);
      setHistoricoProfissional([]);
    }
  };

  // Função para carregar dados do perfil
  const carregarDadosPerfil = async () => {
    setCarregando(true);
    setErro(null);

    try {
      // CASO 1: Usuário logado acessando próprio perfil (sem ID na URL)
      if (!id && estaAutenticado() && usuario) {
        console.log("👤 Carregando perfil do usuário logado:", usuario._id);

        try {
          // Buscar perfil atualizado da API
          const resposta = await servicoAuth.buscarPerfilLogado(usuario._id);
          console.log("📨 Resposta da API do perfil:", resposta);

          if (resposta && resposta.status === "sucesso" && resposta.data) {
            const perfilFormatado = formatarDadosPerfil(resposta.data);
            setDadosPerfil(perfilFormatado);
            console.log("✅ Perfil carregado da API:", perfilFormatado);

            // Se for profissional, carregar históricos
            if (
              resposta.data.tipoPerfil === "Profissional" ||
              resposta.data.desc
            ) {
              await carregarHistoricosProfissional(usuario._id);
            } else {
              setHistoricoAcademico([]);
              setHistoricoProfissional([]);
            }
          } else {
            throw new Error("Resposta da API não contém dados");
          }
        } catch (erroApi) {
          console.error("❌ Erro ao buscar perfil da API:", erroApi);

          // FALLBACK: Usar dados do contexto de autenticação
          console.log(
            "🔄 Usando dados do contexto de autenticação como fallback"
          );
          const perfilFormatado = formatarDadosPerfil(usuario);
          setDadosPerfil(perfilFormatado);

          // Tentar carregar históricos mesmo no fallback
          if (usuario.tipoPerfil === "Profissional" || usuario.desc) {
            await carregarHistoricosProfissional(usuario._id);
          } else {
            setHistoricoAcademico([]);
            setHistoricoProfissional([]);
          }

          setErro(
            `Dados carregados localmente. Erro da API: ${erroApi.message}`
          );
        }
      }
      // CASO 2: Perfil específico por ID (provavelmente profissional)
      else if (id) {
        console.log(`🔍 Carregando perfil específico: ${id}`);
        await carregarPerfilProfissional(id);
      }
      // CASO 3: Usuário não logado, mostrar dados estáticos
      else {
        console.log("👤 Mostrando perfil estático (usuário não logado)");
        setDadosPerfil(dadosEstaticos);
        setHistoricoAcademico(dadosEstaticos.historicoAcademico);
        setHistoricoProfissional(dadosEstaticos.historicoProfissional);
      }
    } catch (error) {
      console.error("❌ Erro geral ao carregar perfil:", error);
      setErro("Erro ao carregar dados do perfil. Tente novamente.");

      // Fallback para dados estáticos
      setDadosPerfil(dadosEstaticos);
      setHistoricoAcademico(dadosEstaticos.historicoAcademico);
      setHistoricoProfissional(dadosEstaticos.historicoProfissional);
    } finally {
      setCarregando(false);
    }
  };

  // Função para verificar se é o perfil do próprio usuário
  const isPerfilProprio = () => {
    if (!estaAutenticado() || !usuario) return false;
    if (id) return usuario._id === id;
    return true; // Se não há ID na URL, é sempre o perfil próprio
  };

  // Função para verificar se é um perfil profissional
  const isPerfilProfissional = () => {
    return (
      id ||
      dadosPerfil?.tipoPerfil === "Profissional" ||
      (dadosPerfil?.desc && dadosPerfil.desc !== "Descrição não informada") ||
      historicoAcademico.length > 0 ||
      historicoProfissional.length > 0
    );
  };

  useEffect(() => {
    console.log("🔍 Iniciando carregamento do perfil");
    console.log("🔍 ID da URL:", id);
    console.log("🔍 Usuário no contexto:", usuario);
    console.log("🔍 Está autenticado?", estaAutenticado());

    carregarDadosPerfil();
  }, [id, usuario, estaAutenticado]);

  if (carregando) {
    return (
      <Corpo>
        <div className="container textoCentro paddingGrande">
          <div className="carregando">
            <h2>Carregando perfil...</h2>
          </div>
        </div>
      </Corpo>
    );
  }

  if (erro && !dadosPerfil) {
    return (
      <Corpo>
        <div className="container">
          <div className="erro textoCentro paddingGrande">
            <h2>Erro ao carregar perfil</h2>
            <p>{erro}</p>
            <button
              onClick={() => window.location.reload()}
              className="botao botaoPrimario"
              style={{ marginTop: "20px" }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </Corpo>
    );
  }

  // Garantir que dadosPerfil nunca seja null
  if (!dadosPerfil) {
    return (
      <Corpo>
        <div className="container textoCentro paddingGrande">
          <div className="erro">
            <h2>Perfil não disponível</h2>
            <button
              onClick={() => navigate("/")}
              className="botao botaoPrimario"
              style={{ marginTop: "20px" }}
            >
              Voltar para início
            </button>
          </div>
        </div>
      </Corpo>
    );
  }

  return (
    <Corpo>
      <div className="container">
        <div className="cabecalhoPerfil flexCentro espaçoEntre">
          <h1 className="titulo">{dadosPerfil.nome}</h1>
          <div className="botoesCabecalho flexCentro gapPequeno">
            {estaAutenticado() && isPerfilProprio() && (
              <button
                className="botao botaoSecundario"
                onClick={() => setModoEdicao(!modoEdicao)}
              >
                {modoEdicao ? "Cancelar Edição" : "Editar Perfil"}
              </button>
            )}
            {estaAutenticado() && isPerfilProprio() && (
              <button
                onClick={handleLogout}
                className="botao botaoSecundario flexCentro gapPequeno"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            )}
          </div>
        </div>

        {erro && (
          <div className="mensagemAviso margemInferiorMedia">
            <p>⚠️ {erro}</p>
          </div>
        )}

        <InformacoesPerfil
          dadosPerfil={dadosPerfil}
          estaAutenticado={estaAutenticado}
          usuario={usuario}
          id={id || (usuario ? usuario._id : null)}
          modoEdicao={modoEdicao}
          setModoEdicao={setModoEdicao}
        />

        {/* Mostrar históricos apenas para perfis profissionais */}
        {isPerfilProfissional() && (
          <div className="flexContainer gapGrande">
            {historicoAcademico.length > 0 && (
              <HistoricoAcademicoPerfil
                historicoAcademico={historicoAcademico}
              />
            )}
            {historicoProfissional.length > 0 && (
              <HistoricoProfissionalPerfil
                historicoProfissional={historicoProfissional}
                nomePerfil={dadosPerfil.nome}
              />
            )}
          </div>
        )}
      </div>
    </Corpo>
  );
};

export default Perfil;
