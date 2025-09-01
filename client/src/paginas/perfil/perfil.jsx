import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Corpo from "@componentes/layout/corpo";
import InformacoesPerfil from "./componentes/InformacoesPerfil";
import ContatosPerfil from "./componentes/ContatosPerfil";
import HistoricoAcademicoPerfil from "./componentes/HistoricoAcademicoPerfil";
import HistoricoProfissionalPerfil from "./componentes/HistoricoProfissionalPerfil";
import { servicoProfissional, servicoHCurricular, servicoHProfissional, servicoAuth } from "@servicos/apiService";
import { useAuth } from "@/contextos/AuthContext";

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
  const { user, isAuthenticated } = useAuth();
  
  const [dadosPerfil, setDadosPerfil] = useState(null);
  const [historicoAcademico, setHistoricoAcademico] = useState([]);
  const [historicoProfissional, setHistoricoProfissional] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

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
      if (!id && isAuthenticated() && user) {
        try {
          const resposta = await servicoAuth.buscarPerfilLogado(user._id);
          setDadosPerfil(resposta.data);
          setCarregando(false);
          return;
        } catch (erro) {
          console.error('Erro ao buscar perfil do usuário logado:', erro);
          setDadosPerfil(dadosEstaticos);
          setHistoricoAcademico(dadosEstaticos.historicoAcademico);
          setHistoricoProfissional(dadosEstaticos.historicoProfissional);
          setCarregando(false);
          return;
        }
      }
      
      if (!id && !isAuthenticated()) {
        setDadosPerfil(dadosEstaticos);
        setHistoricoAcademico(dadosEstaticos.historicoAcademico);
        setHistoricoProfissional(dadosEstaticos.historicoProfissional);
        setCarregando(false);
        return;
      }

      try {
        const [perfilResposta, hcurricularResposta, hprofissionalResposta] = await Promise.all([
          servicoProfissional.buscarPorId(id),
          servicoHCurricular.buscarPorProfissional(id),
          servicoHProfissional.buscarPorProfissional(id)
        ]);

        const perfil = perfilResposta.data;
        const hcurriculares = hcurricularResposta.data || [];
        const hprofissionais = hprofissionalResposta.data || [];

        const perfilFormatado = {
          nome: perfil.nome || "Nome não informado",
          foto: perfil.foto || mariaSilva,
          localizacao: perfil.localizacao?.nome || "Localização não informada",
          descricao: perfil.desc || "Descrição não informada",
          avaliacao: perfil.avaliacao || 0,
          redesSociais: [
            { icone: Mail, usuario: perfil.email || "Email não informado" },
            { icone: Facebook, usuario: perfil.face || "Facebook não informado" },
            { icone: Instagram, usuario: perfil.instagram || "Instagram não informado" },
            { icone: Linkedin, usuario: perfil.linkedin || "LinkedIn não informado" },
          ].filter(rede => rede.usuario && rede.usuario !== "não informado")
        };

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

        setDadosPerfil(perfilFormatado);
        setHistoricoAcademico(academicoFormatado);
        setHistoricoProfissional(profissionalFormatado);

      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        setErro('Erro ao carregar dados do perfil. Tente novamente.');
        setDadosPerfil(dadosEstaticos);
        setHistoricoAcademico(dadosEstaticos.historicoAcademico);
        setHistoricoProfissional(dadosEstaticos.historicoProfissional);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosPerfil();
  }, [id, user, isAuthenticated]);

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
          <div className="mensagemAviso">
            <p>⚠️ {erro} Exibindo dados de exemplo.</p>
          </div>
        )}

        <InformacoesPerfil 
          dadosPerfil={dadosPerfil}
          isAuthenticated={isAuthenticated}
          user={user}
          id={id}
          modoEdicao={modoEdicao}
          setModoEdicao={setModoEdicao}
        />

        <ContatosPerfil redesSociais={dadosPerfil.redesSociais} />

        <div className="flexContainer gapGrande">
          <HistoricoAcademicoPerfil historicoAcademico={historicoAcademico} />
          <HistoricoProfissionalPerfil 
            historicoProfissional={historicoProfissional}
            nomePerfil={dadosPerfil.nome}
          />
        </div>
      </div>
    </Corpo>
  );
};

export default Perfil;

