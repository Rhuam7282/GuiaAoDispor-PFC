// Configurações consolidadas da API
export const ConfiguracaoApi = {
  URL_BASE: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  ENDPOINTS: {
    USUARIOS: "/api/usuarios",
    AUTENTICACAO: "/api/auth",
    PERFIS: "/api/auth/perfil",
    LOCALIZACOES: "/api/localizacoes",
    PROFISSIONAIS: "/api/profissionais",
    AVALIACOES: "/api/avaliacoes",
    HCURRICULARES: "/api/hcurriculares",
    HPROFISSIONAIS: "/api/hprofissionais"
  }
};

export const ConfiguracaoGoogle = {
  CLIENTE_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "751518931398-co21kq5n50m8apn4llgv7av32g2m17vq.apps.googleusercontent.com"
};

export const ConfiguracaoAutenticacao = {
  CHAVE_TOKEN: "token",
  CHAVE_USUARIO: "usuario",
  CHAVE_AUTENTICADO: "autenticado"
};

export const TiposPerfil = {
  PESSOAL: "Pessoal",
  PROFISSIONAL: "Profissional",
};

// Exportação para compatibilidade com código antigo
export const API_CONFIG = ConfiguracaoApi;
export const GOOGLE_CONFIG = ConfiguracaoGoogle;
export const AUTH_CONFIG = ConfiguracaoAutenticacao;
export const TIPOS_PERFIL = TiposPerfil;

export default {
  ConfiguracaoApi,
  ConfiguracaoGoogle,
  ConfiguracaoAutenticacao,
  TiposPerfil,
  API_CONFIG,
  GOOGLE_CONFIG,
  AUTH_CONFIG,
  TIPOS_PERFIL
};