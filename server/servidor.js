import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Configuração do dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoEnv = path.resolve(__dirname, '.env');
dotenv.config({ path: caminhoEnv });

const JWT_SECRET = process.env.JWT_SECRET || '7282';

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

// Middleware para verificação de token
const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'erro', message: 'Token de acesso não fornecido' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: 'erro', message: 'Token inválido' });
    }
};

// Rota de cadastro
apiRouter.post('/auth/cadastro', async (req, res) => {
    try {
        const { nome, email, senha, tipo, ...outrosDados } = req.body;
        const usuarioExistente = await Usuario.findOne({ email });
        const profissionalExistente = await Profissional.findOne({ email });
        if (usuarioExistente || profissionalExistente) {
            return res.status(400).json({ status: 'erro', message: 'Email já cadastrado' });
        }
        const senhaHash = await bcrypt.hash(senha, 10);
        let novoUsuario;
        if (tipo === 'profissional') {
            novoUsuario = await Profissional.create({
                nome,
                email,
                senha: senhaHash,
                ...outrosDados
            });
        } else {
            novoUsuario = await Usuario.create({
                nome,
                email,
                senha: senhaHash,
                ...outrosDados
            });
        }
        const token = jwt.sign(
            { id: novoUsuario._id, tipo: tipo, email: novoUsuario.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        const usuarioResposta = novoUsuario.toObject();
        delete usuarioResposta.senha;
        res.status(201).json({
            status: 'sucesso',
            data: usuarioResposta,
            token,
            message: 'Cadastro realizado com sucesso'
        });
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ status: 'erro', message: 'Erro interno no servidor' });
    }
});

// Rota de login
apiRouter.post('/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        let usuario = await Usuario.findOne({ email });
        let tipo = 'usuario';
        if (!usuario) {
            usuario = await Profissional.findOne({ email });
            tipo = 'profissional';
        }
        if (!usuario) {
            return res.status(401).json({ status: 'erro', message: 'Email ou senha incorretos' });
        }
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ status: 'erro', message: 'Email ou senha incorretos' });
        }
        const token = jwt.sign(
            { id: usuario._id, tipo: tipo, email: usuario.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        const usuarioResposta = usuario.toObject();
        delete usuarioResposta.senha;
        usuarioResposta.descricao = usuarioResposta.desc;
        usuarioResposta.instagram = usuarioResposta.inst;
        usuarioResposta.facebook = usuarioResposta.face;
        delete usuarioResposta.desc;
        delete usuarioResposta.inst;
        delete usuarioResposta.face;
        res.status(200).json({
            status: 'sucesso',
            data: usuarioResposta,
            token,
            message: 'Login realizado com sucesso'
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ status: 'erro', message: 'Erro interno no servidor' });
    }
});

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
                const profissionalResposta = profissional.toObject();
                profissionalResposta.descricao = profissionalResposta.desc;
                profissionalResposta.instagram = profissionalResposta.inst;
                profissionalResposta.facebook = profissionalResposta.face;
                delete profissionalResposta.desc;
                delete profissionalResposta.inst;
                delete profissionalResposta.face;
                res.status(200).json({ status: 'sucesso', data: profissionalResposta });
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

// NOVAS ROTAS SOLICITADAS

// Rota para verificar se ID é de usuário ou profissional
apiRouter.get('/auth/tipo/:id', async (req, res) => {
        console.log(`🔍 Verificando tipo de conta para ID: ${req.params.id}`);
        if (!validarObjectId(req.params.id)) {
                console.log(`❌ ID inválido: ${req.params.id}`);
                return res.status(400).json({ status: 'erro', message: 'ID inválido' });
        }
        try {
                const usuario = await Usuario.findById(req.params.id);
                if (usuario) {
                        return res.status(200).json({ status: 'sucesso', data: { tipo: 'usuario' }, message: 'ID pertence a um usuário' });
                }
                const profissional = await Profissional.findById(req.params.id);
                if (profissional) {
                        return res.status(200).json({ status: 'sucesso', data: { tipo: 'profissional' }, message: 'ID pertence a um profissional' });
                }
                console.log(`❌ ID não encontrado em usuários ou profissionais: ${req.params.id}`);
                return res.status(404).json({ status: 'erro', message: 'ID não encontrado' });
        } catch (error) {
                console.error(`💥 Erro ao verificar tipo de conta:`, error);
                res.status(500).json({ status: 'erro', message: error.message });
        }
});

