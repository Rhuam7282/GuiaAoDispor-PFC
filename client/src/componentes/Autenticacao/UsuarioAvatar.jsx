// client/src/componentes/Autenticacao/UsuarioAvatar.jsx
import React from 'react';
import { useAuth } from '@Contextos/Autenticacao.jsx';

const UsuarioAvatar = ({ tamanho = 'medio', mostrarNome = true }) => {
  const { usuario } = useAuth();

  if (!usuario) return null;

  const classesTamanho = {
    pequeno: 'avatar-pequeno',
    medio: 'avatar-medio',
    grande: 'avatar-grande'
  };

  const iniciais = usuario.nome
    .split(' ')
    .map(nome => nome[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container-avatar">
      <div className={`avatar ${classesTamanho[tamanho]}`}>
        {usuario.foto ? (
          <img 
            src={usuario.foto} 
            alt={`Foto de ${usuario.nome}`}
            className="imagem-avatar"
          />
        ) : (
          <div className="avatar-iniciais">
            {iniciais}
          </div>
        )}
      </div>
      
      {mostrarNome && (
        <div className="info-usuario">
          <span className="nome-usuario">{usuario.nome}</span>
          <span className="tipo-usuario">{usuario.tipoPerfil}</span>
        </div>
      )}
    </div>
  );
};

export default UsuarioAvatar;