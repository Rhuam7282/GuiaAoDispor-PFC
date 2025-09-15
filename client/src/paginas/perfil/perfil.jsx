import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Corpo from "@componentes/Layout/Corpo";
import InformacoesPerfil from "./componentes/InformacoesPerfil";
import HistoricoAcademicoPerfil from "./componentes/HistoricoAcademicoPerfil";
import HistoricoProfissionalPerfil from "./componentes/HistoricoProfissionalPerfil";
import { servicoProfissional, servicoHCurricular, servicoHProfissional, servicoAuth } from "@servicos/api";
import { useAuth } from "@/contextos/autenticacao";
import "./perfil.css";

import {
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  LogOut,
} from "lucide-react";

const Perfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [dadosPerfil, setDadosPerfil] = useState(null);
  const [historicoAcademico, setHistoricoAcademico] = useState([]);
  const [historicoProfissional, setHistoricoProfissional] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/cadastro");
  };

  useEffect(() => {
    const carregarDadosPerfil = async () => {
      setCarregando(true);
      setErro(null);

      // Se não há ID na URL e o usuário não está logado, redirecionar para cadastro
      if (!id && !isAuthenticated()) {
        navigate("/cadastro");
        return;
      }

      // Se não há ID na URL mas o usuário está logado, carregar perfil do usuário logado
      if (!id && isAuthenticated() && user) {
        try {
          const tipoResposta = await servicoAuth.verificarTipo(user._id);
          setTipoUsuario(tipoResposta.data.tipo);

          const resposta = await servicoAuth.buscarPerfilLogado(user._id);
          
          if (resposta && resposta.data) {
            const perfilFormatado = formatarDadosPerfil(resposta.data);
            setDadosPerfil(perfilFormatado);
          }

          if (tipoResposta.data.tipo === 'profissional') {
            try {
              const [hcurricularResposta, hprofissionalResposta] = await Promise.all([
                servicoHCurricular.buscarPorProfissional(user._id),
                servicoHProfissional.buscarPorProfissional(user._id)
              ]);

              const hcurriculares = hcurricularResposta.data || [];
              const hprofissionais = hprofissionalResposta.data || [];

              const academicoFormatado = hcurriculares.map(hc => ({
                nome: hc.nome || "Curso não informado",
                instituicao: hc.instituicao || "Instituição não informada",
                periodo: hc.periodo || "Período não informado"
              }));

              const profissionalFormatado = hprofissionais.map(hp => ({
                nome: hp.empresa || "Empresa não informada",
                imagem: hp.imagem || null,
                alt: hp.empresa || "Empresa",
              }));

              setHistoricoAcademico(academicoFormatado);
              setHistoricoProfissional(profissionalFormatado);
            } catch (error) {
              console.error('Erro ao carregar históricos:', error);
            }
          }
          
        } catch (erro) {
          console.error('Erro ao buscar perfil:', erro);
          setErro(`Erro ao carregar perfil: ${erro.message}`);
        } finally {
          setCarregando(false);
        }
        return;
      }

      // Se há ID na URL, buscar perfil específico
      if (id) {
        try {
          const tipoResposta = await servicoAuth.verificarTipo(id);
          setTipoUsuario(tipoResposta.data.tipo);

          const [perfilResposta, hcurricularResposta, hprofissionalResposta] = await Promise.all([
            tipoResposta.data.tipo === 'profissional' 
              ? servicoProfissional.buscarPorId(id)
              : servicoAuth.buscarPerfilLogado(id),
            servicoHCurricular.buscarPorProfissional(id),
            servicoHProfissional.buscarPorProfissional(id)
          ]);

          const perfil = perfilResposta.data;
          const hcurriculares = hcurricularResposta.data || [];
          const hprofissionais = hprofissionalResposta.data || [];

          const perfilFormatado = formatarDadosPerfil(perfil);
          setDadosPerfil(perfilFormatado);

          if (tipoResposta.data.tipo === 'profissional') {
            const academicoFormatado = hcurriculares.map(hc => ({
              nome: hc.nome || "Curso não informado",
              instituicao: hc.instituicao || "Instituição não informada",
              periodo: hc.periodo || "Período não informado"
            }));

            const profissionalFormatado = hprofissionais.map(hp => ({
              nome: hp.empresa || "Empresa não informada",
              imagem: hp.imagem || null,
              alt: hp.empresa || "Empresa",
            }));

            setHistoricoAcademico(academicoFormatado);
            setHistoricoProfissional(profissionalFormatado);
          }

        } catch (error) {
          console.error('Erro ao carregar dados do perfil:', error);
          setErro('Perfil não encontrado.');
          // Redirecionar para página inicial após 2 segundos
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } finally {
          setCarregando(false);
        }
      }
    };

    carregarDadosPerfil();
  }, [id, user, isAuthenticated, navigate]);

  const formatarDadosPerfil = (dadosUsuario) => {
    if (!dadosUsuario) return null;

    return {
      nome: dadosUsuario.nome || "Nome não informado",
      foto: dadosUsuario.foto || dadosUsuario.picture || null,
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

  const isPerfilProprio = () => {
    if (!isAuthenticated() || !user) return false;
    if (id) return user._id === id;
    return true;
  };

  const isPerfilProfissional = () => {
    return tipoUsuario === 'profissional';
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
            {erro === 'Perfil não encontrado.' && (
              <p>Redirecionando para a página inicial...</p>
            )}
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
            {isAuthenticated() && isPerfilProprio() && (
              <button 
                className="botao botaoSecundario"
                onClick={() => setModoEdicao(!modoEdicao)}
              >
                {modoEdicao ? 'Cancelar Edição' : 'Editar Perfil'}
              </button>
            )}
            {isAuthenticated() && (
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
          isAuthenticated={isAuthenticated}
          user={user}
          id={id || (user ? user._id : null)}
          modoEdicao={modoEdicao}
          setModoEdicao={setModoEdicao}
          isPerfilProprio={isPerfilProprio()}
          tipoUsuario={tipoUsuario}
        />

        {isPerfilProfissional() && (
          <div className="flexContainer gapGrande">
            {historicoAcademico.length > 0 && (
              <HistoricoAcademicoPerfil 
                historicoAcademico={historicoAcademico} 
                isPerfilProprio={isPerfilProprio()}
                modoEdicao={modoEdicao}
              />
            )}
            {historicoProfissional.length > 0 && (
              <HistoricoProfissionalPerfil 
                historicoProfissional={historicoProfissional}
                nomePerfil={dadosPerfil.nome}
                isPerfilProprio={isPerfilProprio()}
                modoEdicao={modoEdicao}
              />
            )}
          </div>
        )}
      </div>
    </Corpo>
  );
};

export default Perfil;