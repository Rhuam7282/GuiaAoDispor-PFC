import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CONFIG } from '@config/config.js';
import App from './App.jsx';
import './index.css';

// Renderização direta sem timeout
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CONFIG.CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);