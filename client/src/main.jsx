import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import './index.css';

// Configuração direta do Google Client ID
const GOOGLE_CLIENT_ID = '751518931398-co21kq5n50m8apn4llgv7av32g2m17vq.apps.googleusercontent.com';

// Garantir que o elemento root existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento root não encontrado no HTML');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);