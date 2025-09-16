import { API_CONFIG } from '@config/apiConfig.js';

// Verificar se a configuração da API está correta
console.log('API Config:', API_CONFIG);

const URL_BASE = API_CONFIG.BASE_URL;

// Adicionar timeout para as requisições
const TIMEOUT = 15000; // 15 segundos

// Função para obter o token JWT do localStorage
const obterToken = () => {
  return localStorage.getItem('token');
};

// Função para armazenar o token JWT no localStorage
const armazenarToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenTimestamp', Date.now().toString());
  }
};

// Função para remover o token JWT do localStorage
const removerToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenTimestamp');
};

// Função para verificar se o token está expirado (7 dias)
const tokenExpirado = () => {
  const timestamp = localStorage.getItem('tokenTimestamp');
  if (!timestamp) return true;
  const agora = Date.now();
  const seteDiasEmMs = 7 * 24 * 60 * 60 * 1000;
  return (agora - parseInt(timestamp)) > seteDiasEmMs;
};

const fazerRequisicao = async (url, metodo, dados = null) => {
  // Verificar se o token expirou
  if (tokenExpirado() && url !== `${URL_BASE}/auth/login` && url !== `${URL_BASE}/auth/cadastro`) {
    removerToken();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  const opcoes = {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller.signal
  };

  // Adicionar token de autenticação se disponível
  const token = obterToken();
  if (token) {
    opcoes.headers.Authorization = `Bearer ${token}`;
  }

  if (dados && (metodo === 'POST' || metodo === 'PUT')) {
    opcoes.body = JSON.stringify(dados);
  }

  try {
    console.log(`Fazendo requisição ${metodo} para: ${url}`);
    const resposta = await fetch(url, opcoes);
    clearTimeout(timeoutId);

    // Verificar se a resposta é JSON
    const contentType = resposta.headers.get('content-type');
    const text = await resposta.text();

    if (!contentType || !contentType.includes('application/json')) {
      console.error('Resposta não é JSON:', text.substring(0, 200));

      if (resposta.status === 500) {
        throw new Error('Erro interno do servidor. Verifique os logs do backend.');
      }

      if (resposta.status === 401) {
        removerToken();
        throw new Error('Não autorizado. Faça login novamente.');
      }

      throw new Error('Resposta da API não é JSON');
    }

    const dadosResposta = JSON.parse(text);

    if (!resposta.ok) {
      const mensagemErro = dadosResposta.message || dadosResposta.mensagem || "Erro na requisição";

      if (resposta.status === 401) {
        removerToken();
        throw new Error('Não autorizado. Faça login novamente.');
      }

      throw new Error(mensagemErro);
    }

    return dadosResposta;
  } catch (erro) {
    clearTimeout(timeoutId);
    console.error('Erro na requisição:', erro);

    if (erro.name === 'AbortError') {
      throw new Error('Tempo de conexão excedido. Verifique se o servidor está rodando.');
    }

    throw new Error(erro.message || "Erro de conexão com o servidor");
  }
};

export const servicoLocalizacao = {
  criar: (dadosLocalizacao) =>
    fazerRequisicao(`${URL_BASE}/localizacoes`, "POST", dadosLocalizacao),
  buscarPorId: (id) => fazerRequisicao(`${URL_BASE}/localizacoes/${id}`, "GET"),
  listarTodas: () => fazerRequisicao(`${URL_BASE}/localizacoes`, "GET"),
  atualizar: (id, dadosLocalizacao) =>
    fazerRequisicao(`${URL_BASE}/localizacoes/${id}`, "PUT", dadosLocalizacao),
  deletar: (id) => fazerRequisicao(`${URL_BASE}/localizacoes/${id}`, "DELETE"),
};

export const servicoUsuario = {
  criar: (dadosUsuario) =>
    fazerRequisicao(`${URL_BASE}/usuarios`, "POST", dadosUsuario),
  buscarPorId: (id) => fazerRequisicao(`${URL_BASE}/usuarios/${id}`, "GET"),
  listarTodos: () => fazerRequisicao(`${URL_BASE}/usuarios`, "GET"),
  atualizar: (id, dadosUsuario) =>
    fazerRequisicao(`${URL_BASE}/usuarios/${id}`, "PUT", dadosUsuario),
  deletar: (id) => fazerRequisicao(`${URL_BASE}/usuarios/${id}`, "DELETE"),
};

export const servicoProfissional = {
  criar: (dadosProfissional) =>
    fazerRequisicao(`${URL_BASE}/profissionais`, "POST", dadosProfissional),
  buscarPorId: (id) =>
    fazerRequisicao(`${URL_BASE}/profissionais/${id}`, "GET"),
  listarTodos: () => fazerRequisicao(`${URL_BASE}/profissionais`, "GET"),
  atualizar: (id, dadosProfissional) =>
    fazerRequisicao(
      `${URL_BASE}/profissionais/${id}`,
      "PUT",
      dadosProfissional
    ),
  deletar: (id) => fazerRequisicao(`${URL_BASE}/profissionais/${id}`, "DELETE"),
};

export const servicoAvaliacao = {
  criar: (dadosAvaliacao) =>
    fazerRequisicao(`${URL_BASE}/avaliacoes`, "POST", dadosAvaliacao),
  buscarPorId: (id) => fazerRequisicao(`${URL_BASE}/avaliacoes/${id}`, "GET"),
  listarTodas: () => fazerRequisicao(`${URL_BASE}/avaliacoes`, "GET"),
  atualizar: (id, dadosAvaliacao) =>
    fazerRequisicao(`${URL_BASE}/avaliacoes/${id}`, "PUT", dadosAvaliacao),
  deletar: (id) => fazerRequisicao(`${URL_BASE}/avaliacoes/${id}`, "DELETE"),
};

export const servicoHCurricular = {
  criar: (dadosHCurricular) =>
    fazerRequisicao(`${URL_BASE}/hcurriculares`, "POST", dadosHCurricular),
  buscarPorId: (id) =>
    fazerRequisicao(`${URL_BASE}/hcurriculares/${id}`, "GET"),
  listarTodos: () => fazerRequisicao(`${URL_BASE}/hcurriculares`, "GET"),
  atualizar: (id, dadosHCurricular) =>
    fazerRequisicao(`${URL_BASE}/hcurriculares/${id}`, "PUT", dadosHCurricular),
  deletar: (id) => fazerRequisicao(`${URL_BASE}/hcurriculares/${id}`, "DELETE"),
  buscarPorProfissional: (idProfissional) =>
    fazerRequisicao(`${URL_BASE}/hcurriculares/profissional/${idProfissional}`, "GET"),
};

export const servicoHProfissional = {
  criar: (dadosHProfissional) =>
    fazerRequisicao(`${URL_BASE}/hprofissionais`, "POST", dadosHProfissional),
  buscarPorId: (id) =>
    fazerRequisicao(`${URL_BASE}/hprofissionais/${id}`, "GET"),
  listarTodos: () => fazerRequisicao(`${URL_BASE}/hprofissionais`, "GET"),
  atualizar: (id, dadosHProfissional) =>
    fazerRequisicao(
      `${URL_BASE}/hprofissionais/${id}`,
      "PUT",
      dadosHProfissional
    ),
  deletar: (id) =>
    fazerRequisicao(`${URL_BASE}/hprofissionais/${id}`, "DELETE"),
  buscarPorProfissional: (idProfissional) =>
    fazerRequisicao(`${URL_BASE}/hprofissionais/profissional/${idProfissional}`, "GET"),
};

export const servicoCadastro = {
  cadastrarUsuario: async (dadosUsuario) => {
    try {
      const resposta = await fazerRequisicao(`${URL_BASE}/auth/cadastro`, "POST", {
        ...dadosUsuario,
        tipo: 'usuario'
      });

      if (resposta.token) {
        armazenarToken(resposta.token);
      }

      return resposta;
    } catch (erro) {
      throw new Error(`Erro no cadastro: ${erro.message}`);
    }
  },

  cadastrarProfissional: async (dadosProfissional) => {
    try {
      const resposta = await fazerRequisicao(`${URL_BASE}/auth/cadastro`, "POST", {
        ...dadosProfissional,
        tipo: 'profissional'
      });

      if (resposta.token) {
        armazenarToken(resposta.token);
      }

      return resposta;
    } catch (erro) {
      throw new Error(`Erro no cadastro: ${erro.message}`);
    }
  },

  cadastrarProfissionalComHistoricos: async (
    dadosProfissional,
    historicosCurriculares,
    historicosProfissionais
  ) => {
    try {
      // Primeiro cadastra o profissional
      const respostaProfissional = await servicoCadastro.cadastrarProfissional(dadosProfissional);
      const idProfissional = respostaProfissional.data._id;

      // Depois cadastra os históricos
      for (const hc of historicosCurriculares) {
        await servicoHCurricular.criar({
          ...hc,
          profissional: idProfissional,
        });
      }

      for (const hp of historicosProfissionais) {
        await servicoHProfissional.criar({
          ...hp,
          profissional: idProfissional,
        });
      }

      return respostaProfissional;
    } catch (erro) {
      throw new Error(`Erro no cadastro: ${erro.message}`);
    }
  },
};

export const servicoAuth = {
  login: async (email, senha) => {
    try {
      const resposta = await fazerRequisicao(`${URL_BASE}/auth/login`, "POST", {
        email,
        senha
      });

      if (resposta.token) {
        armazenarToken(resposta.token);
      }

      return resposta;
    } catch (erro) {
      throw new Error(`Erro no login: ${erro.message}`);
    }
  },

  buscarPerfilLogado: async (id) => {
    try {
      const resposta = await fazerRequisicao(`${URL_BASE}/auth/perfil/${id}`, "GET");
      return resposta;
    } catch (erro) {
      throw new Error(`Erro ao buscar perfil: ${erro.message}`);
    }
  },

  editarPerfilUsuario: async (id, dadosAtualizacao) => {
    try {
      // Garantir que campos sensíveis não sejam enviados
      const { _id, ...dadosSeguros } = dadosAtualizacao;

      const resposta = await fazerRequisicao(
        `${URL_BASE}/auth/perfil/${id}`,
        "PUT",
        dadosSeguros
      );
      return resposta;
    } catch (erro) {
      throw new Error(`Erro ao editar perfil de usuário: ${erro.message}`);
    }
  },

  editarPerfilProfissional: async (id, dadosAtualizacao) => {
    try {
      // Garantir que campos sensíveis não sejam enviados
      const { _id, senha, ...dadosSeguros } = dadosAtualizacao;

      const resposta = await fazerRequisicao(
        `${URL_BASE}/auth/perfil-profissional/${id}`,
        "PUT",
        dadosSeguros
      );
      return resposta;
    } catch (erro) {
      throw new Error(`Erro ao editar perfil profissional: ${erro.message}`);
    }
  },

  logout: async () => {
    try {
      removerToken();
      const resposta = await fazerRequisicao(
        `${URL_BASE}/auth/logout`,
        "POST"
      );
      return resposta;
    } catch (erro) {
      // Mesmo se houver erro no servidor, remove o token localmente
      removerToken();
      throw new Error(`Erro ao fazer logout: ${erro.message}`);
    }
  },

  verificarTipo: async (id) => {
    try {
      const resposta = await fazerRequisicao(
        `${URL_BASE}/auth/tipo/${id}`,
        "GET"
      );
      return resposta;
    } catch (erro) {
      throw new Error(`Erro ao verificar tipo de conta: ${erro.message}`);
    }
  },

  // Novas funções para gerenciamento de token
  obterToken,
  armazenarToken,
  removerToken,
  tokenExpirado
};