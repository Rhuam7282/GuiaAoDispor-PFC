import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Corpo from "@componentes/layout/corpo";
import { servicoProfissional, servicoHCurricular, servicoHProfissional } from "@servicos/apiService";

import {
  Star,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import PainelControle from "@componentes/acessibilidade/controles";

// Imagens padrão para fallback
import mariaSilva from "@recursos/mulher.png";
import micheleto from "@recursos/hospital.jpg";
import butantan from "@recursos/butantan.webp";
import portugues from "@recursos/portugues.jpg";

const Perfil = () => {
  const { id } = useParams();
  const [dadosPerfil, setDadosPerfil] = useState(null);
  const [historicoAcademico, setHistoricoAcademico] = useState([]);
  const [historicoProfissional, setHistoricoProfissional] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Dados estáticos como fallback quando não há ID
  const dadosEstaticos = {
    nome: "Maria Silva",
    foto: mariaSilva,
    localizacao: "Assis Chateaibriand, PR",
    descricao:
      "Enfermeira especializada em geriatria com 10 anos de experiência.",
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
      // Se não há ID, usar dados estáticos
      if (!id) {
        setDadosPerfil(dadosEstaticos);
        setHistoricoAcademico(dadosEstaticos.historicoAcademico);
        setHistoricoProfissional(dadosEstaticos.historicoProfissional);
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro(null);

        // Buscar dados do profissional
        const respostaProfissional = await servicoProfissional.buscarPorId(id);
        const profissional = respostaProfissional.data;

        // Buscar histórico curricular
        const respostaHCurricular = await servicoHCurricular.listarTodos();
        const hcurriculares = respostaHCurricular.data.filter(
          hc => hc.profissional && hc.profissional._id === id
        );

        // Buscar histórico profissional
        const respostaHProfissional = await servicoHProfissional.listarTodos();
        const hprofissionais = respostaHProfissional.data.filter(
          hp => hp.profissional && hp.profissional._id === id
        );

        // Montar dados do perfil
        const perfilFormatado = {
          nome: profissional.nome,
          foto: profissional.foto || mariaSilva,
          localizacao: profissional.localizacao ? 
            `${profissional.localizacao.cidade || ''}, ${profissional.localizacao.estado || ''}`.trim() :
            "Localização não informada",
          descricao: profissional.desc || "Descrição não informada",
          avaliacao: profissional.nota || 0,
          redesSociais: [
            { icone: Mail, usuario: profissional.email || "Email não informado" },
            { icone: Facebook, usuario: profissional.face || "Facebook não informado" },
            { icone: Instagram, usuario: profissional.instagram || "Instagram não informado" },
            { icone: Linkedin, usuario: profissional.linkedin || "LinkedIn não informado" },
          ],
        };

        // Formatar histórico acadêmico
        const academicoFormatado = hcurriculares.map(hc => ({
          nome: hc.curso || "Curso não informado",
          instituicao: hc.inst || "Instituição não informada",
          periodo: hc.periodo || "Período não informado",
        }));

        // Formatar histórico profissional
        const profissionalFormatado = hprofissionais.map(hp => ({
          nome: hp.empresa || "Empresa não informada",
          imagem: hp.imagem || micheleto, // Usar imagem padrão
          alt: hp.empresa || "Empresa",
        }));

        setDadosPerfil(perfilFormatado);
        setHistoricoAcademico(academicoFormatado);
        setHistoricoProfissional(profissionalFormatado);

      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        setErro('Erro ao carregar dados do perfil. Tente novamente.');
        // Em caso de erro, usar dados estáticos
        setDadosPerfil(dadosEstaticos);
        setHistoricoAcademico(dadosEstaticos.historicoAcademico);
        setHistoricoProfissional(dadosEstaticos.historicoProfissional);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosPerfil();
  }, [id]);

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

        <div className="gridContainer gridTresColunas gapGrande margemInferiorGrande">
          <div className="alinharCentro">
            <img
              className="imagemPerfil imagemPerfilGrande"
              src={dadosPerfil.foto}
              alt={`${dadosPerfil.nome} - ${dadosPerfil.descricao} em ${dadosPerfil.localizacao}`}
            />
          </div>
          <div className="cartaoDestaque fundoMarromDestaqueTransparente textoEsquerda">
            <p>{dadosPerfil.descricao}</p>
            <div className="flexLinha gapPequeno">
              <div className="listaIcones">
                <MapPin size={20} />
                <span>{dadosPerfil.localizacao}</span>
              </div>

              <div className="listaIcones">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={
                      i < Math.floor(dadosPerfil.avaliacao) ? "var(--corMarromEscuro)" : "none"
                    }
                    stroke="var(--corMarromEscuro)"
                  />
                ))}
                <span className="textoNegrito">{dadosPerfil.avaliacao}</span>
              </div>
            </div>
          </div>

          {/* Coluna direita com contatos */}
          <div>
            <h3>Contatos</h3>
            <div className="listaIcones vertical">
              {dadosPerfil.redesSociais.map((rede, index) => {
                const Icone = rede.icone;
                return (
                  <div key={index} className="listaIcones">
                    <Icone size={18} />
                    <span>{rede.usuario}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Histórico Acadêmico */}
        <div className="margemInferiorGrande">
          <h2 className="bordaInferiorSubtle">Histórico Acadêmico</h2>
          <div className="gridContainer gridColunasAuto gapMedio">
            {historicoAcademico.length > 0 ? (
              historicoAcademico.map((item, index) => (
                <div key={index} className="cartao fundoAzulDestaque">
                  <h3>{item.nome}</h3>
                  <p>{item.instituicao}</p>
                  <p className="textoMarromEscuro">{item.periodo}</p>
                </div>
              ))
            ) : (
              <div className="cartao fundoAzulDestaque">
                <p>Nenhum histórico acadêmico cadastrado.</p>
              </div>
            )}
          </div>
        </div>

        {/* Histórico Profissional */}
        <div className="margemInferiorGrande">
          <h2 className="bordaInferiorSubtle">Histórico Profissional</h2>
          <div className="gridContainer gridColunasAuto gapMedio">
            {historicoProfissional.length > 0 ? (
              historicoProfissional.map((item, index) => (
                <div key={index} className="cartao fundoAzulDestaque flexColuna gapPequeno alinharEsticar">
                  <div className="containerImagem">
                    <img
                      className="imagemAspecto"
                      src={item.imagem}
                      alt={`${item.nome} - Local de trabalho de ${dadosPerfil.nome}`}
                    />
                  </div>
                  <div className="margemSuperiorZero">
                    <h3>{item.nome}</h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="cartao fundoAzulDestaque">
                <p>Nenhum histórico profissional cadastrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Corpo>
  );
};

export default Perfil;