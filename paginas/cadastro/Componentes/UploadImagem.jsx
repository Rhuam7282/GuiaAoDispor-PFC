import React from 'react';

const UploadImagem = ({ foto, aoSelecionarArquivo }) => {
  return (
    <div className="upload-imagem">
      <label htmlFor="foto" className="label-upload">
        {foto ? 'Alterar Foto' : 'Adicionar Foto'}
      </label>
      <input
        type="file"
        id="foto"
        name="foto"
        accept="image/jpeg, image/jpg, image/png, image/webp"
        onChange={aoSelecionarArquivo}
        style={{ display: 'none' }}
      />
      {foto && (
        <div className="imagemPerfil">
          <img src={foto} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default UploadImagem;