import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs/promises';

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

// Configuração para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

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
    '/api/upload/imagem'
  ];
  
  if (publicRoutes.includes(req.path) && req.method === 'POST') {
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

// Aplicar middleware de autenticação
app.use(verificarToken);

// ========== CONFIGURAÇÃO DO UPLOAD DE IMAGENS ==========

// Criar diretório de uploads se não existir
const criarDiretorioUploads = async () => {
  try {
    const diretorioPerfis = path.join(__dirname, 'public', 'uploads', 'perfis');
    await fs.mkdir(diretorioPerfis, { recursive: true });
    console.log('✅ Diretório de uploads criado/verificado:', diretorioPerfis);
  } catch (error) {
    console.error('❌ Erro ao criar diretório de uploads:', error);
  }
};

criarDiretorioUploads();

// Configuração do Multer para upload em memória
const armazenamento = multer.memoryStorage();

const filtroArquivo = (req, file, cb) => {
  // Verificar se é imagem
  if (file.mimetype.startsWith('image/')) {
    // Tipos permitidos
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos JPG, PNG e WebP são permitidos!'), false);
    }
  } else {
    cb(new Error('Por favor, envie apenas imagens!'), false);
  }
};

const upload = multer({
  storage: armazenamento,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: filtroArquivo
});

// ========== ROTA DE UPLOAD DE IMAGEM ==========

app.post('/api/upload/imagem', upload.single('imagem'), async (req, res) => {
  try {
    console.log('📤 Iniciando upload de imagem...');
    
    if (!req.file) {
      return res.status(400).json({
        status: 'erro',
        message: 'Nenhuma imagem foi enviada.'
      });
    }

    // Validar se o usuário está autenticado
    if (!req.usuario || !req.usuario._id) {
      return res.status(401).json({
        status: 'erro',
        message: 'Usuário não autenticado.'
      });
    }

    const { buffer, originalname, mimetype } = req.file;
    const usuarioId = req.usuario._id;
    const tipoUsuario = req.usuario.tipo;

    console.log(`📷 Processando imagem para ${tipoUsuario}: ${usuarioId}`);

    // Gerar nome único para o arquivo
    const extensao = path.extname(originalname) || '.jpg';
    const nomeArquivo = `perfil-${usuarioId}-${Date.now()}${extensao}`;
    const caminhoCompleto = path.join(__dirname, 'public', 'uploads', 'perfis', nomeArquivo);

    // Redimensionar e otimizar a imagem
    const imagemProcessada = await sharp(buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ 
        quality: 80,
        progressive: true 
      })
      .toBuffer();

    // Salvar arquivo processado
    await fs.writeFile(caminhoCompleto, imagemProcessada);

    // Construir URL da imagem
    const urlImagem = `/uploads/perfis/${nomeArquivo}`;
    const urlCompleta = `${process.env.API_BASE_URL || 'http://localhost:3001'}${urlImagem}`;

    console.log('✅ Imagem processada e salva:', urlImagem);

    // Atualizar foto no perfil do usuário/profissional
    try {
      if (tipoUsuario === 'usuario') {
        await Usuario.findByIdAndUpdate(usuarioId, { foto: urlImagem });
        console.log('✅ Foto atualizada para usuário:', usuarioId);
      } else if (tipoUsuario === 'profissional') {
        await Profissional.findByIdAndUpdate(usuarioId, { foto: urlImagem });
        console.log('✅ Foto atualizada para profissional:', usuarioId);
      }
    } catch (error) {
      console.error('⚠️ Aviso: Imagem salva mas não foi possível atualizar o perfil:', error.message);
    }

    res.status(200).json({
      status: 'sucesso',
      data: {
        url: urlImagem,
        urlCompleta: urlCompleta,
        nomeArquivo: nomeArquivo,
        tamanho: imagemProcessada.length
      },
      message: 'Imagem enviada e processada com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro no upload de imagem:', error);
    res.status(500).json({
      status: 'erro',
      message: error.message || 'Erro interno no processamento da imagem'
    });
  }
});

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

