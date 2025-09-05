// src/componentes/acessibilidade/SecaoConteudo/SecaoConteudo.jsx
import { Link, Image, Heading } from 'lucide-react';

const SecaoConteudo = ({ configuracoes, atualizarConfiguracao }) => {
  return (
    <>
      <div className="secao">
        <h4 className="tituloSecao">
          <Image size={16} /> Remover Imagens
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
          <Heading size={16} /> Remover Cabeçalhos
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
          <button onClick={() => atualizarConfiguracao('destacarLinks', configuracoes.destacarLinks === 0 ? 1 : 0)} 
                  className={configuracoes.destacarLinks === 1 ? 'ativo' : ''}>
            Modo Cores
          </button>
          <button onClick={() => atualizarConfiguracao('destacarLinks', configuracoes.destacarLinks === 2 ? 0 : 2)} 
                  className={configuracoes.destacarLinks === 2 ? 'ativo' : ''}>
            Modo Borda
          </button>
        </div>
      </div>
    </>
  );
};

export default SecaoConteudo;