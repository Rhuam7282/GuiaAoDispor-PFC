import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CONFIG } from '/GoogleConfig.js';
import App from 'App.jsx';
import 'Index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

console.log('React version:', React.version);
console.log('ReactDOM version:', ReactDOM.version);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CONFIG.CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);