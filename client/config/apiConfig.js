// Configurações da API
export const CONFIG_API = {
  URL_BASE: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  TEMPO_LIMITE: 10000, // 10 segundos
};

// Tipos de perfil disponíveis
export const TIPOS_PERFIL = {
  PESSOAL: "Pessoal",
  PROFISSIONAL: "Profissional",
};
