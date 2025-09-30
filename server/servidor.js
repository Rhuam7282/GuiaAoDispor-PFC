import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Configuração do dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoEnv = path.resolve(__dirname, '.env');
dotenv.config({ path: caminhoEnv });

// Importar todos os modelos
import Localizacao from './modelos/localizacao.js';
import Profissional from './modelos/profissional.js';
import Usuario from './modelos/usuario.js';
import Avaliacao from './modelos/avaliacao.js';
import HCurricular from './modelos/hcurricular.js';
import HProfissional from './modelos/hprofissional.js';

const app = express();

// Configuração CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Conexão com MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/guiaaodispor';
console.log('🔗 Tentando conectar ao MongoDB...');

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Conexão com o MongoDB estabelecida!'))
    .catch(err => {
      console.error('❌ Erro ao conectar com o MongoDB:', err);
    });

// Middleware de logging
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path}`, req.body ? JSON.stringify(req.body).substring(0, 200) : '');
  next();
});

// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Rotas públicas que não precisam de token
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/validar-email',
    '/api/usuarios',
    '/api/profissionais',
    '/api/localizacoes',
    '/health',
    '/api/health',
    '/'
  ];
  
  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/api/profissionais' && req.method === 'GET') return true;
    if (req.path.startsWith(route) && (req.method === 'POST' || req.method === 'GET')) {
      return true;
    }
    return false;
  });

  if (isPublicRoute) {
    return next();
  }

  if (!token) {
    return res.status(401).json({ 
      status: 'erro', 
      message: 'Acesso negado. Token não fornecido.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '7282');
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error('❌ Erro na verificação do token:', error.message);
    return res.status(401).json({ 
      status: 'erro', 
      message: 'Token inválido ou expirado.' 
    });
  }
};

// ========== ROTAS PÚBLICAS (ANTES DO MIDDLEWARE) ==========

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bem-vindo à API do Guia ao Dispor!',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'
  });
});

// ========== ROTA PÚBLICA PARA PROFISSIONAIS ==========

app.get('/api/profissionais', async (req, res) => {
  try {
    console.log('🔍 Buscando profissionais...');
    
    // Primeiro, tenta buscar do MongoDB
    let profissionais = [];
    
    // Verifica se há profissionais no banco
    const count = await Profissional.countDocuments();
    console.log(`📊 Profissionais no banco: ${count}`);
    
    if (count > 0) {
      // Busca profissionais reais
      profissionais = await Profissional.find({})
        .populate('localizacao')
        .select('-senha')
        .lean();
      
      console.log(`✅ Encontrados ${profissionais.length} profissionais no banco`);
    } else {
      // Se não há profissionais, cria alguns de exemplo
      console.log('📝 Criando profissionais de exemplo...');
      
      // Cria localização exemplo
      const localizacao = await Localizacao.create({
        nome: 'São Paulo',
        cidade: 'São Paulo',
        estado: 'SP'
      });
      
      // Cria profissionais exemplo
      await Profissional.create([
        {
          nome: 'Maria Silva',
          desc: '10 anos de experiência em enfermagem geriátrica',
          email: 'maria@exemplo.com',
          senha: await bcrypt.hash('senha123', 10),
          localizacao: localizacao._id
        },
        {
          nome: 'João Santos',
          desc: '5 anos como cuidador de idosos', 
          email: 'joao@exemplo.com',
          senha: await bcrypt.hash('senha123', 10),
          localizacao: localizacao._id
        }
      ]);
      
      // Busca os profissionais criados
      profissionais = await Profissional.find({})
        .populate('localizacao')
        .select('-senha')
        .lean();
    }

    // Formata os dados
    const profissionaisFormatados = profissionais.map((prof) => {
      return {
        _id: prof._id,
        imagem: prof.foto || '/imagens/mulher.png',
        nome: prof.nome || 'Nome não informado',
        localizacao: prof.localizacao ? 
          `${prof.localizacao.nome || ''} ${prof.localizacao.cidade || ''} ${prof.localizacao.estado || ''}`.trim() 
          : 'Local não informado',
        experiencia: prof.desc || 'Experiência não informada'
      };
    });

    res.status(200).json(profissionaisFormatados);

  } catch (error) {
    console.error('❌ Erro ao buscar profissionais:', error);
    
    // Fallback: retorna dados mock em caso de erro
    const profissionaisMock = [
      {
        _id: "1",
        imagem: "/imagens/mulher.png",
        nome: "Ana Silva",
        localizacao: "São Paulo, SP",
        experiencia: "Enfermeira com 5 anos de experiência"
      },
      {
        _id: "2", 
        imagem: "/imagens/homem.png",
        nome: "Carlos Santos",
        localizacao: "Rio de Janeiro, RJ", 
        experiencia: "Cuidador especializado"
      }
    ];
    
    res.status(200).json(profissionaisMock);
  }
});

// ========== ROTAS DE AUTENTICAÇÃO (PÚBLICAS) ==========

// Rota para validar email
app.post('/api/auth/validar-email', async (req, res) => {
  try {
    console.log('📧 Validando email:', req.body.email);
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Email é obrigatório' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Formato de email inválido' 
      });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    const profissionalExistente = await Profissional.findOne({ email });

    if (usuarioExistente || profissionalExistente) {
      return res.status(200).json({ 
        status: 'sucesso', 
        valido: false,
        message: 'Email já está em uso' 
      });
    }

    res.status(200).json({ 
      status: 'sucesso', 
      valido: true,
      message: 'Email disponível' 
    });
  } catch (error) {
    console.error('❌ Erro ao validar email:', error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// Rota de Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Tentativa de login:', req.body.email);
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Buscar usuário por email
    const usuario = await Usuario.findOne({ email }).populate('localizacao');
    
    if (!usuario) {
      // Se não encontrar no modelo Usuario, buscar no Profissional
      const profissional = await Profissional.findOne({ email }).populate('localizacao');
      if (!profissional) {
        console.log('❌ Usuário não encontrado:', email);
        return res.status(401).json({ 
          status: 'erro', 
          message: 'Credenciais inválidas' 
        });
      }

      const senhaValida = await bcrypt.compare(senha, profissional.senha);
      if (!senhaValida) {
        console.log('❌ Senha inválida para profissional:', email);
        return res.status(401).json({ 
          status: 'erro', 
          message: 'Credenciais inválidas' 
        });
      }

      const token = jwt.sign(
        { 
          _id: profissional._id, 
          email: profissional.email,
          tipo: 'profissional'
        }, 
        process.env.JWT_SECRET || '7282',
        { expiresIn: '7d' }
      );

      const profissionalResposta = profissional.toObject();
      delete profissionalResposta.senha;

      console.log('✅ Login profissional bem-sucedido:', profissional.email);
      
      res.status(200).json({ 
        status: 'sucesso', 
        data: profissionalResposta,
        token,
        message: 'Login realizado com sucesso'
      });
      return;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      console.log('❌ Senha inválida para usuário:', email);
      return res.status(401).json({ 
        status: 'erro', 
        message: 'Credenciais inválidas' 
      });
    }

    const token = jwt.sign(
      { 
        _id: usuario._id, 
        email: usuario.email,
        tipo: 'usuario'
      }, 
      process.env.JWT_SECRET || '7282',
      { expiresIn: '7d' }
    );

    const usuarioResposta = usuario.toObject();
    delete usuarioResposta.senha;

    console.log('✅ Login usuário bem-sucedido:', usuario.email);
    
    res.status(200).json({ 
      status: 'sucesso', 
      data: usuarioResposta,
      token,
      message: 'Login realizado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// ========== ROTAS DE CRIAÇÃO (PÚBLICAS) ==========

app.post('/api/usuarios', async (req, res) => {
  try {
    console.log('👤 Criando novo usuário:', req.body.email);
    const { email, senha, ...outrosDados } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Formato de email inválido' 
      });
    }

    if (!senha || senha.length < 8) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'A senha deve ter pelo menos 8 caracteres' 
      });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    const profissionalExistente = await Profissional.findOne({ email });

    if (usuarioExistente || profissionalExistente) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Email já está em uso' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = await Usuario.create({
      ...outrosDados,
      email,
      senha: senhaHash
    });
    
    // Gerar token JWT após registro
    const token = jwt.sign(
      { 
        _id: novoUsuario._id, 
        email: novoUsuario.email,
        tipo: 'usuario'
      }, 
      process.env.JWT_SECRET || '7282',
      { expiresIn: '7d' }
    );

    const usuarioResposta = novoUsuario.toObject();
    delete usuarioResposta.senha;
    
    console.log('✅ Usuário criado com sucesso:', novoUsuario.email);
    
    res.status(201).json({ 
      status: 'sucesso', 
      data: usuarioResposta,
      token,
      message: 'Usuário registrado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    res.status(400).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

app.post('/api/profissionais', async (req, res) => {
  try {
    console.log('👨‍💼 Criando novo profissional:', req.body.email);
    const { email, senha, ...outrosDados } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Formato de email inválido' 
      });
    }

    if (!senha || senha.length < 8) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'A senha deve ter pelo menos 8 caracteres' 
      });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    const profissionalExistente = await Profissional.findOne({ email });

    if (usuarioExistente || profissionalExistente) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Email já está em uso' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoProfissional = await Profissional.create({
      ...outrosDados,
      email,
      senha: senhaHash
    });
    
    // Gerar token JWT após registro
    const token = jwt.sign(
      { 
        _id: novoProfissional._id, 
        email: novoProfissional.email,
        tipo: 'profissional'
      }, 
      process.env.JWT_SECRET || '7282',
      { expiresIn: '7d' }
    );

    const profissionalResposta = novoProfissional.toObject();
    delete profissionalResposta.senha;
    
    console.log('✅ Profissional criado com sucesso:', novoProfissional.email);
    
    res.status(201).json({ 
      status: 'sucesso', 
      data: profissionalResposta,
      token,
      message: 'Profissional registrado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao criar profissional:', error);
    res.status(400).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

app.post('/api/localizacoes', async (req, res) => {
  try {
    console.log('📍 Criando nova localização');
    const novaLocalizacao = await Localizacao.create(req.body);
    res.status(201).json({ 
      status: 'sucesso', 
      data: novaLocalizacao 
    });
  } catch (error) {
    console.error('❌ Erro ao criar localização:', error);
    res.status(400).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

app.get('/api/localizacoes/:id', async (req, res) => {
  try {
    const localizacao = await Localizacao.findById(req.params.id);
    if (!localizacao) {
      return res.status(404).json({ 
        status: 'erro', 
        message: 'Localização não encontrada' 
      });
    }
    res.status(200).json({ 
      status: 'sucesso', 
      data: localizacao 
    });
  } catch (error) {
    console.error('❌ Erro ao buscar localização:', error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// ========== APLICA MIDDLEWARE DE AUTENTICAÇÃO A PARTIR DAQUI ==========
app.use(verificarToken);

// ========== ROTAS PROTEGIDAS (APÓS MIDDLEWARE) ==========

// Rota para buscar perfil
app.get('/api/auth/perfil/:id', async (req, res) => {
  try {
    console.log('🔍 Buscando perfil do usuário:', req.params.id);
    const usuario = await Usuario.findById(req.params.id).populate('localizacao');
    
    if (!usuario) {
      // Tentar buscar como profissional
      const profissional = await Profissional.findById(req.params.id).populate('localizacao');
      if (!profissional) {
        return res.status(404).json({ 
          status: 'erro', 
          message: 'Usuário não encontrado' 
        });
      }

      const profissionalResposta = profissional.toObject();
      delete profissionalResposta.senha;
      
      return res.status(200).json({ 
        status: 'sucesso', 
        data: profissionalResposta 
      });
    }

    const usuarioResposta = usuario.toObject();
    delete usuarioResposta.senha;

    res.status(200).json({ 
      status: 'sucesso', 
      data: usuarioResposta 
    });
  } catch (error) {
    console.error(`💥 Erro ao buscar perfil:`, error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// Rota para editar perfil
app.put('/api/auth/perfil/:id', async (req, res) => {
  try {
    console.log(`✏️ Editando perfil: ${req.params.id}`);
    const { senha, ...camposAtualizacao } = req.body;
    
    delete camposAtualizacao._id;
    
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      camposAtualizacao,
      { new: true, runValidators: true }
    ).populate('localizacao');
    
    if (!usuarioAtualizado) {
      console.log(`❌ Usuário não encontrado para edição: ${req.params.id}`);
      return res.status(404).json({ 
        status: 'erro', 
        message: 'Usuário não encontrado' 
      });
    }

    console.log(`✅ Perfil atualizado: ${usuarioAtualizado.nome}`);
    
    const usuarioResposta = usuarioAtualizado.toObject();
    delete usuarioResposta.senha;

    res.status(200).json({ 
      status: 'sucesso', 
      data: usuarioResposta,
      message: 'Perfil atualizado com sucesso'
    });
  } catch (error) {
    console.error(`💥 Erro ao editar perfil:`, error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// Rota para logout
app.post('/api/auth/logout', async (req, res) => {
  try {
    console.log(`🚪 Logout realizado`);
    
    res.status(200).json({ 
      status: 'sucesso', 
      message: 'Logout realizado com sucesso' 
    });
  } catch (error) {
    console.error(`💥 Erro durante logout:`, error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// Rota para 404 - deve ser a última
app.use('*', (req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    status: 'erro',
    message: 'Rota não encontrada' 
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('💥 Erro não tratado:', error);
  res.status(500).json({
    status: 'erro',
    message: 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
    console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
});

// Configuração para encerramento gracioso
process.on('SIGINT', () => {
    console.log('\n🔴 Servidor encerrado pelo usuário (Ctrl+C)');
    mongoose.connection.close(() => {
        console.log('✅ Conexão com MongoDB fechada');
        server.close(() => {
            process.exit(0);
        });
    });
});