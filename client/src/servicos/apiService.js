import { API_CONFIG } from '@config/apiConfig.js';

const URL_BASE = API_CONFIG.BASE_URL;

// Função utilitária para fazer requisições usando fetch
const fazerRequisicao = async (url, metodo, dados = null) => {
  const opcoes = {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (dados && (metodo === 'POST' || metodo === 'PUT')) {
    opcoes.body = JSON.stringify(dados);
  }

  try {
    console.log(`Fazendo requisição ${metodo} para: ${url}`);
    const resposta = await fetch(url, opcoes);
    
    // Verificar se a resposta é JSON
    const contentType = resposta.headers.get('content-type');
    
    // Se não for JSON, tentar obter o texto para debug
    const text = await resposta.text();
    
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Resposta não é JSON:', text.substring(0, 200));
      
      // Se for um erro 500, verificar se o servidor está rodando
      if (resposta.status === 500) {
        throw new Error('Erro interno do servidor. Verifique os logs do backend.');
      }
      
      throw new Error('Resposta da API não é JSON');
    }

    // Se for JSON, parsear a resposta
    const dadosResposta = JSON.parse(text);

    if (!resposta.ok) {
      const mensagemErro =
        dadosResposta.message || dadosResposta.mensagem || "Erro na requisição";
      throw new Error(mensagemErro);
    }

    return dadosResposta;
  } catch (erro) {
    console.error('Erro na requisição:', erro);
    throw new Error(erro.message || "Erro de conexão com o servidor");
  }
};

// Serviços para Localização
export const servicoLocalizacao = {
  criar: (dadosLocalizacao) =>
    fazerRequisicao(`${URL_BASE}/localizacoes`, "POST", dadosLocalizacao),
  buscarPorId: (id) => fazerRequisicao(`${URL_BASE}/localizacoes/${id}`, "GET"),
  listarTodas: () => fazerRequisicao(`${URL_BASE}/localizacoes`, "GET"),
  atualizar: (id, dadosLocalizacao) =>
    fazerRequisicao(`${URL_BASE}/localizacoes/${id}`, "PUT", dadosLocalizacao),
  deletar: (id) => fazerRequisicao(`${URL_BASE}/localizacoes/${id}`, "DELETE"),
};

// Serviços para Usuário
export const servicoUsuario = {
  criar: (dadosUsuario) =>
    fazerRequisicao(`${URL_BASE}/usuarios`, "POST", dadosUsuario),
  buscarPorId: (id) => fazerRequisicao(`${URL_BASE}/usuarios/${id}`, "GET"),
  listarTodos: () => fazerRequisicao(`${URL_BASE}/usuarios`, "GET"),
  atualizar: (id, dadosUsuario) =>
    fazerRequisicao(`${URL_BASE}/usuarios/${id}`, "PUT", dadosUsuario),
  deletar: (id) => fazerRequisicao(`${URL_BASE}/usuarios/${id}`, "DELETE"),
};

// Serviços para Profissional
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

// Serviços para Avaliação
export const servicoAvaliacao = {
  criar: (dadosAvaliacao) =>
    fazerRequisicao(`${URL_BASE}/avaliacoes`, "POST", dadosAvaliacao),
  buscarPorId: (id) => fazerRequisicao(`${URL_BASE}/avaliacoes/${id}`, "GET"),
  listarTodas: () => fazerRequisicao(`${URL_BASE}/avaliacoes`, "GET"),
  atualizar: (id, dadosAvaliacao) =>
    fazerRequisicao(`${URL_BASE}/avaliacoes/${id}`, "PUT", dadosAvaliacao),
  deletar: (id) => fazerRequisicao(`${URL_BASE}/avaliacoes/${id}`, "DELETE"),
};

// Serviços para HCurricular
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

// Serviços para HProfissional
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

// Serviço especializado para cadastro
export const servicoCadastro = {
  cadastrarUsuario: async (dadosUsuario, dadosLocalizacao) => {
    try {
      const respostaLocalizacao = await servicoLocalizacao.criar(
        dadosLocalizacao
      );
      const respostaUsuario = await servicoUsuario.criar({
        ...dadosUsuario,
        localizacao: respostaLocalizacao.data._id
      });
      return respostaUsuario;
    } catch (erro) {
      throw new Error(`Erro no cadastro: ${erro.mensagem}`);
    }
  },

  cadastrarProfissional: async (dadosProfissional, dadosLocalizacao) => {
    try {
      // Primeiro cria a localização
      const respostaLocalizacao = await servicoLocalizacao.criar(
        dadosLocalizacao
      );

      // Depois cria o profissional com a referência da localização
      const respostaProfissional = await servicoProfissional.criar({
        ...dadosProfissional,
        localizacao: respostaLocalizacao.data._id
      });

      return respostaProfissional;
    } catch (erro) {
      throw new Error(`Erro no cadastro: ${erro.mensagem}`);
    }
  },

  cadastrarProfissionalComHistoricos: async (
    dadosProfissional,
    dadosLocalizacao,
    historicosCurriculares,
    historicosProfissionais
  ) => {
    try {
      // Primeiro cria a localização
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
      // Cadastra cada histórico curricular
      for (const hc of historicosCurriculares) {
        await servicoHCurricular.criar({
          ...hc,
          profissional: idProfissional,
        });
      }

      // Cadastra cada histórico profissional
      for (const hp of historicosProfissionais) {
        await servicoHProfissional.criar({
          ...hp,
          profissional: idProfissional,
        });
      }

      return respostaProfissional;
    } catch (erro) {
      throw new Error(`Erro no cadastro: ${erro.mensagem}`);
    }
  },
};
