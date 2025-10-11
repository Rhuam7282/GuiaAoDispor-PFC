// Configuração da API
const ConfiguracaoApi = {
  URL_BASE: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  ENDPOINTS: {
    USUARIOS: "/api/usuarios",
    AUTENTICACAO: "/api/auth",
    PERFIS: "/api/auth/perfil",
    LOCALIZACOES: "/api/localizacoes",
    PROFISSIONAIS: "/api/profissionais"
  }
};

// No desenvolvimento, usa URL relativa (proxy do Vite)
// Na produção, usa URL absoluta
const URL_BASE = import.meta.env.MODE === 'development' ? '' : ConfiguracaoApi.URL_BASE;

const obterToken = () => {
  return localStorage.getItem("token");
};

const fazerRequisicao = async (endpoint, metodo, dados = null) => {
  const url = `${URL_BASE}${endpoint}`;
  const token = obterToken();
  
  const opcoes = {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
    }
  };

  if (token) {
    opcoes.headers.Authorization = `Bearer ${token}`;
  }

  if (dados && (metodo === "POST" || metodo === "PUT" || metodo === "PATCH")) {
    opcoes.body = JSON.stringify(dados);
  }

  try {
    console.log(`🌐 Fazendo requisição ${metodo} para: ${url}`);
    const resposta = await fetch(url, opcoes);

    if (!resposta.ok) {
      const erroTexto = await resposta.text();
      throw new Error(`Erro ${resposta.status}: ${erroTexto || resposta.statusText}`);
    }

    const texto = await resposta.text();
    if (!texto) return { status: "sucesso" };

    return JSON.parse(texto);
  } catch (erro) {
    console.error("❌ Erro na requisição:", erro);
    throw erro;
  }
};

// Serviços de Autenticação
export const ServicoAutenticacao = {
  login: async (email, senha) => {
    const resposta = await fazerRequisicao(
      `${ConfiguracaoApi.ENDPOINTS.AUTENTICACAO}/login`,
      "POST",
      { email, senha }
    );

    if (resposta && resposta.status === "sucesso") {
      localStorage.setItem("token", resposta.token);
      localStorage.setItem("usuario", JSON.stringify(resposta.data));
      localStorage.setItem("autenticado", "true");
      return resposta;
    }

    throw new Error(resposta?.message || "Credenciais inválidas");
  },

  buscarPerfil: async (id) => {
    return await fazerRequisicao(
      `${ConfiguracaoApi.ENDPOINTS.PERFIS}/${id}`,
      "GET"
    );
  },

  validarEmail: async (email) => {
    return await fazerRequisicao(
      `${ConfiguracaoApi.ENDPOINTS.AUTENTICACAO}/validar-email`,
      "POST",
      { email }
    );
  }
};

export default {
  ServicoAutenticacao
};