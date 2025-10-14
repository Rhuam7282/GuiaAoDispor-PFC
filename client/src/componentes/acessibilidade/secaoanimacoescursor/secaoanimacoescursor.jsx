// src/componentes/acessibilidade/./SecaoAnimacoesCursor/SecaoAnimacoesCursor.jsx
import { Pause, MousePointer } from 'lucide-react';

const SecaoAnimacoesCursor = ({ configuracoes, atualizarConfiguracao }) => {
  return (
    <>
      <div className="secao">
        <h4 className="tituloSecao">
          <Pause size={16} /> Pausar Animações
        </h4>
        <div className="botoesControle">
          <button onClick={() => atualizarConfiguracao('pausarAnimacoes', !configuracoes.pausarAnimacoes)} 
                  aria-pressed={configuracoes.pausarAnimacoes}>
            {configuracoes.pausarAnimacoes ? 'Ativado' : 'Desativado'}
          </button>
        </div>
      </div>

      <div className="secao">
        <h4 className="tituloSecao">
          <MousePointer size={16} /> Cursor Grande
        </h4>
        <div className="botoesControle">
          <button onClick={() => atualizarConfiguracao('cursorGrande', !configuracoes.cursorGrande)} 
                  aria-pressed={configuracoes.cursorGrande}>
            {configuracoes.cursorGrande ? 'Ativado' : 'Desativado'}
          </button>
        </div>
      </div>
    </>
  );
};

export default SecaoAnimacoesCursor;