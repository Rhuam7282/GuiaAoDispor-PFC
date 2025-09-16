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
      // Se não há ID na URL e o usuário não está logado, redirecionar para cadastro
      if (!id && !isAuthenticated()) {
        navigate("/cadastro");
        return;
      }

      setCarregando(true);
      setErro(null);

      try {
        let perfilId = id;
        let tipoUsuarioResposta;
        
        // Se não há ID na URL mas o usuário está logado, usar ID do usuário logado
        if (!id && isAuthenticated() && user) {
          perfilId = user._id;
          tipoUsuarioResposta = await servicoAuth.verificarTipo(user._id);
        } else if (id) {
          // Se há ID na URL, verificar tipo do usuário
          tipoUsuarioResposta = await servicoAuth.verificarTipo(id);
        } else {
          throw new Error('Usuário não autenticado');
        }
        
        setTipoUsuario(tipoUsuarioResposta.data.tipo);

        // Buscar dados do perfil
        const perfilResposta = tipoUsuarioResposta.data.tipo === 'profissional' 
          ? await servicoProfissional.buscarPorId(perfilId)
          : await servicoAuth.buscarPerfilLogado(perfilId);

        if (!perfilResposta || !perfilResposta.data) {
          throw new Error('Perfil não encontrado');
        }

        const perfil = perfilResposta.data;
        const perfilFormatado = formatarDadosPerfil(perfil);
        setDadosPerfil(perfilFormatado);

        // Se for perfil profissional, buscar históricos
        if (tipoUsuarioResposta.data.tipo === 'profissional') {
          try {
            const [hcurricularResposta, hprofissionalResposta] = await Promise.all([
              servicoHCurricular.buscarPorProfissional(perfilId),
              servicoHProfissional.buscarPorProfissional(perfilId)
            ]);

            const hcurriculares = hcurricularResposta.data || [];
            const hprofissionais = hprofissionalResposta.data || [];

            const academicoFormatado = hcurriculares.map(hc => ({
              _id: hc._id,
              nome: hc.nome || "",
              instituicao: hc.instituicao || "",
              periodo: hc.periodo || ""
            }));

            const profissionalFormatado = hprofissionais.map(hp => ({
              _id: hp._id,
              nome: hp.nome || hp.empresa || "",
              imagem: hp.imagem || null
            }));

            setHistoricoAcademico(academicoFormatado);
            setHistoricoProfissional(profissionalFormatado);
          } catch (error) {
            console.error('Erro ao carregar históricos:', error);
          }
        }
        
      } catch (erro) {
        console.error('Erro ao buscar perfil:', erro);
        setErro('Perfil não encontrado.');
        
        // Redirecionar para página inicial após 2 segundos
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosPerfil();
  }, [id, user, isAuthenticated, navigate]);

  const formatarDadosPerfil = (dadosUsuario) => {
    if (!dadosUsuario) return null;

    return {
      nome: dadosUsuario.nome || "Usuário",
      foto: dadosUsuario.foto || dadosUsuario.picture || null,
      localizacao: dadosUsuario.localizacao?.nome || "Não informado",
      descricao: dadosUsuario.desc || dadosUsuario.descricao || "Não informado",
      avaliacao: dadosUsuario.avaliacao || 0,
      email: dadosUsuario.email || "Não informado",
      facebook: dadosUsuario.face || dadosUsuario.facebook || "",
      instagram: dadosUsuario.inst || dadosUsuario.instagram || "",
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
            <div className="animacaoCarregamento"></div>
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
          tipoUsuario={tipoUsuario}
        />

        {isPerfilProfissional() && (
          <div className="flexContainer gapGrande">
            <HistoricoAcademicoPerfil 
              historicoAcademico={historicoAcademico} 
              modoEdicao={modoEdicao}
              setHistorico={setHistoricoAcademico}
              idProfissional={id || (user ? user._id : null)}
            />
            <HistoricoProfissionalPerfil 
              historicoProfissional={historicoProfissional}
              nomePerfil={dadosPerfil.nome}
              modoEdicao={modoEdicao}
              setHistorico={setHistoricoProfissional}
              idProfissional={id || (user ? user._id : null)}
            />
          </div>
        )}
      </div>
    </Corpo>
  );
};

export default Perfil;