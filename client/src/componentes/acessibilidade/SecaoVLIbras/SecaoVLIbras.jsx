// src/componentes/acessibilidade/SecaoVLibras/SecaoVLibras.jsx
import useVLibras from '@ganchos/useVLibras';
import { Volume2, RotateCcw } from 'lucide-react';

const SecaoVLibras = () => {
  const {
    vlibrasVisibility,
    vlibrasStatus,
    toggleVlibrasVisibility,
    reiniciarVLibras,
    obterIconeStatusVLibras
  } = useVLibras();

  return (
    <div className="secao">
      <Volume2 size={16} />
      <h4>VLibras</h4>
      <div className="vlibras-status-toggle-wrapper">
        <button
          onClick={toggleVlibrasVisibility}
          className={`toggle-vlibras-btn ${vlibrasVisibility ? 'active' : ''}`}
          aria-pressed={vlibrasVisibility}
        >
          {vlibrasVisibility ? 'Desativar VLibras' : 'Ativar VLibras'}
        </button>
        {vlibrasVisibility && (
          <div className="vlibras-status-display">
            <div className="vlibras-status-header">
              <span>{obterIconeStatusVLibras()} {vlibrasStatus.message}</span>
              <button
                onClick={reiniciarVLibras}
                className="vlibras-retry-btn"
                disabled={vlibrasStatus.status === 'loading'}
                title="Reiniciar VLibras"
              >
                <RotateCcw size={16} /> Reiniciar
              </button>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${vlibrasStatus.progress}%` }}
              ></div>
            </div>
            {vlibrasStatus.error && (
              <p className="vlibras-error-message">Erro: {vlibrasStatus.error.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecaoVLibras;