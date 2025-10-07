import { Contrast, Moon, Sun, BookOpen } from 'lucide-react';

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

  return (
    <>
      {/* Seção Contraste */}
      <div className="secao">
        <h4 className="tituloSecao">
          <Contrast size={16} /> Modo de Contraste
        </h4>
        <div className="botoesControle">
          <button 
            onClick={() => atualizarConfiguracao('modoContraste', (configuracoes.modoContraste + 1) % 3)} 
            aria-label={`Alternar modo de contraste. Estado atual: ${obterTextoModoContraste()}`}
          >
            {obterTextoModoContraste()}
          </button>
        </div>
      </div>

      {/* Seção Tema Escuro */}
      <div className="secao">
        <h4 className="tituloSecao">
          {configuracoes.modoEscuro === 1 ? <Moon size={16} /> : <Sun size={16} />} Tema Escuro
        </h4>
        <div className="botoesControle">
          <button 
            onClick={() => atualizarConfiguracao('modoEscuro', (configuracoes.modoEscuro + 1) % 2)} 
            aria-label={`Alternar tema escuro. Estado atual: ${obterTextoModoEscuro()}`}
          >
            {obterTextoModoEscuro()}
          </button>
        </div>
      </div>

      {/* Seção Daltonismo Integrada */}
      <div className="secao">
        <h4 className="tituloSecao">
          <BookOpen size={16} /> Modo Daltonismo
        </h4>
        <div className="botoesControle">
          <button 
            onClick={() => atualizarConfiguracao('modoDaltonico', 0)}
            className={configuracoes.modoDaltonico === 0 ? 'ativo' : ''}
          >
            Normal
          </button>
          <button 
            onClick={() => atualizarConfiguracao('modoDaltonico', 1)}
            className={configuracoes.modoDaltonico === 1 ? 'ativo' : ''}
          >
            Protanopia
          </button>
          <button 
            onClick={() => atualizarConfiguracao('modoDaltonico', 2)}
            className={configuracoes.modoDaltonico === 2 ? 'ativo' : ''}
          >
            Deuteranopia
          </button>
          <button 
            onClick={() => atualizarConfiguracao('modoDaltonico', 3)}
            className={configuracoes.modoDaltonico === 3 ? 'ativo' : ''}
          >
            Tritanopia
          </button>
        </div>
      </div>
    </>
  );
};

export default SecaoVisao;