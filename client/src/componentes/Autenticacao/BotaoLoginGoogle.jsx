
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@Contextos/Autenticacao.jsx';
import { useNavigate } from 'react-router-dom';


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


const GoogleLoginButton = ({ onSuccess, onError, text = "Entrar com Google" }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  
  const handleSuccess = (credentialResponse) => {
    try {
      
      const userInfo = decodeJWT(credentialResponse.credential);
      
      if (userInfo) {
        
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

        
        login(userData);

        
        if (onSuccess) {
          onSuccess(userData);
        } else {
          
          navigate('/');
        }

        console.log('Login realizado com sucesso:', userData);
      }
    } catch (error) {
      console.error('Erro no processamento do login:', error);
      handleError();
    }
  };

  
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

