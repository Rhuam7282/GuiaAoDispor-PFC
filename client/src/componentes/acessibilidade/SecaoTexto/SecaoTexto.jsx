// src/componentes/acessibilidade/./SecaoTexto/SecaoTexto.jsx
import { Type, AlignJustify, MoreHorizontal } from 'lucide-react';

const SecaoTexto = ({ configuracoes, atualizarConfiguracao }) => {
  const aumentarTamanhoFonte = () => {
    atualizarConfiguracao('tamanhoFonte', Math.min(configuracoes.tamanhoFonte + 5, 130));
  };

  const diminuirTamanhoFonte = () => {
    atualizarConfiguracao('tamanhoFonte', Math.max(configuracoes.tamanhoFonte - 5, 80));
  };

  const redefinirTamanhoFonte = () => {
    atualizarConfiguracao('tamanhoFonte', 100);
  };

  const aumentarEspacamentoLetras = () => {
    atualizarConfiguracao('espacamentoLetras', Math.min(configuracoes.espacamentoLetras + 0.1, 0.5));
  };

  const diminuirEspacamentoLetras = () => {
    atualizarConfiguracao('espacamentoLetras', Math.max(configuracoes.espacamentoLetras - 0.1, -0.5));
  };

  const redefinirEspacamentoLetras = () => {
    atualizarConfiguracao('espacamentoLetras', 0);
  };

  const aumentarAlturaLinha = () => {
    atualizarConfiguracao('alturaLinha', Math.min(configuracoes.alturaLinha + 0.1, 2.0));
  };

  const diminuirAlturaLinha = () => {
    atualizarConfiguracao('alturaLinha', Math.max(configuracoes.alturaLinha - 0.1, 1.0));
  };

  const redefinirAlturaLinha = () => {
    atualizarConfiguracao('alturaLinha', 1.5);
  };

  return (
    <>
      <div className="secao">
        <h4 className="tituloSecao">
          <Type size={16} /> Tamanho do Texto
        </h4>
        <div className="botoesControle">
          <button onClick={diminuirTamanhoFonte} aria-label="Diminuir tamanho da fonte">-</button>
          <span>{configuracoes.tamanhoFonte}%</span>
          <button onClick={aumentarTamanhoFonte} aria-label="Aumentar tamanho da fonte">+</button>
          <button onClick={redefinirTamanhoFonte} aria-label="Redefinir tamanho da fonte">Redefinir</button>
        </div>
      </div>

      <div className="secao">
        <h4 className="tituloSecao">
          <AlignJustify size={16} /> Espaçamento de Letras
        </h4>
        <div className="botoesControle">
          <button onClick={diminuirEspacamentoLetras} aria-label="Diminuir espaçamento de letras">-</button>
          <span>{configuracoes.espacamentoLetras.toFixed(1)}px</span>
          <button onClick={aumentarEspacamentoLetras} aria-label="Aumentar espaçamento de letras">+</button>
          <button onClick={redefinirEspacamentoLetras} aria-label="Redefinir espaçamento de letras">Redefinir</button>
        </div>
      </div>

      <div className="secao">
        <h4 className="tituloSecao">
          <MoreHorizontal size={16} /> Altura da Linha
        </h4>
        <div className="botoesControle">
          <button onClick={diminuirAlturaLinha} aria-label="Diminuir altura da linha">-</button>
          <span>{configuracoes.alturaLinha.toFixed(1)}</span>
          <button onClick={aumentarAlturaLinha} aria-label="Aumentar altura da linha">+</button>
          <button onClick={redefinirAlturaLinha} aria-label="Redefinir altura da linha">Redefinir</button>
        </div>
      </div>
    </>
  );
};

export default SecaoTexto;