import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Corpo from "@componentes/layout/corpo";
import InformacoesPerfil from "./componentes/InformacoesPerfil";
import ContatosPerfil from "./componentes/ContatosPerfil";
import HistoricoAcademicoPerfil from "./componentes/HistoricoAcademicoPerfil";
import HistoricoProfissionalPerfil from "./componentes/HistoricoProfissionalPerfil";
import { servicoProfissional, servicoHCurricular, servicoHProfissional, servicoAuth } from "@servicos/apiService";
import { useAuth } from "@/contextos/autenticacao";

import {
  Mail,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

import mariaSilva from "@recursos/mulher.png";
import micheleto from "@recursos/hospital.jpg";
import butantan from "@recursos/butantan.webp";
import portugues from "@recursos/portugues.jpg";

const Perfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, atualizarUsuario } = useAuth();
  
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
    descricao: "Enfermeira especializada em geriatria com 10 anos de experiência.",
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
      if (!id && isAuthenticated() && user) {
        try {
          // Buscar dados atualizados do servidor
          const resposta = await servicoAuth.buscarPerfilLogado(user._id);
          
          if (resposta && resposta.data) {
            const perfilFormatado = formatarDadosPerfil(resposta.data);
            setDadosPerfil(perfilFormatado);
            
            // Atualizar dados no contexto se necessário
            atualizarUsuario(resposta.data);
          } else {
            // Usar dados do contexto se a requisição falhar
            const perfilFormatado = formatarDadosPerfil(user);
            setDadosPerfil(perfilFormatado);
          }
          
          setHistoricoAcademico([]);
          setHistoricoProfissional([]);
          
        } catch (erro) {
          console.error('Erro ao buscar perfil do usuário logado:', erro);
          
          // Usar dados do contexto como fallback
          const perfilFormatado = formatarDadosPerfil(user);
          setDadosPerfil(perfilFormatado);
          setHistoricoAcademico([]);
          setHistoricoProfissional([]);
          
          setErro('Não foi possível carregar dados atualizados do servidor. Exibindo dados locais.');
        }
        
        setCarregando(false);
        return;
      }
      
      // Se não há ID e usuário não está logado, mostrar dados estáticos
      if (!id && !isAuthenticated()) {
        setDadosPerfil(dadosEstaticos);
        setHistoricoAcademico(dadosEstaticos.historicoAcademico);
        setHistoricoProfissional(dadosEstaticos.historicoProfissional);
        setCarregando(false);
        return;
      }

      // Se há ID na URL, buscar perfil específico
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
          console.error('Erro ao carregar dados do perfil:', error);
          setErro('Erro ao carregar dados do perfil. Tente novamente.');
          
          // Usar dados estáticos como fallback
          setDadosPerfil(dadosEstaticos);
          setHistoricoAcademico(dadosEstaticos.historicoAcademico);
          setHistoricoProfissional(dadosEstaticos.historicoProfissional);
        }
      }
      
      setCarregando(false);
    };

    carregarDadosPerfil();
  }, [id, user, isAuthenticated, atualizarUsuario]);

  // Função para formatar dados do perfil de forma consistente
  const formatarDadosPerfil = (dadosUsuario) => {
    if (!dadosUsuario) return dadosEstaticos;

    return {
      nome: dadosUsuario.nome || "Nome não informado",
      foto: dadosUsuario.foto || dadosUsuario.picture || mariaSilva,
      localizacao: dadosUsuario.localizacao?.nome || "Localização não informada",
      descricao: dadosUsuario.desc || "Descrição não informada",
      avaliacao: dadosUsuario.avaliacao || 0,
      redesSociais: [
        { icone: Mail, usuario: dadosUsuario.email || "" },
        { icone: Facebook, usuario: dadosUsuario.face || "" },
        { icone: Instagram, usuario: dadosUsuario.instagram || "" },
        { icone: Linkedin, usuario: dadosUsuario.linkedin || "" },
      ].filter(rede => rede.usuario !== ""),
    };
  };

  // Função para verificar se é o perfil do próprio usuário
  const isPerfilProprio = () => {
    if (!isAuthenticated() || !user) return false;
    if (id) return user._id === id;
    return true; // Se não há ID na URL, é sempre o perfil próprio
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
        <h1 className="titulo">{dadosPerfil.nome}</h1>
        
        {erro && (
          <div className="mensagemAviso" style={{ 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            <p>⚠️ {erro}</p>
          </div>
        )}

        <InformacoesPerfil 
          dadosPerfil={dadosPerfil}
          isAuthenticated={isAuthenticated}
          user={user}
          id={id}
          modoEdicao={modoEdicao}
          setModoEdicao={setModoEdicao}
          isPerfilProprio={isPerfilProprio()}
        />

        <ContatosPerfil redesSociais={dadosPerfil.redesSociais} />

        <div className="flexContainer gapGrande">
          <HistoricoAcademicoPerfil 
            historicoAcademico={historicoAcademico} 
            isPerfilProprio={isPerfilProprio()}
          />
          <HistoricoProfissionalPerfil 
            historicoProfissional={historicoProfissional}
            nomePerfil={dadosPerfil.nome}
            isPerfilProprio={isPerfilProprio()}
          />
        </div>
      </div>
    </Corpo>
  );
};

export default Perfil;

