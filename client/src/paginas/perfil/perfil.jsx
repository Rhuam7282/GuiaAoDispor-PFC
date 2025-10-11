import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Corpo from "../../componentes/Layout/Corpo.jsx";
import InformacoesPerfil from "./Componentes/InformacoesPerfil.jsx";
import HistoricoAcademicoPerfil from "./Componentes/HistoricoAcademicoPerfil.jsx";
import HistoricoProfissionalPerfil from "./Componentes/HistoricoProfissionalPerfil.jsx";
import { ServicoProfissional, ServicoHCurricular, ServicoHProfissional, ServicoAutenticacao, ServicoUsuario } from "../../Servicos/api.js";
import { useAuth } from "../../contextos/Autenticacao.jsx";
import "./perfil.css";

import {
  LogOut,
} from "lucide-react";

import mariaSilva from "../../Recursos/Imagens/mulher.png";
import micheleto from "../../Recursos/Imagens/hospital.jpg";
import butantan from "../../Recursos/Imagens/butantan.webp";
import portugues from "../../Recursos/Imagens/portugues.jpg";

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

    // Extrair localização de forma robusta
    let localizacaoFormatada = "Localização não informada";
    if (dadosUsuario.localizacao) {
      if (typeof dadosUsuario.localizacao === 'string') {
        localizacaoFormatada = dadosUsuario.localizacao;
      } else if (typeof dadosUsuario.localizacao === 'object') {
        localizacaoFormatada = dadosUsuario.localizacao.nome || 
          `${dadosUsuario.localizacao.cidade || ''} ${dadosUsuario.localizacao.estado || ''}`.trim() ||
          "Localização não informada";
      }
    }

    return {
      _id: dadosUsuario._id,
      nome: dadosUsuario.nome || "Nome não informado",
      foto: dadosUsuario.foto || dadosUsuario.picture || mariaSilva,
      localizacao: localizacaoFormatada,
      descricao: dadosUsuario.desc || dadosUsuario.descricao || "Descrição não informada",
      avaliacao: dadosUsuario.avaliacao || dadosUsuario.nota || 0,
      email: dadosUsuario.email || "",
      face: dadosUsuario.face || dadosUsuario.facebook || "",
      inst: dadosUsuario.inst || dadosUsuario.instagram || "",
      linkedin: dadosUsuario.linkedin || "",
      tipoPerfil: dadosUsuario.tipoPerfil || 'Pessoal'
    };
  };

  // Função para carregar perfil profissional - CORRIGIDA (usa apenas rota que existe)
  const carregarPerfilProfissional = async (profissionalId) => {
    try {
      console.log(`🔍 Buscando perfil via ServicoAutenticacao: ${profissionalId}`);
      
      // USA APENAS A ROTA QUE EXISTE NO BACKEND
      const resposta = await ServicoAutenticacao.buscarPerfilLogado(profissionalId);
      console.log("✅ Resposta do ServicoAutenticacao:", resposta);

      // Carregar históricos em paralelo
      const [ServicoHCurricularResposta, ServicoHProfissionalResposta] = await Promise.all([
        ServicoHCurricular.listarTodos().catch(() => ({ data: [] })),
        ServicoHProfissional.listarTodos().catch(() => ({ data: [] }))
      ]);

      if (resposta && (resposta.status === 'sucesso' && resposta.data || resposta._id)) {
        const perfil = resposta.data || resposta;
        const perfilFormatado = formatarDadosPerfil(perfil);
        setDadosPerfil(perfilFormatado);

        // Filtrar históricos por profissional
        const ServicoHCurriculares = Array.isArray(ServicoHCurricularResposta?.data) 
          ? ServicoHCurricularResposta.data.filter(hc => 
              hc.profissional === profissionalId || hc.usuario === profissionalId
            )
          : [];
        
        const hprofissionais = Array.isArray(ServicoHProfissionalResposta?.data) 
          ? ServicoHProfissionalResposta.data.filter(hp => 
              hp.profissional === profissionalId || hp.usuario === profissionalId
            )
          : [];

        const academicoFormatado = ServicoHCurriculares.map(hc => ({
          _id: hc._id,
          nome: hc.nome || hc.titulo || "Curso não informado",
          instituicao: hc.instituicao || "Instituição não informada",
          periodo: hc.periodo || hc.duracao || "Período não informado"
        }));

        const profissionalFormatado = hprofissionais.map(hp => ({
          _id: hp._id,
          nome: hp.nome || hp.empresa || "Empresa não informada",
          imagem: hp.foto || hp.imagem || micheleto,
          alt: hp.nome || hp.empresa || "Empresa",
        }));

        setHistoricoAcademico(academicoFormatado);
        setHistoricoProfissional(profissionalFormatado);
        
        console.log("✅ Perfil profissional carregado com sucesso");
      } else {
        throw new Error('Perfil não encontrado na resposta da API');
      }
    } catch (error) {
      console.error("❌ Erro ao carregar perfil profissional:", error);
      
      // Fallback: usar dados do contexto ou dados estáticos
      console.log("🔄 Usando fallback...");
      
      if (usuario && usuario._id === id) {
        console.log("✅ Usando dados do contexto de autenticação");
        const perfilFormatado = formatarDadosPerfil(usuario);
        setDadosPerfil(perfilFormatado);
        setHistoricoAcademico([]);
        setHistoricoProfissional([]);
      } else {
        console.log("✅ Usando dados estáticos");
        setDadosPerfil(dadosEstaticos);
        setHistoricoAcademico(dadosEstaticos.historicoAcademico);
        setHistoricoProfissional(dadosEstaticos.historicoProfissional);
      }
      
      throw error;
    }
  };

  // Nova função para carregar históricos do profissional
  const carregarHistoricosProfissional = async (profissionalId) => {
    try {
      const [ServicoHCurricularResposta, ServicoHProfissionalResposta] = await Promise.all([
        ServicoHCurricular.listarTodos().catch(() => ({ data: [] })),
        ServicoHProfissional.listarTodos().catch(() => ({ data: [] }))
      ]);

      // Filtrar históricos por profissional
      const ServicoHCurriculares = Array.isArray(ServicoHCurricularResposta?.data) 
        ? ServicoHCurricularResposta.data.filter(hc => 
            hc.profissional === profissionalId || hc.usuario === profissionalId
          )
        : [];
      
      const hprofissionais = Array.isArray(ServicoHProfissionalResposta?.data) 
        ? ServicoHProfissionalResposta.data.filter(hp => 
            hp.profissional === profissionalId || hp.usuario === profissionalId
          )
        : [];

      const academicoFormatado = ServicoHCurriculares.map(hc => ({
        _id: hc._id,
        nome: hc.nome || hc.titulo || "Curso não informado",
        instituicao: hc.instituicao || "Instituição não informada",
        periodo: hc.periodo || hc.duracao || "Período não informado"
      }));

      const profissionalFormatado = hprofissionais.map(hp => ({
        _id: hp._id,
        nome: hp.nome || hp.empresa || "Empresa não informada",
        imagem: hp.foto || hp.imagem || micheleto,
        alt: hp.nome || hp.empresa || "Empresa",
      }));

      setHistoricoAcademico(academicoFormatado);
      setHistoricoProfissional(profissionalFormatado);
    } catch (error) {
      console.error("Erro ao carregar históricos do profissional:", error);
      setHistoricoAcademico([]);
      setHistoricoProfissional([]);
    }
  };

  // Função para carregar dados do perfil - ATUALIZADA
  const carregarDadosPerfil = async () => {
    setCarregando(true);
    setErro(null);

    try {
      // CASO 1: Usuário logado acessando próprio perfil (sem ID na URL)
      if (!id && estaAutenticado() && usuario) {
        console.log("👤 Carregando perfil do usuário logado:", usuario._id);
        
        try {
          // Buscar perfil atualizado da API - USA A ROTA QUE EXISTE
          const resposta = await ServicoAutenticacao.buscarPerfilLogado(usuario._id);
          console.log("📨 Resposta da API do perfil:", resposta);
          
          if (resposta && (resposta.status === 'sucesso' && resposta.data || resposta._id)) {
            const dadosPerfilApi = resposta.data || resposta;
            const perfilFormatado = formatarDadosPerfil(dadosPerfilApi);
            setDadosPerfil(perfilFormatado);
            console.log("✅ Perfil carregado da API:", perfilFormatado);
            
            // Se for profissional, carregar históricos
            if (dadosPerfilApi.tipoPerfil === 'Profissional' || dadosPerfilApi.desc) {
              await carregarHistoricosProfissional(usuario._id);
            } else {
              setHistoricoAcademico([]);
              setHistoricoProfissional([]);
            }
          } else {
            throw new Error('Resposta da API não contém dados válidos');
          }
        } catch (erroApi) {
          console.error("❌ Erro ao buscar perfil da API:", erroApi);
          
          // FALLBACK: Usar dados do contexto de autenticação
          console.log("🔄 Usando dados do contexto de autenticação como fallback");
          const perfilFormatado = formatarDadosPerfil(usuario);
          setDadosPerfil(perfilFormatado);
          
          // Tentar carregar históricos mesmo no fallback
          if (usuario.tipoPerfil === 'Profissional' || usuario.desc) {
            await carregarHistoricosProfissional(usuario._id);
          } else {
            setHistoricoAcademico([]);
            setHistoricoProfissional([]);
          }
          
          setErro(`Dados carregados localmente. Erro da API: ${erroApi.message}`);
        }
      }
      // CASO 2: Perfil específico por ID (profissional ou usuário)
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
      
      // Mensagem de erro mais específica
      let mensagemErro = "Erro ao carregar dados do perfil. ";
      if (error.message.includes("Rota não encontrada")) {
        mensagemErro += "Serviço temporariamente indisponível.";
      } else if (error.message.includes("Network Error")) {
        mensagemErro += "Problema de conexão. Verifique sua internet.";
      } else if (error.message.includes("Serviço indisponível")) {
        mensagemErro += "Serviço temporariamente fora do ar.";
      } else {
        mensagemErro += "Tente novamente.";
      }
      
      setErro(mensagemErro);
      
      // Fallback para dados estáticos apenas se for um perfil público
      if (!id && !estaAutenticado()) {
        setDadosPerfil(dadosEstaticos);
        setHistoricoAcademico(dadosEstaticos.historicoAcademico);
        setHistoricoProfissional(dadosEstaticos.historicoProfissional);
      }
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

  // Função para verificar se é um perfil profissional - MELHORADA
  const isPerfilProfissional = () => {
    if (!dadosPerfil) return false;
    
    return id || 
           (dadosPerfil.tipoPerfil === 'Profissional') || 
           (dadosPerfil.descricao && dadosPerfil.descricao !== 'Descrição não informada') ||
           (historicoAcademico.length > 0 || historicoProfissional.length > 0) ||
           (dadosPerfil.avaliacao && dadosPerfil.avaliacao > 0);
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