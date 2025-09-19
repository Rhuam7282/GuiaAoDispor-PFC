import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Rota raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo à API do Guia ao Dispor!');
});

// Rotas da API
const apiRouter = express.Router();

const validarObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
};

// Rotas para Localização
apiRouter.get('/localizacoes', async (req, res) => {
    try {
        const localizacoes = await Localizacao.find();
        res.status(200).json({ status: 'sucesso', data: localizacoes });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

apiRouter.post('/localizacoes', async (req, res) => {
    try {
        const novaLocalizacao = await Localizacao.create(req.body);
        res.status(201).json({ status: 'sucesso', data: novaLocalizacao });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

// Rotas para Profissionais
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

apiRouter.post('/profissionais', async (req, res) => {
    try {
        const novoProfissional = await Profissional.create(req.body);
        res.status(201).json({ status: 'sucesso', data: novoProfissional });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.put('/profissionais/:id', async (req, res) => {
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

apiRouter.delete('/profissionais/:id', async (req, res) => {
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
        const novoUsuario = await Usuario.create(req.body);
        res.status(201).json({ status: 'sucesso', data: novoUsuario });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.put('/usuarios/:id', async (req, res) => {
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

apiRouter.delete('/usuarios/:id', async (req, res) => {
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

apiRouter.post('/avaliacoes', async (req, res) => {
    try {
        const novaAvaliacao = await Avaliacao.create(req.body);
        res.status(201).json({ status: 'sucesso', data: novaAvaliacao });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.put('/avaliacoes/:id', async (req, res) => {
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

apiRouter.delete('/avaliacoes/:id', async (req, res) => {
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

apiRouter.post('/hcurriculares', async (req, res) => {
    try {
        const novoHCurricular = await HCurricular.create(req.body);
        res.status(201).json({ status: 'sucesso', data: novoHCurricular });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.put('/hcurriculares/:id', async (req, res) => {
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

apiRouter.delete('/hcurriculares/:id', async (req, res) => {
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

apiRouter.post('/hprofissionais', async (req, res) => {
    try {
        const novoHProfissional = await HProfissional.create(req.body);
        res.status(201).json({ status: 'sucesso', data: novoHProfissional });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

apiRouter.put('/hprofissionais/:id', async (req, res) => {
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

apiRouter.delete('/hprofissionais/:id', async (req, res) => {
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
apiRouter.put('/auth/perfil/:id', async (req, res) => {
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
apiRouter.post('/auth/logout', async (req, res) => {
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

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
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
            return res.status(401).json({ 
                status: 'erro', 
                message: 'Credenciais inválidas' 
            });
        }

        // Verificar senha (em produção, usar hash)
        if (usuario.senha !== senha) {
            return res.status(401).json({ 
                status: 'erro', 
                message: 'Credenciais inválidas' 
            });
        }

        // Remover senha da resposta
        const usuarioResposta = usuario.toObject();
        delete usuarioResposta.senha;

        res.status(200).json({ 
            status: 'sucesso', 
            data: usuarioResposta,
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
apiRouter.get('/auth/perfil/:id', async (req, res) => {
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
        // Remover senha da resposta
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