// ========== ROTAS DE AUTENTICAÇÃO ==========

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

// ========== ROTAS PARA USUÁRIOS ==========

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

// ========== ROTAS PARA PROFISSIONAIS ==========

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

// ========== ROTAS PARA HISTÓRICOS CURRICULARES (HCurricular) ==========

// GET - Buscar todos os históricos curriculares
app.get('/api/hcurriculares', async (req, res) => {
  try {
    console.log('📚 Buscando todos os históricos curriculares');
    
    const { profissional } = req.query;
    let filtro = {};
    
    if (profissional) {
      filtro.profissional = profissional;
    }

    const historicos = await HCurricular.find(filtro).populate('profissional');
    
    res.status(200).json({ 
      status: 'sucesso', 
      data: historicos,
      total: historicos.length
    });
  } catch (error) {
    console.error('❌ Erro ao buscar históricos curriculares:', error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// GET - Buscar histórico curricular por ID
app.get('/api/hcurriculares/:id', async (req, res) => {
  try {
    console.log(`📚 Buscando histórico curricular: ${req.params.id}`);
    
    const historico = await HCurricular.findById(req.params.id).populate('profissional');
    
    if (!historico) {
      return res.status(404).json({ 
        status: 'erro', 
        message: 'Histórico curricular não encontrado' 
      });
    }

    res.status(200).json({ 
      status: 'sucesso', 
      data: historico 
    });
  } catch (error) {
    console.error('❌ Erro ao buscar histórico curricular:', error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// POST - Criar novo histórico curricular
app.post('/api/hcurriculares', async (req, res) => {
  try {
    console.log('📝 Criando novo histórico curricular');
    
    const { nome, desc, profissional } = req.body;

    // Validações
    if (!nome) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Nome é obrigatório' 
      });
    }

    if (!profissional) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Profissional é obrigatório' 
      });
    }

    // Verificar se profissional existe
    const profissionalExiste = await Profissional.findById(profissional);
    if (!profissionalExiste) {
      return res.status(404).json({ 
        status: 'erro', 
        message: 'Profissional não encontrado' 
      });
    }

    const novoHistorico = await HCurricular.create({
      nome,
      desc,
      profissional
    });

    await novoHistorico.populate('profissional');

    console.log(`✅ Histórico curricular criado: ${novoHistorico.nome}`);
    
    res.status(201).json({ 
      status: 'sucesso', 
      data: novoHistorico,
      message: 'Histórico curricular criado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao criar histórico curricular:', error);
    res.status(400).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// PUT - Atualizar histórico curricular
app.put('/api/hcurriculares/:id', async (req, res) => {
  try {
    console.log(`✏️ Atualizando histórico curricular: ${req.params.id}`);
    
    const { nome, desc } = req.body;

    const historicoAtualizado = await HCurricular.findByIdAndUpdate(
      req.params.id,
      { nome, desc },
      { new: true, runValidators: true }
    ).populate('profissional');

    if (!historicoAtualizado) {
      return res.status(404).json({ 
        status: 'erro', 
        message: 'Histórico curricular não encontrado' 
      });
    }

    console.log(`✅ Histórico curricular atualizado: ${historicoAtualizado.nome}`);
    
    res.status(200).json({ 
      status: 'sucesso', 
      data: historicoAtualizado,
      message: 'Histórico curricular atualizado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar histórico curricular:', error);
    res.status(400).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// DELETE - Deletar histórico curricular
app.delete('/api/hcurriculares/:id', async (req, res) => {
  try {
    console.log(`🗑️ Deletando histórico curricular: ${req.params.id}`);
    
    const historicoDeletado = await HCurricular.findByIdAndDelete(req.params.id);

    if (!historicoDeletado) {
      return res.status(404).json({ 
        status: 'erro', 
        message: 'Histórico curricular não encontrado' 
      });
    }

    console.log(`✅ Histórico curricular deletado: ${historicoDeletado.nome}`);
    
    res.status(200).json({ 
      status: 'sucesso', 
      message: 'Histórico curricular deletado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao deletar histórico curricular:', error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// ========== ROTAS PARA HISTÓRICOS PROFISSIONAIS (HProfissional) ==========

// GET - Buscar todos os históricos profissionais
app.get('/api/hprofissionais', async (req, res) => {
  try {
    console.log('💼 Buscando todos os históricos profissionais');
    
    const { profissional } = req.query;
    let filtro = {};
    
    if (profissional) {
      filtro.profissional = profissional;
    }

    const historicos = await HProfissional.find(filtro).populate('profissional');
    
    res.status(200).json({ 
      status: 'sucesso', 
      data: historicos,
      total: historicos.length
    });
  } catch (error) {
    console.error('❌ Erro ao buscar históricos profissionais:', error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// GET - Buscar histórico profissional por ID
app.get('/api/hprofissionais/:id', async (req, res) => {
  try {
    console.log(`💼 Buscando histórico profissional: ${req.params.id}`);
    
    const historico = await HProfissional.findById(req.params.id).populate('profissional');
    
    if (!historico) {
      return res.status(404).json({ 
        status: 'erro', 
        message: 'Histórico profissional não encontrado' 
      });
    }

    res.status(200).json({ 
      status: 'sucesso', 
      data: historico 
    });
  } catch (error) {
    console.error('❌ Erro ao buscar histórico profissional:', error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// POST - Criar novo histórico profissional
app.post('/api/hprofissionais', async (req, res) => {
  try {
    console.log('📝 Criando novo histórico profissional');
    
    const { nome, desc, foto, profissional } = req.body;

    // Validações
    if (!nome) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Nome é obrigatório' 
      });
    }

    if (!profissional) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Profissional é obrigatório' 
      });
    }

    // Verificar se profissional existe
    const profissionalExiste = await Profissional.findById(profissional);
    if (!profissionalExiste) {
      return res.status(404).json({ 
        status: 'erro', 
        message: 'Profissional não encontrado' 
      });
    }

    const novoHistorico = await HProfissional.create({
      nome,
      desc,
      foto,
      profissional
    });

    await novoHistorico.populate('profissional');

    console.log(`✅ Histórico profissional criado: ${novoHistorico.nome}`);
    
    res.status(201).json({ 
      status: 'sucesso', 
      data: novoHistorico,
      message: 'Histórico profissional criado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao criar histórico profissional:', error);
    res.status(400).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// PUT - Atualizar histórico profissional
app.put('/api/hprofissionais/:id', async (req, res) => {
  try {
    console.log(`✏️ Atualizando histórico profissional: ${req.params.id}`);
    
    const { nome, desc, foto } = req.body;

    const historicoAtualizado = await HProfissional.findByIdAndUpdate(
      req.params.id,
      { nome, desc, foto },
      { new: true, runValidators: true }
    ).populate('profissional');

    if (!historicoAtualizado) {
      return res.status(404).json({ 
        status: 'erro', 
        message: 'Histórico profissional não encontrado' 
      });
    }

    console.log(`✅ Histórico profissional atualizado: ${historicoAtualizado.nome}`);
    
    res.status(200).json({ 
      status: 'sucesso', 
      data: historicoAtualizado,
      message: 'Histórico profissional atualizado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar histórico profissional:', error);
    res.status(400).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// DELETE - Deletar histórico profissional
app.delete('/api/hprofissionais/:id', async (req, res) => {
  try {
    console.log(`🗑️ Deletando histórico profissional: ${req.params.id}`);
    
    const historicoDeletado = await HProfissional.findByIdAndDelete(req.params.id);

    if (!historicoDeletado) {
      return res.status(404).json({ 
        status: 'erro', 
        message: 'Histórico profissional não encontrado' 
      });
    }

    console.log(`✅ Histórico profissional deletado: ${historicoDeletado.nome}`);
    
    res.status(200).json({ 
      status: 'sucesso', 
      message: 'Histórico profissional deletado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao deletar histórico profissional:', error);
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// ========== ROTAS PARA LOCALIZAÇÕES ==========

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

// ========== OUTRAS ROTAS ==========

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