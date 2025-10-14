/* Configurações da aplicação */
/* Configuração do Google OAuth */
export const GOOGLE_CONFIG = {
  // Client ID do Google OAuth - deve ser configurado com o ID real
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
};
/* Configurações da API */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  ENDPOINTS: {
    USERS: "/api/users",
    AUTH: "/api/auth",
    PROFILES: "/api/profiles"
  }
};
/* Configurações de autenticação */
export const AUTH_CONFIG = {
  TOKEN_KEY: "auth_token",
  USER_KEY: "user_data",
  REFRESH_TOKEN_KEY: "refresh_token"
};
export default {
  GOOGLE_CONFIG,
  API_CONFIG,
  AUTH_CONFIG
};

