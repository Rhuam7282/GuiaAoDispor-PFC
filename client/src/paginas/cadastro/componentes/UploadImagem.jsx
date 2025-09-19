import React, { useState } from 'react';

const UploadImagem = ({ foto, aoSelecionarArquivo }) => {
  const [objectFit, setObjectFit] = useState('cover');
  const [objectPosition, setObjectPosition] = useState('center');

  const handleObjectFitChange = (novoObjectFit) => {
    setObjectFit(novoObjectFit);
  };

  const handleObjectPositionChange = (posicao) => {
    setObjectPosition(posicao);
  };

  return (
    <div className="secao-upload-imagem">
      <div className="area-upload-imagem sombraPequena fundoMarromDestaqueTransparente">
        <input
          type="file"
          id="foto"
          className="input-arquivo"
          accept="image/*"
          onChange={aoSelecionarArquivo}
        />
        <label htmlFor="foto" className="rotulo-upload-imagem">
          {foto ? (
            <div className="container-imagem-quadrada">
              <img 
                src={foto} 
                alt="Preview" 
                className="imagemPerfil" 
                style={{ 
                  objectFit: objectFit,
                  objectPosition: objectPosition
                }} 
              />
            </div>
          ) : (
            <div className="placeholder-upload">
              <span>Clique para adicionar uma foto</span>
            </div>
          )}
        </label>
      </div>
      
      {foto && (
        <div className="controles-enquadramento">
          <div className="grupo-controles">
            <label>Tipo de Enquadramento:</label>
            <div className="botoes-controle">
              <button
                type="button"
                className={`botao-controle ${objectFit === 'cover' ? 'ativo' : ''}`}
                onClick={() => handleObjectFitChange('cover')}
              >
                Cobrir
              </button>
              <button
                type="button"
                className={`botao-controle ${objectFit === 'contain' ? 'ativo' : ''}`}
                onClick={() => handleObjectFitChange('contain')}
              >
                Conter
              </button>
            </div>
          </div>
          
          <div className="grupo-controles">
            <label>Posição da Imagem:</label>
            <div className="grade-posicoes">
              <button
                type="button"
                className={`botao-posicao ${objectPosition === 'top left' ? 'ativo' : ''}`}
                onClick={() => handleObjectPositionChange('top left')}
                title="Superior Esquerdo"
              >
                ↖
              </button>
              <button
                type="button"
                className={`botao-posicao ${objectPosition === 'top center' ? 'ativo' : ''}`}
                onClick={() => handleObjectPositionChange('top center')}
                title="Superior Centro"
              >
                ↑
              </button>
              <button
                type="button"
                className={`botao-posicao ${objectPosition === 'top right' ? 'ativo' : ''}`}
                onClick={() => handleObjectPositionChange('top right')}
                title="Superior Direito"
              >
                ↗
              </button>
              <button
                type="button"
                className={`botao-posicao ${objectPosition === 'center left' ? 'ativo' : ''}`}
                onClick={() => handleObjectPositionChange('center left')}
                title="Centro Esquerdo"
              >
                ←
              </button>
              <button
                type="button"
                className={`botao-posicao ${objectPosition === 'center' ? 'ativo' : ''}`}
                onClick={() => handleObjectPositionChange('center')}
                title="Centro"
              >
                ◎
              </button>
              <button
                type="button"
                className={`botao-posicao ${objectPosition === 'center right' ? 'ativo' : ''}`}
                onClick={() => handleObjectPositionChange('center right')}
                title="Centro Direito"
              >
                →
              </button>
              <button
                type="button"
                className={`botao-posicao ${objectPosition === 'bottom left' ? 'ativo' : ''}`}
                onClick={() => handleObjectPositionChange('bottom left')}
                title="Inferior Esquerdo"
              >
                ↙
              </button>
              <button
                type="button"
                className={`botao-posicao ${objectPosition === 'bottom center' ? 'ativo' : ''}`}
                onClick={() => handleObjectPositionChange('bottom center')}
                title="Inferior Centro"
              >
                ↓
              </button>
              <button
                type="button"
                className={`botao-posicao ${objectPosition === 'bottom right' ? 'ativo' : ''}`}
                onClick={() => handleObjectPositionChange('bottom right')}
                title="Inferior Direito"
              >
                ↘
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImagem;