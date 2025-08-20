import { API_CONFIG } from '@config/apiConfig.js';

const BASE_URL = API_CONFIG.BASE_URL;

// Função utilitária para fazer requisições
const fazerRequisicao = async (url, metodo, dados = null) => {
  const opcoes = {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (dados) {
    opcoes.body = JSON.stringify(dados);
  }

  try {
    const resposta = await fetch(url, opcoes);
    const dadosResposta = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dadosResposta.message || 'Erro na requisição');
    }

    return dadosResposta;
  } catch (erro) {
    throw new Error(erro.message || 'Erro de conexão');
  }
};

// Serviços para Localização
export const localizacaoService = {
  criar: (dadosLocalizacao) => fazerRequisicao(`${BASE_URL}/localizacoes`, 'POST', dadosLocalizacao),
  buscarPorId: (id) => fazerRequisicao(`${BASE_URL}/localizacoes/${id}`, 'GET'),
  listarTodas: () => fazerRequisicao(`${BASE_URL}/localizacoes`, 'GET'),
  atualizar: (id, dadosLocalizacao) => fazerRequisicao(`${BASE_URL}/localizacoes/${id}`, 'PUT', dadosLocalizacao),
  deletar: (id) => fazerRequisicao(`${BASE_URL}/localizacoes/${id}`, 'DELETE'),
};

// Serviços para Usuário
export const usuarioService = {
  criar: (dadosUsuario) => fazerRequisicao(`${BASE_URL}/usuarios`, 'POST', dadosUsuario),
  buscarPorId: (id) => fazerRequisicao(`${BASE_URL}/usuarios/${id}`, 'GET'),
  listarTodos: () => fazerRequisicao(`${BASE_URL}/usuarios`, 'GET'),
  atualizar: (id, dadosUsuario) => fazerRequisicao(`${BASE_URL}/usuarios/${id}`, 'PUT', dadosUsuario),
  deletar: (id) => fazerRequisicao(`${BASE_URL}/usuarios/${id}`, 'DELETE'),
};

// Serviços para Profissional
export const profissionalService = {
  criar: (dadosProfissional) => fazerRequisicao(`${BASE_URL}/profissionais`, 'POST', dadosProfissional),
  buscarPorId: (id) => fazerRequisicao(`${BASE_URL}/profissionais/${id}`, 'GET'),
  listarTodos: () => fazerRequisicao(`${BASE_URL}/profissionais`, 'GET'),
  atualizar: (id, dadosProfissional) => fazerRequisicao(`${BASE_URL}/profissionais/${id}`, 'PUT', dadosProfissional),
  deletar: (id) => fazerRequisicao(`${BASE_URL}/profissionais/${id}`, 'DELETE'),
};

// Serviços para Avaliação
export const avaliacaoService = {
  criar: (dadosAvaliacao) => fazerRequisicao(`${BASE_URL}/avaliacoes`, 'POST', dadosAvaliacao),
  buscarPorId: (id) => fazerRequisicao(`${BASE_URL}/avaliacoes/${id}`, 'GET'),
  listarTodas: () => fazerRequisicao(`${BASE_URL}/avaliacoes`, 'GET'),
  atualizar: (id, dadosAvaliacao) => fazerRequisicao(`${BASE_URL}/avaliacoes/${id}`, 'PUT', dadosAvaliacao),
  deletar: (id) => fazerRequisicao(`${BASE_URL}/avaliacoes/${id}`, 'DELETE'),
};

// Serviço especializado para cadastro
export const cadastroService = {
  cadastrarUsuario: async (dadosUsuario, dadosLocalizacao) => {
    try {
      // Primeiro cria a localização
      const localizacaoResposta = await localizacaoService.criar(dadosLocalizacao);
      
      // Depois cria o usuário com a referência da localização
      const usuarioResposta = await usuarioService.criar({
        ...dadosUsuario,
        localizacao: localizacaoResposta.data._id
      });
      
      return usuarioResposta;
    } catch (erro) {
      throw new Error(`Erro no cadastro: ${erro.message}`);
    }
  },

  cadastrarProfissional: async (dadosProfissional, dadosLocalizacao) => {
    try {
      // Primeiro cria a localização
      const localizacaoResposta = await localizacaoService.criar(dadosLocalizacao);
      
      // Depois cria o profissional com a referência da localização
      const profissionalResposta = await profissionalService.criar({
        ...dadosProfissional,
        localizacao: localizacaoResposta.data._id
      });
      
      return profissionalResposta;
    } catch (erro) {
      throw new Error(`Erro no cadastro: ${erro.message}`);
    }
  }
};