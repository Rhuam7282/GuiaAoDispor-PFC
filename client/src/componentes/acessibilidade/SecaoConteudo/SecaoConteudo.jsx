// src/componentes/acessibilidade/SecaoConteudo/SecaoConteudo.jsx
import { Link, Image, Heading } from 'lucide-react';
import { useState } from 'react';

const [modoDestacarLinks, setModoDestacarLinks] = useState(0); 

const alternarModoDestacarLinks = () => {
  const novoModo = (modoDestacarLinks + 1) % 3;
  setModoDestacarLinks(novoModo);
  atualizarConfiguracao('destacarLinks', novoModo);
};

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
          <button
            onClick={alternarModoDestacarLinks}
            className={modoDestacarLinks !== 0 ? 'ativo' : ''}
          >
            {modoDestacarLinks === 0 ? 'Desativado' :
              modoDestacarLinks === 1 ? 'Modo Cores' : 'Modo Borda'}
          </button>
        </div>
      </div>
    </>
  );
};

export default SecaoConteudo;