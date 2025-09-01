/* Componente GoogleLoginButton - Botão de login com Google OAuth */
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contextos/AuthContext';
import { useNavigate } from 'react-router-dom';

/* Função para decodificar JWT token do Google */
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
};

/* Componente principal do botão de login Google */
const GoogleLoginButton = ({ onSuccess, onError, text = "Entrar com Google" }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  /* Função chamada quando login é bem-sucedido */
  const handleSuccess = (credentialResponse) => {
    try {
      /* Decodifica o token JWT para obter dados do usuário */
      const userInfo = decodeJWT(credentialResponse.credential);
      
      if (userInfo) {
        /* Cria objeto com dados do usuário */
        const userData = {
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
          credential: credentialResponse.credential,
          loginTime: new Date().toISOString()
        };

        /* Faz login do usuário */
        login(userData);

        /* Chama callback personalizado se fornecido */
        if (onSuccess) {
          onSuccess(userData);
        } else {
          /* Redireciona para página inicial por padrão */
          navigate('/');
        }

        console.log('Login realizado com sucesso:', userData);
      }
    } catch (error) {
      console.error('Erro no processamento do login:', error);
      handleError();
    }
  };

  /* Função chamada quando há erro no login */
  const handleError = () => {
    console.error('Erro no login com Google');
    if (onError) {
      onError();
    }
  };

  return (
    <div className="google-login-container flexCentro">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={text}
        theme="outline"
        size="large"
        shape="rectangular"
        width="300"
      />
    </div>
  );
};

export default GoogleLoginButton;

