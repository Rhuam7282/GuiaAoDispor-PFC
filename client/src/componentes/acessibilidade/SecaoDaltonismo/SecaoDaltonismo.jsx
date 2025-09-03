// src/componentes/acessibilidade/SecaoDaltonismo/SecaoDaltonismo.jsx
import { BookOpen } from 'lucide-react';
import './SecaoDaltonismo.css';

const SecaoDaltonismo = ({ configuracoes, atualizarConfiguracao }) => {
  const obterTextoModoDaltonico = () => {
    switch (configuracoes.modoDaltonico) {
      case 1: return 'Protanopia';
      case 2: return 'Deuteranopia';
      case 3: return 'Tritanopia';
      default: return 'Normal';
    }
  };

  return (
    <div className="secao">
      <h4 className="tituloSecao">
        <BookOpen size={16} /> Leitura Daltônica
      </h4>
      <div className="botoesControle">
        <button onClick={() => atualizarConfiguracao('modoDaltonico', (configuracoes.modoDaltonico + 1) % 4)} 
                aria-label={`Alternar modo daltônico. Estado atual: ${obterTextoModoDaltonico()}`}>
          {obterTextoModoDaltonico()}
        </button>
      </div>
    </div>
  );
};

export default SecaoDaltonismo;