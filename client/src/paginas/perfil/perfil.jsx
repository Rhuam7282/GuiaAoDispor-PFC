import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Corpo from "@Componentes/Layout/Corpo.jsx";
import InformacoesPerfil from "./Componentes/InformacoesPerfil.jsx";
import HistoricoAcademicoPerfil from "./Componentes/HistoricoAcademicoPerfil.jsx";
import HistoricoProfissionalPerfil from "./Componentes/HistoricoProfissionalPerfil.jsx";
import { servicoProfissional, servicoHCurricular, servicoHProfissional, servicoAuth } from "@Servicos/api.js";
import { useAuth } from "@Contextos/Autenticacao.jsx";

import {
  LogOut,
} from "lucide-react";

import mariaSilva from "@Recursos/Imagens/mulher.png";
import micheleto from "@Recursos/Imagens/hospital.jpg";
import butantan from "@Recursos/Imagens/butantan.webp";
import portugues from "@Recursos/Imagens/portugues.jpg";

const Perfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, estaAutenticado, logout } = useAuth();
  
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
    descricao: "Enfermeira especializada in geriatria com 10 anos de experiência.",
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

    return {
      _id: dadosUsuario._id,
      nome: dadosUsuario.nome || "Nome não informado",
      foto: dadosUsuario.foto || dadosUsuario.picture || mariaSilva,
      localizacao: dadosUsuario.localizacao?.nome || 
                  (dadosUsuario.localizacao ? 
                    `${dadosUsuario.localizacao.cidade || ''} ${dadosUsuario.localizacao.estado || ''}`.trim() 
                    : "Localização não informada"),
      descricao: dadosUsuario.desc || dadosUsuario.descricao || "Descrição não informada",
      avaliacao: dadosUsuario.avaliacao || dadosUsuario.nota || 0,
      email: dadosUsuario.email || "",
      face: dadosUsuario.face || dadosUsuario.facebook || "",
      inst: dadosUsuario.inst || dadosUsuario.instagram || "",
      linkedin: dadosUsuario.linkedin || "",
      tipoPerfil: dadosUsuario.tipoPerfil || 'Pessoal'
    };
  };

  // Função para carregar dados do perfil
  const carregarDadosPerfil = async () => {
    setCarregando(true);
    setErro(null);

    try {
      // CASO 1: Usuário logado acessando próprio perfil (sem ID na URL)
      if (!id && estaAutenticado() && user) {
        console.log("👤 Carregando perfil do usuário logado:", user._id);
        
        try {
          const resposta = await servicoAuth.buscarPerfilLogado(user._id);
          console.log("📨 Resposta da API:", resposta);
          
          if (resposta && resposta.status === 'sucesso' && resposta.data) {
            const perfilFormatado = formatarDadosPerfil(resposta.data);
            setDadosPerfil(perfilFormatado);
            console.log("✅ Perfil do usuário carregado com sucesso:", perfilFormatado);
            
            // Para usuários comuns, não carregar históricos
            if (resposta.data.tipoPerfil === 'Pessoal') {
              setHistoricoAcademico([]);
              setHistoricoProfissional([]);
            }
          } else {
            // Fallback para dados do contexto
            console.log("⚠️ Usando fallback para dados do contexto");
            const perfilFormatado = formatarDadosPerfil(user);
            setDadosPerfil(perfilFormatado);
          }
        } catch (erroApi) {
          console.error("❌ Erro ao buscar perfil da API:", erroApi);
          // Fallback para dados do contexto
          const perfilFormatado = formatarDadosPerfil(user);
          setDadosPerfil(perfilFormatado);
          setErro(`Usando dados locais. Erro: ${erroApi.message}`);
        }
      }
      // CASO 2: Perfil específico por ID (provavelmente profissional)
      else if (id) {
        console.log(`🔍 Carregando perfil específico: ${id}`);
        
        try {
          const [perfilResposta, hcurricularResposta, hprofissionalResposta] = await Promise.all([
            servicoProfissional.buscarPorId(id).catch(() => null),
            servicoHCurricular.buscarPorProfissional(id).catch(() => ({ data: [] })),
            servicoHProfissional.buscarPorProfissional(id).catch(() => ({ data: [] }))
          ]);

          if (perfilResposta && perfilResposta.data) {
            const perfil = perfilResposta.data;
            const perfilFormatado = formatarDadosPerfil(perfil);
            setDadosPerfil(perfilFormatado);

            // Carregar históricos para profissionais
            const hcurriculares = hcurricularResposta?.data || [];
            const hprofissionais = hprofissionalResposta?.data || [];

            const academicoFormatado = hcurriculares.map(hc => ({
              nome: hc.nome || "Curso não informado",
              instituicao: hc.instituicao || "Instituição não informada",
              periodo: hc.periodo || "Período não informado"
            }));

            const profissionalFormatado = hprofissionais.map(hp => ({
              nome: hp.nome || hp.empresa || "Empresa não informada",
              imagem: hp.foto || hp.imagem || micheleto,
              alt: hp.nome || "Empresa",
            }));

            setHistoricoAcademico(academicoFormatado);
            setHistoricoProfissional(profissionalFormatado);
            
            console.log("✅ Perfil profissional carregado com sucesso");
          } else {
            throw new Error('Perfil não encontrado');
          }
        } catch (error) {
          console.error("❌ Erro ao carregar perfil profissional:", error);
          throw error;
        }
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

  useEffect(() => {
    carregarDadosPerfil();
  }, [id, user, estaAutenticado]);

  // Função para verificar se é o perfil do próprio usuário
  const isPerfilProprio = () => {
    if (!estaAutenticado() || !user) return false;
    if (id) return user._id === id;
    return true; // Se não há ID na URL, é sempre o perfil próprio
  };

  // Função para verificar se é um perfil profissional
  const isPerfilProfissional = () => {
    return id || (dadosPerfil?.tipoPerfil === 'Profissional') || (historicoAcademico.length > 0 || historicoProfissional.length > 0);
  };

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
              style={{ marginTop: '20px' }}
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
              onClick={() => navigate('/')} 
              className="botao botaoPrimario"
              style={{ marginTop: '20px' }}
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
                {modoEdicao ? 'Cancelar Edição' : 'Editar Perfil'}
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
          user={user}
          id={id || (user ? user._id : null)}
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