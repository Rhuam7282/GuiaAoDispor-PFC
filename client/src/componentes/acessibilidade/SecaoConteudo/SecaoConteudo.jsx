// src/componentes/acessibilidade/SecaoConteudo/SecaoConteudo.jsx
import { EyeOff, Link } from 'lucide-react';
import './SecaoConteudo.css';

const SecaoConteudo = ({ configuracoes, atualizarConfiguracao }) => {
  return (
    <>
      <div className="secao">
        <h4 className="tituloSecao">
          <EyeOff size={16} /> Ocultar Imagens
        </h4>
        <div className="botoesControle">
          <button onClick={() => atualizarConfiguracao('removerImagens', !configuracoes.removerImagens)} 
                  aria-pressed={configuracoes.removerImagens}>
            {configuracoes.removerImagens ? 'Ativado' : 'Desativado'}
          </button>
        </div>
      </div>

      <div className="secao">
        <h4 className="tituloSecao">
          <EyeOff size={16} /> Ocultar Cabeçalhos
        </h4>
        <div className="botoesControle">
          <button onClick={() => atualizarConfiguracao('removerCabecalhos', !configuracoes.removerCabecalhos)} 
                  aria-pressed={configuracoes.removerCabecalhos}>
            {configuracoes.removerCabecalhos ? 'Ativado' : 'Desativado'}
          </button>
        </div>
      </div>

      <div className="secao">
        <h4 className="tituloSecao">
          <Link size={16} /> Destacar Links
        </h4>
        <div className="botoesControle">
          <button onClick={() => atualizarConfiguracao('destacarLinks', !configuracoes.destacarLinks)} 
                  aria-pressed={configuracoes.destacarLinks}>
            {configuracoes.destacarLinks ? 'Ativado' : 'Desativado'}
          </button>
        </div>
      </div>
    </>
  );
};

export default SecaoConteudo;