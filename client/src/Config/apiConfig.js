export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  ENDPOINTS: {
    USERS: "/api/usuarios",
    AUTH: "/api/auth",
    PROFILES: "/api/profiles",
    LOCATIONS: "/api/localizacoes",
    PROFESSIONALS: "/api/profissionais"
  }
};