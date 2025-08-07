import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Importar os modelos
import Localizacao from './models/localizacaoModel.js';
import Profissional from './models/profissionalModel.js';
// import Usuario from './models/usuarioModel.js';
// import Avaliacao from './models/avaliacaoModel.js';

// --- Configuração do Servidor ---
const app = express();
app.use(cors()); // Habilita CORS para todas as origens
app.use(express.json()); // Habilita o servidor para receber JSON

// --- Conexão com o MongoDB ---
const mongoURI = 'mongodb://localhost:27017/guiaaodispor'; // Nome do banco
mongoose.connect(mongoURI)
    .then(() => console.log('✅ Conexão com o MongoDB estabelecida!'))
    .catch(err => console.error('❌ Erro ao conectar com o MongoDB:', err));

// --- ROTAS DA API ---
// Um prefixo para todas as rotas da API é uma boa prática
const apiRouter = express.Router();

// Rota de exemplo para criar um Profissional
apiRouter.post('/profissionais', async (req, res) => {
    try {
        const novoProfissional = await Profissional.create(req.body);
        res.status(201).json({ status: 'success', data: novoProfissional });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Rota de exemplo para listar todos os profissionais
apiRouter.get('/profissionais', async (req, res) => {
    try {
        const profissionais = await Profissional.find().populate('localizacao');
        res.status(200).json({ status: 'success', data: profissionais });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


// Use o roteador com o prefixo /api
app.use('/api', apiRouter);


// --- Iniciar o Servidor ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});