// server/models/profissionalModel.js
import mongoose from 'mongoose';

// ... (schemas de hCurricular e hProfissional aqui, sem alterações) ...
const hCurricularSchema = new mongoose.Schema({ /* ... */ });
const hProfissionalSchema = new mongoose.Schema({ /* ... */ });

const profissionalSchema = new mongoose.Schema({
    // ... (todo o conteúdo do schema aqui, sem alterações) ...
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // etc.
});

const Profissional = mongoose.model('Profissional', profissionalSchema);

export default Profissional; // <-- Mude module.exports para export default