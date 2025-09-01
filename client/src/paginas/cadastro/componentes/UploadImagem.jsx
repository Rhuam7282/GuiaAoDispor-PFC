import React from 'react';

const UploadImagem = ({ foto, aoSelecionarArquivo }) => {
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
            <img src={foto} alt="Preview" className="imagemPerfil" style={{ width: '99%', height: '99%' }} />
          ) : (
            <div className="placeholder-upload">
              <span>Clique para adicionar uma foto</span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default UploadImagem;

