import React from 'react';
import logo from '../../../recursos/icones/logo.svg';

const UploadImagem = ({ foto, aoSelecionarArquivo }) => {
  const logo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='95' stroke='%230056b3' stroke-width='2'/%3E%3Ctext x='100' y='110' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='18'%3ELogo%3C/text%3E%3C/svg%3E";

  return (
    <div className="secao-upload-imagem">
      <div className="area-upload-imagem">
        <input
          type="file"
          id="foto"
          name="foto"
          accept="image/jpeg, image/jpg, image/png, image/webp"
          onChange={aoSelecionarArquivo}
          className="input-arquivo"
        />
        
        <label htmlFor="foto" className="rotulo-upload-imagem">
          <div className="container-imagem-quadrada">
            <img 
              src={foto || logo} 
              alt="Preview" 
              className={`imagemPerfil ${!foto ? 'imagem-default' : ''}`}
            />
          </div>
        </label>
      </div>
      
      <div className="placeholder-upload">
        <span>Clique para {foto ? 'alterar' : 'adicionar'} foto</span>
        <span>Formatos: JPG, PNG, WEBP</span>
      </div>
    </div>
  );
};

export default UploadImagem;