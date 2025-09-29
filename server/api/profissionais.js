import express from 'express';
import Profissional from '../modelos/profissional.js';
import Localizacao from '../modelos/localizacao.js';
import dbConnect from '../utils/dbConnect.js';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware de logging para todas as requisições
router.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Query params:', req.query);
  console.log('Body:', req.body);
  next();
});

// Validação básica dos parâmetros de query
const validarQueryParams = (req, res, next) => {
  const { limit, page } = req.query;
  
  if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    return res.status(400).json({
      error: 'Parâmetro inválido',
      message: 'O parâmetro "limit" deve ser um número entre 1 e 100'
    });
  }
  
  if (page && (isNaN(page) || page < 1)) {
    return res.status(400).json({
      error: 'Parâmetro inválido', 
      message: 'O parâmetro "page" deve ser um número maior que 0'
    });
  }
  
  next();
};

router.get('/', validarQueryParams, async (req, res) => {
  console.log('=== INICIANDO BUSCA DE PROFISSIONAIS ===');
  
  // Controle de tempo de execução
  const startTime = Date.now();
  let connectionEstablished = false;
  let queryExecuted = false;

  try {
    // 1. Verificar se os modelos estão carregados
    if (!Profissional || !Localizacao) {
      throw new Error('Modelos do MongoDB não foram carregados corretamente');
    }

    console.log('🔄 Conectando ao banco de dados...');
    
    // 2. Conectar ao banco com timeout
    const connectionPromise = dbConnect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout de conexão com o banco (10s)')), 10000);
    });

    await Promise.race([connectionPromise, timeoutPromise]);
    connectionEstablished = true;
    console.log('✅ Conexão com banco estabelecida');

    // 3. Verificar estado da conexão
    const connectionState = mongoose.connection.readyState;
    console.log('📊 Estado da conexão MongoDB:', getConnectionStateName(connectionState));
    
    if (connectionState !== 1) { // 1 = connected
      throw new Error(`Conexão com banco não está ativa. Estado: ${getConnectionStateName(connectionState)}`);
    }

    // 4. Verificar se a coleção existe
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'profissionals' || col.name === 'profissionais');
    
    if (!collectionExists) {
      console.warn('⚠️ Coleção de profissionais não encontrada. Criando dados de exemplo...');
      await criarDadosExemplo();
    }

    // 5. Construir query com parâmetros
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    console.log(`🔍 Buscando profissionais - página ${page}, limite ${limit}...`);
    
    const query = Profissional.find({});
    
    // 6. Executar consulta com timeout
    const queryPromise = query
      .populate('localizacao')
      .select('nome desc foto localizacao createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const queryTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout na consulta ao banco (15s)')), 15000);
    });

    const profissionais = await Promise.race([queryPromise, queryTimeoutPromise]);
    queryExecuted = true;

    console.log(`✅ Encontrados ${profissionais.length} profissionais`);

    // 7. Validar e formatar dados
    if (!Array.isArray(profissionais)) {
      throw new Error('Dados retornados não são um array');
    }

    const profissionaisFormatados = profissionais.map((prof, index) => {
      // Validar dados básicos
      if (!prof._id) {
        console.warn(`⚠️ Profissional sem ID no índice ${index}`);
      }

      return {
        _id: prof._id || `temp-${index}`,
        imagem: validarImagem(prof.foto) || '@recursos/imagens/mulher.png',
        nome: prof.nome || 'Nome não informado',
        localizacao: formatarLocalizacao(prof.localizacao),
        experiencia: prof.desc || 'Experiência não informada',
        createdAt: prof.createdAt || new Date()
      };
    });

    // 8. Log de performance
    const executionTime = Date.now() - startTime;
    console.log(`⏱️  Request finalizado em ${executionTime}ms`);

    // 9. Enviar resposta
    res.status(200).json({
      success: true,
      data: profissionaisFormatados,
      pagination: {
        page,
        limit,
        total: profissionaisFormatados.length,
        hasMore: profissionaisFormatados.length === limit
      },
      metadata: {
        executionTime: `${executionTime}ms`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    // 10. Tratamento robusto de erros
    const executionTime = Date.now() - startTime;
    console.error('❌ ERRO DETALHADO:', {
      message: error.message,
      stack: error.stack,
      connectionEstablished,
      queryExecuted,
      executionTime: `${executionTime}ms`
    });

    // Classificar o tipo de erro
    const errorResponse = classificarErro(error);
    
    res.status(errorResponse.status).json({
      success: false,
      error: errorResponse.error,
      message: errorResponse.message,
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          stack: error.stack,
          connectionEstablished,
          queryExecuted
        }
      }),
      metadata: {
        executionTime: `${executionTime}ms`,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// ===== FUNÇÕES AUXILIARES =====

function getConnectionStateName(state) {
  const states = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  return states[state] || `unknown (${state})`;
}

function classificarErro(error) {
  // Erros de banco de dados
  if (error.name === 'MongoNetworkError' || error.message.includes('network')) {
    return {
      status: 503,
      error: 'Serviço indisponível',
      message: 'Problema de conexão com o banco de dados'
    };
  }
  
  if (error.name === 'MongoTimeoutError' || error.message.includes('Timeout')) {
    return {
      status: 504,
      error: 'Timeout',
      message: 'A consulta demorou muito para responder'
    };
  }
  
  if (error.name === 'MongoError' && error.code === 13) {
    return {
      status: 403,
      error: 'Acesso negado',
      message: 'Sem permissão para acessar o banco de dados'
    };
  }
  
  // Erros de validação
  if (error.name === 'ValidationError') {
    return {
      status: 400,
      error: 'Dados inválidos',
      message: 'Erro na validação dos dados'
    };
  }
  
  // Erro padrão
  return {
    status: 500,
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Ocorreu um erro inesperado'
  };
}

function validarImagem(url) {
  if (!url) return null;
  
  // Validar URL básica
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const hasValidExtension = validExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  return hasValidExtension ? url : null;
}

function formatarLocalizacao(localizacao) {
  if (!localizacao) return 'Local não informado';
  
  if (typeof localizacao === 'string') {
    return localizacao;
  }
  
  if (localizacao.nome && localizacao.estado) {
    return `${localizacao.nome}, ${localizacao.estado}`;
  }
  
  if (localizacao.nome) {
    return localizacao.nome;
  }
  
  return 'Local não informado';
}

async function criarDadosExemplo() {
  try {
    console.log('📝 Criando dados de exemplo...');
    
    // Verificar se já existem profissionais
    const existingCount = await Profissional.countDocuments();
    if (existingCount > 0) {
      console.log(`✅ Já existem ${existingCount} profissionais no banco`);
      return;
    }
    
    // Criar localizações exemplo
    const locSP = await Localizacao.create({
      nome: 'São Paulo',
      estado: 'SP'
    });
    
    const locRJ = await Localizacao.create({
      nome: 'Rio de Janeiro', 
      estado: 'RJ'
    });
    
    // Criar profissionais exemplo
    await Profissional.create([
      {
        nome: 'Maria Silva',
        desc: '10 anos de experiência em enfermagem geriátrica',
        foto: '',
        localizacao: locSP._id
      },
      {
        nome: 'João Santos', 
        desc: '5 anos como cuidador de idosos',
        foto: '/imagens/homem.png',
        localizacao: locRJ._id
      }
    ]);
    
    console.log('✅ Dados de exemplo criados com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar dados exemplo:', error);
    throw error;
  }
}

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const health = {
      status: dbState === 1 ? 'healthy' : 'unhealthy',
      database: getConnectionStateName(dbState),
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
    
    res.status(dbState === 1 ? 200 : 503).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;