// Rota para editar perfil de profissional
apiRouter.put('/auth/perfil-profissional/:id', verificarToken, async (req, res) => {
        console.log(`✏️ Requisição PUT para editar perfil profissional: ${req.params.id}`);
        if (!validarObjectId(req.params.id)) {
                console.log(`❌ ID inválido: ${req.params.id}`);
                return res.status(400).json({ status: 'erro', message: 'ID de profissional inválido' });
        }
        try {
                const { senha, descricao, instagram, facebook, ...camposAtualizacao } = req.body;
                if (descricao !== undefined) camposAtualizacao.desc = descricao;
                if (instagram !== undefined) camposAtualizacao.inst = instagram;
                if (facebook !== undefined) camposAtualizacao.face = facebook;
                delete camposAtualizacao._id;
                console.log(`📝 Campos para atualização:`, camposAtualizacao);
                const profissionalAtualizado = await Profissional.findByIdAndUpdate(
                        req.params.id,
                        camposAtualizacao,
                        { new: true, runValidators: true }
                ).populate('localizacao');
                if (!profissionalAtualizado) {
                        console.log(`❌ Profissional não encontrado para edição: ${req.params.id}`);
                        return res.status(404).json({ status: 'erro', message: 'Profissional não encontrado' });
                }
                console.log(`✅ Perfil profissional atualizado: ${profissionalAtualizado.nome}`);
                const profissionalResposta = profissionalAtualizado.toObject();
                delete profissionalResposta.senha;
                profissionalResposta.descricao = profissionalResposta.desc;
                profissionalResposta.instagram = profissionalResposta.inst;
                profissionalResposta.facebook = profissionalResposta.face;
                delete profissionalResposta.desc;
                delete profissionalResposta.inst;
                delete profissionalResposta.face;
                res.status(200).json({ status: 'sucesso', data: profissionalResposta, message: 'Perfil profissional atualizado com sucesso' });
        } catch (error) {
                console.error(`💥 Erro ao editar perfil profissional:`, error);
                res.status(500).json({ status: 'erro', message: error.message });
        }
});

// Rota para editar perfil do usuário
apiRouter.put('/auth/perfil/:id', verificarToken, async (req, res) => {
        console.log(`✏️ Requisição PUT para editar perfil: ${req.params.id}`);
        if (!validarObjectId(req.params.id)) {
            console.log(`❌ ID inválido: ${req.params.id}`);
            return res.status(400).json({ status: 'erro', message: 'ID de usuário inválido' });
        }
        try {
                const { senha, descricao, instagram, facebook, ...camposAtualizacao } = req.body;
                if (descricao !== undefined) camposAtualizacao.desc = descricao;
                if (instagram !== undefined) camposAtualizacao.inst = instagram;
                if (facebook !== undefined) camposAtualizacao.face = facebook;
                delete camposAtualizacao._id;
                console.log(`📝 Campos para atualização:`, camposAtualizacao);
                const usuarioAtualizado = await Usuario.findByIdAndUpdate(
                        req.params.id,
                        camposAtualizacao,
                        { new: true, runValidators: true }
                ).populate('localizacao');
                if (!usuarioAtualizado) {
                        console.log(`❌ Usuário não encontrado para edição: ${req.params.id}`);
                        return res.status(404).json({ status: 'erro', message: 'Usuário não encontrado' });
                }
                console.log(`✅ Perfil atualizado: ${usuarioAtualizado.nome}`);
                const usuarioResposta = usuarioAtualizado.toObject();
                delete usuarioResposta.senha;
                usuarioResposta.descricao = usuarioResposta.desc;
                usuarioResposta.instagram = usuarioResposta.inst;
                usuarioResposta.facebook = usuarioResposta.face;
                delete usuarioResposta.desc;
                delete usuarioResposta.inst;
                delete usuarioResposta.face;
                res.status(200).json({ status: 'sucesso', data: usuarioResposta, message: 'Perfil atualizado com sucesso' });
        } catch (error) {
                console.error(`💥 Erro ao editar perfil:`, error);
                res.status(500).json({ status: 'erro', message: error.message });
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
                        return res.status(404).json({ status: 'erro', message: 'Usuário não encontrado' });
                }
                console.log(`✅ Usuário encontrado: ${usuario.nome}`);
                const usuarioResposta = usuario.toObject();
                delete usuarioResposta.senha;
                usuarioResposta.descricao = usuarioResposta.desc;
                usuarioResposta.instagram = usuarioResposta.inst;
                usuarioResposta.facebook = usuarioResposta.face;
                delete usuarioResposta.desc;
                delete usuarioResposta.inst;
                delete usuarioResposta.face;
                res.status(200).json({ status: 'sucesso', data: usuarioResposta });
        } catch (error) {
                console.error(`💥 Erro ao buscar perfil:`, error);
                res.status(500).json({ status: 'erro', message: error.message });
        }
});

const PORT = process.env.PORT || 3001;
app.use('/api', apiRouter);
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
