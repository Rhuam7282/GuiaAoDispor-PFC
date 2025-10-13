import React from 'react';

const UploadImagem = ({ foto, aoSelecionarArquivo }) => {
  return (
    <div className="secao-upload-imagem">
      <div className="area-upload-imagem">
        <label htmlFor="foto" className="rotulo-upload-imagem">
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
            <div className="container-imagem-quadrada imagem-padrao">
              <span>Adicionar Foto</span>
            </div>
          )}
          <input
            type="file"
            id="foto"
            name="foto"
            accept="image/jpeg, image/jpg, image/png, image/webp"
            onChange={aoSelecionarArquivo}
            className="input-arquivo"
          />
        </label>
      </div>
      <p className="placeholder-upload">
        Clique para {foto ? 'alterar' : 'adicionar'} sua foto
      </p>
    </div>
  );
};

export default UploadImagem;