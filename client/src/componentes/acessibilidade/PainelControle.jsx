// src/componentes/acessibilidade/PainelControle.jsx
import React, { useState, useEffect } from 'react';
import { PersonStanding, X, Type, AlignJustify, MoreHorizontal, Eye, Contrast, Moon, Image, Heading, LinkIcon, BookOpen, Pause, MousePointer } from 'lucide-react';
import { useConfiguracaoAcessibilidade } from '/UseConfiguracaoAcessibilidade.jsx';
import { useGuiasLeitura } from 'Ganchos/UseGuiasLeitura';
// import VLibrasWidgetHibrido from 'VLibrasWidget/VLibrasWidgetHibrido';
import SecaoTexto from 'SecaoTexto/SecaoTexto';
import SecaoVisao from 'SecaoVisao/SecaoVisao';
import SecaoConteudo from 'SecaoConteudo/SecaoConteudo';
import SecaoAnimacoesCursor from 'SecaoAnimacoesCursor/SecaoAnimacoesCursor';
import MaskLeitura from 'MascaraLeitura/MascaraLeitura';
import GuiaLeitura from 'GuiaLeitura/GuiaLeitura';

import 'PainelControle.css';

const PainelControle = () => {
  const [estaAberto, setEstaAberto] = useState(false);

  const [maskLeituraAtiva, setMaskLeituraAtiva] = useState(false);
  const [guiaLeituraAtiva, setGuiaLeituraAtiva] = useState(false);

  const { configuracoes, atualizarConfiguracao } = useConfiguracaoAcessibilidade();
  useGuiasLeitura(configuracoes.guiaLeitura);

  useEffect(() => {
    const aplicarEstilosTexto = () => {
      let estiloDinamico = document.getElementById('estiloAcessibilidadeTexto');
      const conteudoEstilo = `
      :root {
        --fatorEscala: ${configuracoes.tamanhoFonte / 100};
        --espacamentoLetras: ${configuracoes.espacamentoLetras}px;
        --alturaLinha: ${configuracoes.alturaLinha};
      }
      body:not(.painelAcessibilidade):not(.painelAcessibilidade *) {
        font-size: calc(16px * var(--fatorEscala)) !important; 
        letter-spacing: var(--espacamentoLetras) !important;
        line-height: var(--alturaLinha) !important;
      }
    `;

      if (!estiloDinamico) {
        const style = document.createElement('style');
        style.id = 'estiloAcessibilidadeTexto';
        document.head.appendChild(style);
        estiloDinamico = style;
      }
      estiloDinamico.textContent = conteudoEstilo;
    };

    aplicarEstilosTexto();
  }, [configuracoes.tamanhoFonte, configuracoes.espacamentoLetras, configuracoes.alturaLinha]);

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.remove('contrasteLeve', 'contrasteIntenso');
    switch (configuracoes.modoContraste) {
      case 1: raiz.classList.add('contrasteLeve'); break;
      case 2: raiz.classList.add('contrasteIntenso'); break;
      default: break;
    }
  }, [configuracoes.modoContraste]);

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.toggle('temaEscuro', configuracoes.modoEscuro === 1);
  }, [configuracoes.modoEscuro]);

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.toggle('removerImagens', configuracoes.removerImagens);
    raiz.classList.toggle('removerCabecalhos', configuracoes.removerCabecalhos);
    raiz.classList.toggle('destacarLinks', configuracoes.destacarLinks);
    raiz.classList.toggle('pausarAnimacoes', configuracoes.pausarAnimacoes);
    raiz.classList.toggle('cursorGrande', configuracoes.cursorGrande);

    raiz.classList.remove('daltonicoProtanopia', 'daltonicoDeuteranopia', 'daltonicoTritanopia');
    switch (configuracoes.modoDaltonico) {
      case 1: raiz.classList.add('daltonicoProtanopia'); break;
      case 2: raiz.classList.add('daltonicoDeuteranopia'); break;
      case 3: raiz.classList.add('daltonicoTritanopia'); break;
      default: break;
    }
  }, [configuracoes.removerImagens, configuracoes.removerCabecalhos, configuracoes.destacarLinks,
  configuracoes.modoDaltonico, configuracoes.pausarAnimacoes, configuracoes.cursorGrande]);

  useEffect(() => {
    const manipularTeclaPressionada = (evento) => {
      if (evento.altKey && evento.key === 'a') {
        evento.preventDefault();
        setEstaAberto(prev => !prev);
      }
      if (evento.altKey && evento.key === 'c') {
        evento.preventDefault();
        atualizarConfiguracao('modoContraste', (configuracoes.modoContraste + 1) % 3);
      }
      if (evento.altKey && evento.key === 'd') {
        evento.preventDefault();
        atualizarConfiguracao('modoEscuro', (configuracoes.modoEscuro + 1) % 2);
      }
      if (evento.altKey && evento.key === '+') {
        evento.preventDefault();
        atualizarConfiguracao('tamanhoFonte', Math.min(configuracoes.tamanhoFonte + 10, 150));
      }
      if (evento.altKey && evento.key === '-') {
        evento.preventDefault();
        atualizarConfiguracao('tamanhoFonte', Math.max(configuracoes.tamanhoFonte - 10, 80));
      }
    };

    document.addEventListener('keydown', manipularTeclaPressionada);
    return () => document.removeEventListener('keydown', manipularTeclaPressionada);
  }, [configuracoes, atualizarConfiguracao]);

  const alternarPainel = () => setEstaAberto(!estaAberto);

  return (
    <div className="controlesAcessibilidade">
      <button
        className="botaoAlternarAcessibilidade"
        onClick={alternarPainel}
        aria-label={estaAberto ? "Fechar controles de acessibilidade" : "Abrir controles de acessibilidade (Alt + A)"}
        title={estaAberto ? "Fechar Controles" : "Controles de Acessibilidade (Alt + A)"}
      >
        {estaAberto ? <X size={24} /> : <PersonStanding size={24} />}
      </button>

      {estaAberto && (
        <div className="painelAcessibilidade" role="dialog" aria-label="Painel de controles de acessibilidade">
          <div className="cabecalhoAcessibilidade">
            <div className="tituloHeader">
              <PersonStanding size={16} />
              <h3>Acessibilidade</h3>
            </div>
          </div>


          <div className="conteudo-painel">
            {/* <VLibrasWidgetHibrido /> */}

            <div className="grupo-opcoes">
              <h4 className="titulo-grupo">Texto</h4>
              <SecaoTexto
                configuracoes={configuracoes}
                atualizarConfiguracao={atualizarConfiguracao}
              />
            </div>

            <div className="grupo-opcoes">
              <h4 className="titulo-grupo">Visão</h4>
              <SecaoVisao
                configuracoes={configuracoes}
                atualizarConfiguracao={atualizarConfiguracao}
              />
            </div>

            <div className="grupo-opcoes">
              <h4 className="titulo-grupo">Conteúdo</h4>
              <SecaoConteudo
                configuracoes={configuracoes}
                atualizarConfiguracao={atualizarConfiguracao}
              />
            </div>

            <div className="grupo-opcoes">
              <h4 className="titulo-grupo">Animação & Cursor</h4>
              <SecaoAnimacoesCursor
                configuracoes={configuracoes}
                atualizarConfiguracao={atualizarConfiguracao}
              />
            </div>

            <div className="grupo-opcoes">
              <h4 className="titulo-grupo">Ferramentas de Leitura</h4>
              <div className="secao">
                <h4 className="tituloSecao">
                  <Eye size={16} /> Máscara de Leitura
                </h4>
                <div className="botoesControle">
                  <button
                    onClick={() => setMaskLeituraAtiva(!maskLeituraAtiva)}
                    className={maskLeituraAtiva ? 'ativo' : ''}
                  >
                    {maskLeituraAtiva ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>

              <div className="secao">
                <h4 className="tituloSecao">
                  <AlignJustify size={16} /> Guia de Leitura
                </h4>
                <div className="botoesControle">
                  <button
                    onClick={() => setGuiaLeituraAtiva(!guiaLeituraAtiva)}
                    className={guiaLeituraAtiva ? 'ativo' : ''}
                  >
                    {guiaLeituraAtiva ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            </div>

            <div className="secao-redefinir">
              <button
                className="botao-redefinir-tudo"
                onClick={() => {
                  atualizarConfiguracao('tamanhoFonte', 100);
                  atualizarConfiguracao('espacamentoLetras', 0);
                  atualizarConfiguracao('alturaLinha', 1.5);
                  atualizarConfiguracao('modoContraste', 0);
                  atualizarConfiguracao('modoEscuro', 0);
                  atualizarConfiguracao('modoDaltonico', 0);
                  atualizarConfiguracao('removerImagens', false);
                  atualizarConfiguracao('removerCabecalhos', false);
                  atualizarConfiguracao('destacarLinks', 0);
                  atualizarConfiguracao('pausarAnimacoes', false);
                  atualizarConfiguracao('cursorGrande', false);
                  setMaskLeituraAtiva(false);
                  setGuiaLeituraAtiva(false);
                }}
              >
                Redefinir Tudo
              </button>
            </div>
          </div>

          <MaskLeitura ativo={maskLeituraAtiva} />
          <GuiaLeitura ativo={guiaLeituraAtiva} />
        </div>
      )}
    </div>
  );
}

export default PainelControle;
