import { API_CONFIG } from '@config/apiConfig.js';

const URL_BASE = API_CONFIG.BASE_URL;

// Função para obter o token do localStorage
const obterToken = () => {
  return localStorage.getItem('token');
};

const fazerRequisicao = async (url, metodo, dados = null) => {
  const token = obterToken();
  const opcoes = {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Adicionar token ao header se disponível
  if (token) {
    opcoes.headers.Authorization = `Bearer ${token}`;
  }

  if (dados && (metodo === 'POST' || metodo === 'PUT')) {
    opcoes.body = JSON.stringify(dados);
  }

  try {
    console.log(`Fazendo requisição ${metodo} para: ${url}`);
    const resposta = await fetch(url, opcoes);
    
    const contentType = resposta.headers.get('content-type');
    
    const text = await resposta.text();
    
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Resposta não é JSON:', text.substring(0, 200));
      
      if (resposta.status === 500) {
        throw new Error('Erro interno do servidor. Verifique os logs do backend.');
      }
      
      throw new Error('Resposta da API não é JSON');
    }

    const dadosResposta = JSON.parse(text);

    if (!resposta.ok) {
      const mensagemErro =
        dadosResposta.message || dadosResposta.mensagem || "Erro na requisição";
      
      // Se for erro de autenticação, fazer logout
      if (resposta.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }
      
      throw new Error(mensagemErro);
    }

    return dadosResposta;
  } catch (erro) {
    console.error('Erro na requisição:', erro);
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
};

export const servicoCadastro = {
  validarEmail: async (email) => {
    try {
      const resposta = await fazerRequisicao(`${URL_BASE}/auth/validar-email`, "POST", { email });
      return resposta;
    } catch (erro) {
      console.error('Erro ao validar email:', erro);
      throw erro;
    }
  },

  cadastrarUsuario: async (dadosPerfil, dadosLocalizacao) => {
    try {
      // Primeiro criar a localização
      const respostaLocalizacao = await servicoLocalizacao.criar(dadosLocalizacao);
      const localizacaoId = respostaLocalizacao.data._id;
      
      // Depois criar o usuário com a referência à localização
      const dadosUsuario = {
        ...dadosPerfil,
        localizacao: localizacaoId
      };
      
      const respostaUsuario = await servicoUsuario.criar(dadosUsuario);
      return respostaUsuario;
    } catch (erro) {
      console.error('Erro ao cadastrar usuário:', erro);
      throw new Error(`Erro no cadastro: ${erro.message}`);
    }
  },

  cadastrarProfissional: async (dadosProfissional, dadosLocalizacao) => {
    try {
      const respostaLocalizacao = await servicoLocalizacao.criar(
        dadosLocalizacao
      );

      const respostaProfissional = await servicoProfissional.criar({
        ...dadosProfissional,
        localizacao: respostaLocalizacao.data._id
      });

      return respostaProfissional;
    } catch (erro) {
      throw new Error(`Erro no cadastro: ${erro.message}`);
    }
  },

  cadastrarProfissionalComHistoricos: async (
    dadosProfissional,
    dadosLocalizacao,
    historicosCurriculares,
    historicosProfissionais
  ) => {
    try {
      const respostaLocalizacao = await servicoLocalizacao.criar(
        dadosLocalizacao
      );
      const respostaProfissional = await servicoProfissional.criar({
        ...dadosProfissional,
        localizacao:
          respostaLocalizacao.data._id || respostaLocalizacao.dados._id,
      });
      const idProfissional =
        respostaProfissional.data._id || respostaProfissional.dados._id;
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
      
      // Salvar token no localStorage
      if (resposta.token) {
        localStorage.setItem('token', resposta.token);
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

  editarPerfil: async (id, dadosAtualizacao) => {
    try {
      const resposta = await fazerRequisicao(
        `${URL_BASE}/auth/perfil/${id}`, 
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
        `${URL_BASE}/auth/logout`, 
        "POST"
      );
      return resposta;
    } catch (erro) {
      throw new Error(`Erro ao fazer logout: ${erro.message}`);
    }
  }
};