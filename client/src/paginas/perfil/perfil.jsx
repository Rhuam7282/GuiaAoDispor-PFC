import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Corpo from "@Componentes/Layout/Corpo.jsx";
import InformacoesPerfil from "./Componentes/InformacoesPerfil.jsx";
import HistoricoAcademicoPerfil from "./Componentes/HistoricoAcademicoPerfil.jsx";
import HistoricoProfissionalPerfil from "./Componentes/HistoricoProfissionalPerfil.jsx";
import { servicoProfissional, servicoHCurricular, servicoHProfissional, servicoAuth } from "@Servicos/api.js";
import { useAuth } from "@Contextos/Autenticacao.jsx";

import {
  Mail,
  Facebook,
  Instagram,
  Linkedin,
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

  // Função para logout - CORREÇÃO: usar logout() do contexto
  const handleLogout = () => {
    logout();
    navigate("/cadastro");
  };

  // Dados estáticos para fallback
  const dadosEstaticos = {
    nome: "Maria Silva",
    foto: mariaSilva,
    localizacao: "Assis Chateaibriand, PR",
    descricao: "Enfermeira especializada in geriatria com 10 anos de experiência.",
    avaliacao: 4.8,
    redesSociais: [
      { icone: Mail, usuario: "maria.silva@exemplo.com" },
      { icone: Facebook, usuario: "/maria.silva" },
      { icone: Instagram, usuario: "@maria_silva" },
      { icone: Linkedin, usuario: "linkedin.com/in/maria-silva" },
    ],
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

  useEffect(() => {
    const carregarDadosPerfil = async () => {
      setCarregando(true);
      setErro(null);

      // Se não há ID na URL e o usuário está logado, carregar perfil do usuário logado
      if (!id && estaAutenticado() && user) {
        try {
          const resposta = await servicoAuth.buscarPerfilLogado(user._id);
          
          if (resposta && resposta.data) {
            const perfilFormatado = formatarDadosPerfil(resposta.data);
            setDadosPerfil(perfilFormatado);
            console.log("✅ Perfil carregado do servidor com sucesso");
          }
          
          // Para usuários comuns (não profissionais), não carregar históricos
          setHistoricoAcademico([]);
          setHistoricoProfissional([]);
          
        } catch (erro) {
          console.error("❌ Erro ao buscar perfil:", erro);
          const perfilFormatado = formatarDadosPerfil(user);
          setDadosPerfil(perfilFormatado);
          setErro(`Usando dados locais. Erro: ${erro.message}`);
        }
        
        setCarregando(false);
        return;
      }
        
        // Se não há ID e usuário não está logado, mostrar dados estáticos
        if (!id && !estaAutenticado()) {
          setDadosPerfil(dadosEstaticos);
          setHistoricoAcademico(dadosEstaticos.historicoAcademico);
          setHistoricoProfissional(dadosEstaticos.historicoProfissional);
          setCarregando(false);
          return;
        }

        // Se há ID na URL, buscar perfil específico (presumivelmente profissional)
        if (id) {
          try {
            const [perfilResposta, hcurricularResposta, hprofissionalResposta] = await Promise.all([
              servicoProfissional.buscarPorId(id),
              servicoHCurricular.buscarPorProfissional(id),
              servicoHProfissional.buscarPorProfissional(id)
            ]);

            const perfil = perfilResposta.data;
            const hcurriculares = hcurricularResposta.data || [];
            const hprofissionais = hprofissionalResposta.data || [];

            const perfilFormatado = formatarDadosPerfil(perfil);
            setDadosPerfil(perfilFormatado);

            const academicoFormatado = hcurriculares.map(hc => ({
              nome: hc.nome || "Curso não informado",
              instituicao: hc.instituicao || "Instituição não informada",
              periodo: hc.periodo || "Período não informado"
            }));

            const profissionalFormatado = hprofissionais.map(hp => ({
              nome: hp.empresa || "Empresa não informada",
              imagem: hp.imagem || micheleto,
              alt: hp.empresa || "Empresa",
            }));

            setHistoricoAcademico(academicoFormatado);
            setHistoricoProfissional(profissionalFormatado);

          } catch (error) {
            console.error("Erro ao carregar dados do perfil:", error);
            setErro("Erro ao carregar dados do perfil. Tente novamente.");
            
            // Usar dados estáticos como fallback
            setDadosPerfil(dadosEstaticos);
            setHistoricoAcademico(dadosEstaticos.historicoAcademico);
            setHistoricoProfissional(dadosEstaticos.historicoProfissional);
          }
        }
        
        setCarregando(false);
      };

    carregarDadosPerfil();
  }, [id, user, estaAutenticado]);

  // Função para formatar dados do perfil de forma consistente
  const formatarDadosPerfil = (dadosUsuario) => {
    if (!dadosUsuario) return dadosEstaticos;

    return {
      nome: dadosUsuario.nome || "Nome não informado",
      foto: dadosUsuario.foto || dadosUsuario.picture || mariaSilva,
      localizacao: dadosUsuario.localizacao?.nome || "Localização não informada",
      descricao: dadosUsuario.desc || dadosUsuario.descricao || "Descrição não informada",
      avaliacao: dadosUsuario.avaliacao || 0,
      email: dadosUsuario.email || "",
      face: dadosUsuario.face || dadosUsuario.facebook || "",
      inst: dadosUsuario.inst || dadosUsuario.instagram || "",
      linkedin: dadosUsuario.linkedin || "",
      redesSociais: [
        { icone: Mail, usuario: dadosUsuario.email || "" },
        { icone: Facebook, usuario: dadosUsuario.face || dadosUsuario.facebook || "" },
        { icone: Instagram, usuario: dadosUsuario.inst || dadosUsuario.instagram || "" },
        { icone: Linkedin, usuario: dadosUsuario.linkedin || "" },
      ].filter(rede => rede.usuario !== ""),
    };
  };

  // Função para verificar se é o perfil do próprio usuário
  const isPerfilProprio = () => {
    if (!estaAutenticado() || !user) return false;
    if (id) return user._id === id;
    return true; // Se não há ID na URL, é sempre o perfil próprio
  };

  // Função para verificar se é um perfil profissional
  const isPerfilProfissional = () => {
    return id || (historicoAcademico.length > 0 || historicoProfissional.length > 0);
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

  return (
    <Corpo>
      <div className="container">
        <div className="cabecalhoPerfil flexCentro">
          <h1 className="titulo">{dadosPerfil.nome}</h1>
          <div className="botoesCabecalho">
            {estaAutenticado() && isPerfilProprio() && (
              <button 
                className="botao botaoSecundario"
                onClick={() => setModoEdicao(!modoEdicao)}
              >
                {modoEdicao ? 'Cancelar Edição' : 'Editar Perfil'}
              </button>
            )}
            {estaAutenticado() && (
              <button 
                onClick={handleLogout}
                className="botao botaoSecundario flexCentro"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            )}
          </div>
        </div>
        
        {erro && (
          <div className="mensagemAviso">
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
          isPerfilProprio={isPerfilProprio()}
        />

        {/* Mostrar históricos apenas para perfis profissionais */}
        {isPerfilProfissional() && (
          <div className="flexContainer gapGrande">
            {historicoAcademico.length > 0 && (
              <HistoricoAcademicoPerfil 
                historicoAcademico={historicoAcademico} 
                isPerfilProprio={isPerfilProprio()}
              />
            )}
            {historicoProfissional.length > 0 && (
              <HistoricoProfissionalPerfil 
                historicoProfissional={historicoProfissional}
                nomePerfil={dadosPerfil.nome}
                isPerfilProprio={isPerfilProprio()}
              />
            )}
          </div>
        )}
      </div>
    </Corpo>
  );
};

export default Perfil;

