import React, { useRef } from 'react';

const UploadImagem = ({ foto, aoSelecionarArquivo }) => {
  const fileInputRef = useRef(null);

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      aoSelecionarArquivo(file);
    }
  };

  return (
    <div className="secao-upload-imagem">
      <div 
        className="area-upload-imagem"
        onClick={handleContainerClick}
        style={{ cursor: 'pointer' }}
      >
        {foto ? (
          <div className="container-imagem-quadrada">
            <img 
              src={foto} 
              alt="Preview" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
          </div>
        ) : (
          <div className="placeholder-upload">
            <span style={{ fontSize: '3rem', marginBottom: '10px' }}>📷</span>
            <p>Clique para adicionar uma foto</p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          id="foto"
          name="foto"
          accept="image/jpeg, image/jpg, image/png, image/webp"
          onChange={handleFileChange}
          className="input-arquivo"
        />
      </div>
      
      {foto && (
        <button 
          type="button" 
          className="botao-adicionar"
          onClick={handleContainerClick}
        >
          Alterar Foto
        </button>
      )}
    </div>
  );
};

export default UploadImagem;