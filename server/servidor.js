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
app.use(cors({
  origin: ['http://localhost:5173', 'https://5173-iwnktope84q4hpntmr0kr-531a31c1.manusvm.computer'],
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));

// Conexão com MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('✅ Conexão com o MongoDB estabelecida!'))
    .catch(err => console.error('❌ Erro ao conectar com o MongoDB:', err));

// Middleware para verificar JWT (Melhorado)
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
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

// Rota raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo à API do Guia ao Dispor!');
});

// Rotas da API
const apiRouter = express.Router();

const validarObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
};

// Função para gerar token JWT
const gerarToken = (dadosUsuario) => {
  return jwt.sign(
    { 
      _id: dadosUsuario._id, 
      email: dadosUsuario.email,
      tipo: dadosUsuario.tipo || 'usuario'
    }, 
    process.env.JWT_SECRET || '7282',
    { expiresIn: '7d' }
  );
};

// Rotas de Autenticação
apiRouter.post('/auth/validar-email', async (req, res) => {
  try {
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
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  try {
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
        return res.status(401).json({ 
          status: 'erro', 
          message: 'Credenciais inválidas' 
        });
      }

      const senhaValida = await bcrypt.compare(senha, profissional.senha);
      if (!senhaValida) {
        return res.status(401).json({ 
          status: 'erro', 
          message: 'Credenciais inválidas' 
        });
      }

      const token = gerarToken({
        _id: profissional._id,
        email: profissional.email,
        tipo: 'profissional'
      });

      const profissionalResposta = profissional.toObject();
      delete profissionalResposta.senha;

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
      return res.status(401).json({ 
        status: 'erro', 
        message: 'Credenciais inválidas' 
      });
    }

    const token = gerarToken({
      _id: usuario._id,
      email: usuario.email,
      tipo: 'usuario'
    });

    const usuarioResposta = usuario.toObject();
    delete usuarioResposta.senha;

    res.status(200).json({ 
      status: 'sucesso', 
      data: usuarioResposta,
      token,
      message: 'Login realizado com sucesso'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// Rotas para Usuários (COM TOKEN NO REGISTRO)
apiRouter.post('/usuarios', async (req, res) => {
  try {
    const { email, senha, ...outrosDados } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Formato de email inválido' 
      });
    }

    if (senha.length < 8) {
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
    const token = gerarToken({
      _id: novoUsuario._id,
      email: novoUsuario.email,
      tipo: 'usuario'
    });

    const usuarioResposta = novoUsuario.toObject();
    delete usuarioResposta.senha;
    
    res.status(201).json({ 
      status: 'sucesso', 
      data: usuarioResposta,
      token, // ✅ Token incluído na resposta
      message: 'Usuário registrado com sucesso'
    });
  } catch (error) {
    res.status(400).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

// Rotas para Profissionais (COM TOKEN NO REGISTRO)
apiRouter.post('/profissionais', async (req, res) => {
  try {
    const { email, senha, ...outrosDados } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Formato de email inválido' 
      });
    }

    if (senha.length < 8) {
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
    const token = gerarToken({
      _id: novoProfissional._id,
      email: novoProfissional.email,
      tipo: 'profissional'
    });

    const profissionalResposta = novoProfissional.toObject();
    delete profissionalResposta.senha;
    
    res.status(201).json({ 
      status: 'sucesso', 
      data: profissionalResposta,
      token, // ✅ Token incluído na resposta
      message: 'Profissional registrado com sucesso'
    });
  } catch (error) {
    res.status(400).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});



apiRouter.put('/profissionais/:id', verificarToken, async (req, res) => {
    try {
        const profissional = await Profissional.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('localizacao');
        
        if (!profissional) {
            return res.status(404).json({ status: 'erro', message: 'Profissional não encontrado' });
        }
        
        res.status(200).json({ status: 'sucesso', data: profissional });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.delete('/profissionais/:id', verificarToken, async (req, res) => {
    try {
        const profissional = await Profissional.findByIdAndDelete(req.params.id);
        
        if (!profissional) {
            return res.status(404).json({ status: 'erro', message: 'Profissional não encontrado' });
        }
        
        res.status(200).json({ status: 'sucesso', message: 'Profissional deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

// Rotas para Usuários
apiRouter.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find().populate('localizacao');
        res.status(200).json({ status: 'sucesso', data: usuarios });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

apiRouter.get('/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).populate('localizacao');
        if (!usuario) {
            return res.status(404).json({ status: 'erro', message: 'Usuário não encontrado' });
        }
        res.status(200).json({ status: 'sucesso', data: usuario });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

apiRouter.post('/usuarios', async (req, res) => {
  try {
    const { email, senha, ...outrosDados } = req.body;

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Formato de email inválido' 
      });
    }

    // Validar comprimento da senha
    if (senha.length < 8) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'A senha deve ter pelo menos 8 caracteres' 
      });
    }

    // Verificar si email já existe
    const usuarioExistente = await Usuario.findOne({ email });
    const profissionalExistente = await Profissional.findOne({ email });

    if (usuarioExistente || profissionalExistente) {
      return res.status(400).json({ 
        status: 'erro', 
        message: 'Email já está em uso' 
      });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = await Usuario.create({
      ...outrosDados,
      email,
      senha: senhaHash
    });
    
    // Remover senha da resposta
    const usuarioResposta = novoUsuario.toObject();
    delete usuarioResposta.senha;
    
    res.status(201).json({ 
      status: 'sucesso', 
      data: usuarioResposta 
    });
  } catch (error) {
    res.status(400).json({ 
      status: 'erro', 
      message: error.message 
    });
  }
});

apiRouter.put('/usuarios/:id', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('localizacao');
        
        if (!usuario) {
            return res.status(404).json({ status: 'erro', message: 'Usuário não encontrado' });
        }
        
        res.status(200).json({ status: 'sucesso', data: usuario });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.delete('/usuarios/:id', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);
        
        if (!usuario) {
            return res.status(404).json({ status: 'erro', message: 'Usuário não encontrado' });
        }
        
        res.status(200).json({ status: 'sucesso', message: 'Usuário deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

apiRouter.get('/profissionais', async (req, res) => {
    try {
        const profissionais = await Profissional.find().populate('localizacao');
        res.status(200).json({ status: 'sucesso', data: profissionais });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

apiRouter.get('/profissionais/:id', async (req, res) => {
    try {
        const profissional = await Profissional.findById(req.params.id).populate('localizacao');
        if (!profissional) {
            return res.status(404).json({ status: 'erro', message: 'Profissional não encontrado' });
        }
        res.status(200).json({ status: 'sucesso', data: profissional });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});


// Rotas para Avaliações
apiRouter.get('/avaliacoes', async (req, res) => {
    try {
        const avaliacoes = await Avaliacao.find()
            .populate('usuario')
            .populate('profissional');
        res.status(200).json({ status: 'sucesso', data: avaliacoes });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

apiRouter.get('/avaliacoes/:id', async (req, res) => {
    try {
        const avaliacao = await Avaliacao.findById(req.params.id)
            .populate('usuario')
            .populate('profissional');
            
        if (!avaliacao) {
            return res.status(404).json({ status: 'erro', message: 'Avaliação não encontrada' });
        }
        res.status(200).json({ status: 'sucesso', data: avaliacao });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

apiRouter.post('/avaliacoes', verificarToken, async (req, res) => {
    try {
        const novaAvaliacao = await Avaliacao.create(req.body);
        res.status(201).json({ status: 'sucesso', data: novaAvaliacao });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.put('/avaliacoes/:id', verificarToken, async (req, res) => {
    try {
        const avaliacao = await Avaliacao.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('usuario')
        .populate('profissional');
        
        if (!avaliacao) {
            return res.status(404).json({ status: 'erro', message: 'Avaliação não encontrada' });
        }
        
        res.status(200).json({ status: 'sucesso', data: avaliacao });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.delete('/avaliacoes/:id', verificarToken, async (req, res) => {
    try {
        const avaliacao = await Avaliacao.findByIdAndDelete(req.params.id);
        
        if (!avaliacao) {
            return res.status(404).json({ status: 'erro', message: 'Avaliação não encontrada' });
        }
        
        res.status(200).json({ status: 'sucesso', message: 'Avaliação deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

// Rotas para HCurricular
apiRouter.get('/hcurriculares', async (req, res) => {
    try {
        const hcurriculares = await HCurricular.find().populate('profissional');
        res.status(200).json({ status: 'sucesso', data: hcurriculares });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

apiRouter.get('/hcurriculares/:id', async (req, res) => {
    try {
        const hcurricular = await HCurricular.findById(req.params.id).populate('profissional');
        if (!hcurricular) {
            return res.status(404).json({ status: 'erro', message: 'H. Curricular não encontrado' });
        }
        res.status(200).json({ status: 'sucesso', data: hcurricular });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

apiRouter.post('/hcurriculares', verificarToken, async (req, res) => {
    try {
        const novoHCurricular = await HCurricular.create(req.body);
        res.status(201).json({ status: 'sucesso', data: novoHCurricular });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.put('/hcurriculares/:id', verificarToken, async (req, res) => {
    try {
        const hcurricular = await HCurricular.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('profissional');
        
        if (!hcurricular) {
            return res.status(404).json({ status: 'erro', message: 'H. Curricular não encontrado' });
        }
        
        res.status(200).json({ status: 'sucesso', data: hcurricular });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.delete('/hcurriculares/:id', verificarToken, async (req, res) => {
    try {
        const hcurricular = await HCurricular.findByIdAndDelete(req.params.id);
        
        if (!hcurricular) {
            return res.status(404).json({ status: 'erro', message: 'H. Curricular não encontrado' });
        }
        
        res.status(200).json({ status: 'sucesso', message: 'H. Curricular deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

// Rotas para HProfissional
apiRouter.get('/hprofissionais', async (req, res) => {
    try {
        const hprofissionais = await HProfissional.find().populate('profissional');
        res.status(200).json({ status: 'sucesso', data: hprofissionais });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

apiRouter.get('/hprofissionais/:id', async (req, res) => {
    try {
        const hprofissional = await HProfissional.findById(req.params.id).populate('profissional');
        if (!hprofissional) {
            return res.status(404).json({ status: 'erro', message: 'H. Profissional não encontrado' });
        }
        res.status(200).json({ status: 'sucesso', data: hprofissional });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

apiRouter.post('/hprofissionais', verificarToken, async (req, res) => {
    try {
        const novoHProfissional = await HProfissional.create(req.body);
        res.status(201).json({ status: 'sucesso', data: novoHProfissional });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.put('/hprofissionais/:id', verificarToken, async (req, res) => {
    try {
        const hprofissional = await HProfissional.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('profissional');
        
        if (!hprofissional) {
            return res.status(404).json({ status: 'erro', message: 'H. Profissional não encontrado' });
        }
        
        res.status(200).json({ status: 'sucesso', data: hprofissional });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.delete('/hprofissionais/:id', verificarToken, async (req, res) => {
    try {
        const hprofissional = await HProfissional.findByIdAndDelete(req.params.id);
        
        if (!hprofissional) {
            return res.status(404).json({ status: 'erro', message: 'H. Profissional não encontrado' });
        }
        
        res.status(200).json({ status: 'sucesso', message: 'H. Profissional deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

// Rota para editar perfil do usuário
apiRouter.put('/auth/perfil/:id', verificarToken, async (req, res) => {
    console.log(`✏️ Requisição PUT para editar perfil: ${req.params.id}`);
    if (!validarObjectId(req.params.id)) {
      console.log(`❌ ID inválido: ${req.params.id}`);
      return res.status(400).json({ 
        status: 'erro', 
        message: 'ID de usuário inválido' 
      });
    }
    
    try {
        const { senha, ...camposAtualizacao } = req.body;
        
        // Remover _id se presente para evitar tentativa de alteração
        delete camposAtualizacao._id;
        
        console.log(`📝 Campos para atualização:`, camposAtualizacao);
        
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
        
        // Remover senha da resposta
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

// Rota para logout (apenas para logs)
apiRouter.post('/auth/logout', verificarToken, async (req, res) => {
    console.log(`🚪 Requisição de logout recebida`);
    try {
        // Em uma implementação real, aqui poderíamos invalidar tokens JWT
        // ou limpar sessões. Como estamos usando autenticação simples,
        // apenas registramos o logout para fins de auditoria.
        
        const { usuarioId } = req.body;
        
        if (usuarioId) {
            console.log(`👋 Usuário ${usuarioId} realizou logout`);
        }
        
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

// Montar o router na aplicação
app.use('/api', apiRouter);

// Rota para 404
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});


// Configuração para encerramento com Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🔴 Servidor encerrado pelo usuário (Ctrl+C)');
    mongoose.connection.close(() => {
        console.log('✅ Conexão com MongoDB fechada');
        server.close(() => {
            process.exit(0);
        });
    });
});
// Rotas de Autenticação
apiRouter.post('/auth/login', async (req, res) => {
    try {
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
                return res.status(401).json({ 
                    status: 'erro', 
                    message: 'Credenciais inválidas' 
                });
            }

            // Verificar senha com bcrypt
            const senhaValida = await bcrypt.compare(senha, profissional.senha);
            if (!senhaValida) {
                return res.status(401).json({ 
                    status: 'erro', 
                    message: 'Credenciais inválidas' 
                });
            }

            // Gerar token JWT
            const token = jwt.sign(
                { 
                    _id: profissional._id, 
                    email: profissional.email,
                    tipo: 'profissional'
                }, 
                process.env.JWT_SECRET || '7282',
                { expiresIn: '7d' }
            );

            // Remover senha da resposta
            const profissionalResposta = profissional.toObject();
            delete profissionalResposta.senha;

            res.status(200).json({ 
                status: 'sucesso', 
                data: profissionalResposta,
                token,
                message: 'Login realizado com sucesso'
            });
            return;
        }

        // Verificar senha com bcrypt
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ 
                status: 'erro', 
                message: 'Credenciais inválidas' 
            });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { 
                _id: usuario._id, 
                email: usuario.email,
                tipo: 'usuario'
            }, 
            process.env.JWT_SECRET || '7282',
            { expiresIn: '7d' }
        );

        // Remover senha da resposta
        const usuarioResposta = usuario.toObject();
        delete usuarioResposta.senha;

        res.status(200).json({ 
            status: 'sucesso', 
            data: usuarioResposta,
            token,
            message: 'Login realizado com sucesso'
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'erro', 
            message: error.message 
        });
    }
});

// Rota para buscar perfil do usuário logado
apiRouter.get('/auth/perfil/:id', verificarToken, async (req, res) => {
    console.log(`🔍 Requisição GET para /auth/perfil/${req.params.id}`);
    try {
        console.log(`📋 Buscando usuário com ID: ${req.params.id}`);
        const usuario = await Usuario.findById(req.params.id).populate('localizacao');
        
        if (!usuario) {
            console.log(`❌ Usuário não encontrado com ID: ${req.params.id}`);
            return res.status(404).json({ 
                status: 'erro', 
                message: 'Usuário não encontrado' 
            });
        }

        console.log(`✅ Usuário encontrado: ${usuario.nome}`);
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

// Rota para editar perfil do usuário
apiRouter.put('/auth/perfil/:id', verificarToken, async (req, res) => {
    console.log(`✏️ Requisição PUT para editar perfil: ${req.params.id}`);
    if (!validarObjectId(req.params.id)) {
      console.log(`❌ ID inválido: ${req.params.id}`);
      return res.status(400).json({ 
        status: 'erro', 
        message: 'ID de usuário inválido' 
      });
    }
    
    try {
        const { senha, ...camposAtualizacao } = req.body;
        
        delete camposAtualizacao._id;
        
        console.log(`📝 Campos para atualização:`, camposAtualizacao);
        
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
apiRouter.post('/auth/logout', verificarToken, async (req, res) => {
    console.log(`🚪 Requisição de logout recebida`);
    try {
        const { usuarioId } = req.body;
        
        if (usuarioId) {
            console.log(`👋 Usuário ${usuarioId} realizou logout`);
        }
        
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

// Montar o router na aplicação
app.use('/api', apiRouter);

// Rota para 404
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    console.log('\n🔴 Servidor encerrado pelo usuário (Ctrl+C)');
    mongoose.connection.close(() => {
        console.log('✅ Conexão com MongoDB fechada');
        server.close(() => {
            process.exit(0);
        });
    });
});
