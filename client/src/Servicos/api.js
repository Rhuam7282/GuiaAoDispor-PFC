// Configuração da API
const ConfiguracaoApi = {
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
    },
    mode: "cors",
    credentials: "include",
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
      let mensagemErro = `Erro ${resposta.status}: ${resposta.statusText}`;

      try {
        const contentType = resposta.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const dadosErro = await resposta.json();
          mensagemErro = dadosErro.message || dadosErro.mensagem || mensagemErro;
        }
      } catch (e) {
        // Ignora erro de parsing
      }

      if (resposta.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("autenticado");
        window.location.href = "/";
      }

      throw new Error(mensagemErro);
    }

    const contentType = resposta.headers.get("content-type");

    if (resposta.status === 204 || !contentType) {
      return { status: "sucesso" };
    }

    const text = await resposta.text();

    if (!contentType.includes("application/json")) {
      console.warn("⚠️ Resposta não é JSON:", text.substring(0, 200));
      throw new Error("Resposta da API não é JSON");
    }

    const dadosResposta = JSON.parse(text);
    return dadosResposta;
  } catch (erro) {
    console.error("❌ Erro na requisição:", erro);

    if (erro.name === "TypeError" && erro.message.includes("fetch")) {
      throw new Error("Erro de conexão. Verifique se o servidor está rodando.");
    }

    throw erro;
  }
};

// Serviços de Localização
export const ServicoLocalizacao = {
  criar: (dadosLocalizacao) =>
    fazerRequisicao(ConfiguracaoApi.ENDPOINTS.LOCALIZACOES, "POST", dadosLocalizacao),
  buscarPorId: (id) => fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.LOCALIZACOES}/${id}`, "GET"),
  listarTodas: () => fazerRequisicao(ConfiguracaoApi.ENDPOINTS.LOCALIZACOES, "GET"),
  atualizar: (id, dadosLocalizacao) =>
    fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.LOCALIZACOES}/${id}`, "PUT", dadosLocalizacao),
  deletar: (id) => fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.LOCALIZACOES}/${id}`, "DELETE"),
};

// Serviços de Usuário
export const ServicoUsuario = {
  criar: (dadosUsuario) =>
    fazerRequisicao(ConfiguracaoApi.ENDPOINTS.USUARIOS, "POST", dadosUsuario),
  buscarPorId: (id) => fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.USUARIOS}/${id}`, "GET"),
  listarTodos: () => fazerRequisicao(ConfiguracaoApi.ENDPOINTS.USUARIOS, "GET"),
  atualizar: (id, dadosUsuario) =>
    fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.USUARIOS}/${id}`, "PUT", dadosUsuario),
  deletar: (id) => fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.USUARIOS}/${id}`, "DELETE"),
};

// Serviços de Profissional
export const ServicoProfissional = {
  criar: (dadosProfissional) =>
    fazerRequisicao(ConfiguracaoApi.ENDPOINTS.PROFISSIONAIS, "POST", dadosProfissional),
  buscarPorId: (id) =>
    fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.PROFISSIONAIS}/${id}`, "GET"),
  listarTodos: () => fazerRequisicao(ConfiguracaoApi.ENDPOINTS.PROFISSIONAIS, "GET"),
  atualizar: (id, dadosProfissional) =>
    fazerRequisicao(
      `${ConfiguracaoApi.ENDPOINTS.PROFISSIONAIS}/${id}`,
      "PUT",
      dadosProfissional
    ),
  deletar: (id) => fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.PROFISSIONAIS}/${id}`, "DELETE"),
};

// Serviços de Avaliação
export const ServicoAvaliacao = {
  criar: (dadosAvaliacao) =>
    fazerRequisicao(ConfiguracaoApi.ENDPOINTS.AVALIACOES, "POST", dadosAvaliacao),
  buscarPorId: (id) => fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.AVALIACOES}/${id}`, "GET"),
  listarTodas: () => fazerRequisicao(ConfiguracaoApi.ENDPOINTS.AVALIACOES, "GET"),
  atualizar: (id, dadosAvaliacao) =>
    fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.AVALIACOES}/${id}`, "PUT", dadosAvaliacao),
  deletar: (id) => fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.AVALIACOES}/${id}`, "DELETE"),
};

// Serviços de Histórico Curricular
export const ServicoHCurricular = {
  criar: (dadosHCurricular) =>
    fazerRequisicao(ConfiguracaoApi.ENDPOINTS.HCURRICULARES, "POST", dadosHCurricular),
  buscarPorId: (id) =>
    fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.HCURRICULARES}/${id}`, "GET"),
  listarTodos: () => fazerRequisicao(ConfiguracaoApi.ENDPOINTS.HCURRICULARES, "GET"),
  atualizar: (id, dadosHCurricular) =>
    fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.HCURRICULARES}/${id}`, "PUT", dadosHCurricular),
  deletar: (id) => fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.HCURRICULARES}/${id}`, "DELETE"),
};

