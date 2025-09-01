// Configurações da API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  TIMEOUT: 10000,
};

// Tipos de perfil disponíveis
export const TIPOS_PERFIL = {
  PESSOAL: "Pessoal",
  PROFISSIONAL: "Profissional",
};