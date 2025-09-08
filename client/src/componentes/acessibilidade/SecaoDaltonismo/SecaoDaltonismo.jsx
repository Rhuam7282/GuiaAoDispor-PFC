import { BookOpen } from 'lucide-react';

const SecaoDaltonismo = ({ configuracoes, atualizarConfiguracao }) => {
  return (
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
  );
};

export default SecaoDaltonismo;