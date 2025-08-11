import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Importar os modelos
import Localizacao from './modelos/localizacao.js';
import Profissional from './modelos/profissional.js';
import Usuario from './modelos/usuario.js';
import Avaliacao from './modelos/avaliacao.js';

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
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