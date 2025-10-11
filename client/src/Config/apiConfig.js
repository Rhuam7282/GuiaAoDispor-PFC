// Configurações da API - Arquivo consolidado
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  ENDPOINTS: {
    USERS: "/api/usuarios",
    AUTH: "/api/auth",
    PROFILES: "/api/profiles",
    LOCATIONS: "/api/localizacoes",
    PROFESSIONALS: "/api/profissionais",
    EVALUATIONS: "/api/avaliacoes"
  }
};

// Configurações do Google OAuth
export const GOOGLE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "751518931398-co21kq5n50m8apn4llgv7av32g2m17vq.apps.googleusercontent.com"
};

// Configurações de autenticação
export const AUTH_CONFIG = {
  TOKEN_KEY: "auth_token",
  USER_KEY: "user_data",
  REFRESH_TOKEN_KEY: "refresh_token"
};

// Tipos de perfil disponíveis
export const TIPOS_PERFIL = {
  PESSOAL: "Pessoal",
  PROFISSIONAL: "Profissional",
};

export default {
  API_CONFIG,
  GOOGLE_CONFIG,
  AUTH_CONFIG,
  TIPOS_PERFIL
};