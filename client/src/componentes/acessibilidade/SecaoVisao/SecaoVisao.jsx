// src/componentes/acessibilidade/SecaoVisao/SecaoVisao.jsx
import { Contrast, Moon, Sun, Eye } from 'lucide-react';

const SecaoVisao = ({ configuracoes, atualizarConfiguracao }) => {
  const obterTextoModoContraste = () => {
    switch (configuracoes.modoContraste) {
      case 1: return 'Leve';
      case 2: return 'Intenso';
      default: return 'Desativado';
    }
  };

  const obterTextoModoEscuro = () => {
    return configuracoes.modoEscuro === 1 ? 'Ativado' : 'Desativado';
  };

  const obterTextoGuiaLeitura = () => {
    switch (configuracoes.guiaLeitura) {
      case 1: return 'Barra';
      case 2: return 'Máscara';
      default: return 'Desativado';
    }
  };

  return (
    <>
      <div className="secao">
        <h4 className="tituloSecao">
          <Contrast size={16} /> Modo de Contraste
        </h4>
        <div className="botoesControle">
          <button onClick={() => atualizarConfiguracao('modoContraste', (configuracoes.modoContraste + 1) % 3)} 
                  aria-label={`Alternar modo de contraste. Estado atual: ${obterTextoModoContraste()}`}>
            {obterTextoModoContraste()}
          </button>
        </div>
      </div>

      <div className="secao">
        <h4 className="tituloSecao">
          {configuracoes.modoEscuro === 1 ? <Moon size={16} /> : <Sun size={16} />} Tema Escuro
        </h4>
        <div className="botoesControle">
          <button onClick={() => atualizarConfiguracao('modoEscuro', (configuracoes.modoEscuro + 1) % 2)} 
                  aria-label={`Alternar tema escuro. Estado atual: ${obterTextoModoEscuro()}`}>
            {obterTextoModoEscuro()}
          </button>
        </div>
      </div>

      <div className="secao">
        <h4 className="tituloSecao">
          <Eye size={16} /> Guia de Leitura
        </h4>
        <div className="botoesControle">
          <button onClick={() => atualizarConfiguracao('guiaLeitura', (configuracoes.guiaLeitura + 1) % 3)} 
                  aria-label={`Alternar guia de leitura. Estado atual: ${obterTextoGuiaLeitura()}`}>
            {obterTextoGuiaLeitura()}
          </button>
        </div>
      </div>
    </>
  );
};

export default SecaoVisao;