// Serviços de Histórico Profissional
export const ServicoHProfissional = {
  criar: (dadosHProfissional) =>
    fazerRequisicao(ConfiguracaoApi.ENDPOINTS.HPROFISSIONAIS, "POST", dadosHProfissional),
  buscarPorId: (id) =>
    fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.HPROFISSIONAIS}/${id}`, "GET"),
  listarTodos: () => fazerRequisicao(ConfiguracaoApi.ENDPOINTS.HPROFISSIONAIS, "GET"),
  atualizar: (id, dadosHProfissional) =>
    fazerRequisicao(
      `${ConfiguracaoApi.ENDPOINTS.HPROFISSIONAIS}/${id}`,
      "PUT",
      dadosHProfissional
    ),
  deletar: (id) =>
    fazerRequisicao(`${ConfiguracaoApi.ENDPOINTS.HPROFISSIONAIS}/${id}`, "DELETE"),
};

// Serviços de Cadastro
export const ServicoCadastro = {
  validarEmail: async (email) => {
    try {
      const resposta = await fazerRequisicao(
        `${ConfiguracaoApi.ENDPOINTS.AUTENTICACAO}/validar-email`,
        "POST",
        { email }
      );
      return resposta;
    } catch (erro) {
      console.error("Erro ao validar email:", erro);
      throw erro;
    }
  },

  cadastrarUsuario: async (dadosPerfil, dadosLocalizacao) => {
    try {
      const respostaLocalizacao = await ServicoLocalizacao.criar(
        dadosLocalizacao
      );
      const localizacaoId = respostaLocalizacao.data._id;

      const dadosUsuario = {
        ...dadosPerfil,
        localizacao: localizacaoId,
      };

      const respostaUsuario = await ServicoUsuario.criar(dadosUsuario);
      return respostaUsuario;
    } catch (erro) {
      console.error("Erro ao cadastrar usuário:", erro);
      throw new Error(`Erro no cadastro: ${erro.message}`);
    }
  },

  cadastrarProfissional: async (dadosProfissional, dadosLocalizacao) => {
    try {
      const respostaLocalizacao = await ServicoLocalizacao.criar(
        dadosLocalizacao
      );

      const respostaProfissional = await ServicoProfissional.criar({
        ...dadosProfissional,
        localizacao: respostaLocalizacao.data._id,
      });

      return respostaProfissional;
    } catch (erro) {
      throw new Error(`Erro no cadastro: ${erro.message}`);
    }
  },
};

// Serviços de Autenticação
export const ServicoAutenticacao = {
  login: async (email, senha) => {
    try {
      console.log('🔐 Tentando login para:', email);
      
      const resposta = await fazerRequisicao(
        `${ConfiguracaoApi.ENDPOINTS.AUTENTICACAO}/login`, 
        "POST", 
        { email, senha }
      );

      console.log('📨 Resposta do login:', resposta);

      if (resposta && resposta.status === "sucesso") {
        localStorage.setItem("token", resposta.token);
        localStorage.setItem("usuario", JSON.stringify(resposta.data));
        localStorage.setItem("autenticado", "true");
        localStorage.setItem("timestampLogin", Date.now().toString());

        console.log('✅ Login bem-sucedido, token armazenado');
        return resposta;
      } else {
        const mensagemErro = resposta?.message || "Credenciais inválidas";
        console.error('❌ Erro na resposta do login:', mensagemErro);
        throw new Error(mensagemErro);
      }
    } catch (erro) {
      console.error("❌ Erro no login:", erro);

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("autenticado");

      if (erro.message.includes("401")) {
        throw new Error("Credenciais inválidas");
      } else if (erro.message.includes("404")) {
        throw new Error("Email não encontrado");
      } else if (
        erro.message.includes("Network Error") ||
        erro.message.includes("Failed to fetch")
      ) {
        throw new Error("Erro de conexão. Verifique sua internet.");
      } else {
        throw new Error(erro.message || "Erro ao fazer login");
      }
    }
  },

  buscarPerfilLogado: async (id) => {
    try {
      const resposta = await fazerRequisicao(
        `${ConfiguracaoApi.ENDPOINTS.PERFIS}/${id}`,
        "GET"
      );
      return resposta;
    } catch (erro) {
      throw new Error(`Erro ao buscar perfil: ${erro.message}`);
    }
  },

  editarPerfil: async (id, dadosAtualizacao) => {
    try {
      const resposta = await fazerRequisicao(
        `${ConfiguracaoApi.ENDPOINTS.PERFIS}/${id}`,
        "PUT",
        dadosAtualizacao
      );
      return resposta;
    } catch (erro) {
      throw new Error(`Erro ao editar perfil: ${erro.message}`);
    }
  },

  logout: async () => {
    try {
      const resposta = await fazerRequisicao(
        `${ConfiguracaoApi.ENDPOINTS.AUTENTICACAO}/logout`, 
        "POST"
      );

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("autenticado");
      localStorage.removeItem("timestampLogin");

      return resposta;
    } catch (erro) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("autenticado");
      localStorage.removeItem("timestampLogin");

      throw new Error(`Erro ao fazer logout: ${erro.message}`);
    }
  },
};

// Exportação padrão com todos os serviços
export default {
  ServicoAutenticacao,
  ServicoLocalizacao,
  ServicoUsuario,
  ServicoProfissional,
  ServicoAvaliacao,
  ServicoHCurricular,
  ServicoHProfissional,
  ServicoCadastro
};