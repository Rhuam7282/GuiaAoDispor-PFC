// server/servidor.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';      // 1. Adicione o import novamente
import path from 'path';           // 2. Adicione o import do 'path'
import { fileURLToPath } from 'url'; // 3. Adicione o import do 'url'

// --- CONFIGURAÇÃO EXPLÍCITA DO DOTENV ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Navega um nível acima da pasta 'server' para chegar à raiz do projeto
const caminhoRaiz = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(caminhoRaiz, '.env') });
// --- FIM DA CONFIGURAÇÃO ---

// Importar os modelos
import Localizacao from './modelos/localizacao.js';
import Profissional from './modelos/profissional.js';
import Usuario from './modelos/usuario.js';
import Avaliacao from './modelos/avaliacao.js';

// --- Configuração do Servidor ---
const app = express();
app.use(cors());
app.use(express.json());

// --- Conexão com o MongoDB ---
const mongoURI = process.env.MONGO_URI;

// Adicionamos uma verificação para garantir que a URI foi carregada
if (!mongoURI) {
    console.error('❌ ERRO CRÍTICO: A variável de ambiente MONGO_URI não foi encontrada.');
    console.error('Verifique se o arquivo .env está na raiz do projeto e contém a variável MONGO_URI.');
    process.exit(1); // Encerra a aplicação se não houver conexão com o banco
}

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Conexão com o MongoDB estabelecida!'))
    .catch(err => console.error('❌ Erro ao conectar com o MongoDB:', err));

const apiRouter = express.Router();

// Rota para listar todos os profissionais
apiRouter.get('/profissionais', async (req, res) => {
    try {
        const profissionais = await Profissional.find().populate('localizacao');
        res.status(200).json({ status: 'sucesso', data: profissionais });
    } catch (error) {
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

// Rota para criar um Profissional
apiRouter.post('/profissionais', async (req, res) => {
    try {
        const novoProfissional = await Profissional.create(req.body);
        res.status(201).json({ status: 'sucesso', data: novoProfissional });
    } catch (error) {
        res.status(400).json({ status: 'erro', message: error.message });
    }
});

app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});