// src/componentes/acessibilidade/PainelControle.jsx
import { useState, useEffect } from 'react';
import { PersonStanding, X } from 'lucide-react';
import { useConfiguracaoAcessibilidade } from './ganchos/useConfiguracaoAcessibilidade';
import { useGuiasLeitura } from './ganchos/useGuiasLeitura';
import VLibrasWidgetHibrido from './VLibrasWidget/VLibrasWidgetHibrido';
import SecaoTexto from './SecaoTexto/SecaoTexto';
import SecaoVisao from './SecaoVisao/SecaoVisao';
import SecaoDaltonismo from './SecaoDaltonismo/SecaoDaltonismo';
import SecaoConteudo from './SecaoConteudo/SecaoConteudo';
import SecaoAnimacoesCursor from './SecaoAnimacoesCursor/SecaoAnimacoesCursor';
import './PainelControle.css';

const PainelControle = () => {
  const [estaAberto, setEstaAberto] = useState(false);
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
          font-size: calc(16px * var(--fatorEscala)); 
        }
        body {
          letter-spacing: var(--espacamentoLetras);
          line-height: var(--alturaLinha);
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
        aria-label="Abrir controles de acessibilidade (Alt + A)"
        title="Controles de Acessibilidade (Alt + A)"
      >
        <PersonStanding size={24} />
      </button>

      {estaAberto && (
        <div className="painelAcessibilidade" role="dialog" aria-label="Painel de controles de acessibilidade">
          <div className="cabecalhoAcessibilidade">
            <div className="tituloHeader">
              <PersonStanding size={20} />
              <h3>Acessibilidade</h3>
            </div>
            <button
              className="botaoFechar"
              onClick={alternarPainel}
              aria-label="Fechar controles"
            >
              <X size={18} />
            </button>
          </div>

          <VLibrasWidgetHibrido />
          <SecaoTexto 
            configuracoes={configuracoes}
            atualizarConfiguracao={atualizarConfiguracao}
          />
          <SecaoVisao 
            configuracoes={configuracoes}
            atualizarConfiguracao={atualizarConfiguracao}
          />
          <SecaoDaltonismo 
            configuracoes={configuracoes}
            atualizarConfiguracao={atualizarConfiguracao}
          />
          <SecaoConteudo 
            configuracoes={configuracoes}
            atualizarConfiguracao={atualizarConfiguracao}
          />
          <SecaoAnimacoesCursor 
            configuracoes={configuracoes}
            atualizarConfiguracao={atualizarConfiguracao}
          />
        </div>
      )}
    </div>
  );
};

export default PainelControle;