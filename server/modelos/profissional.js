import mongoose from 'mongoose';

const ProfissionalSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  inst: String,
  face: String,
  email: String,
  num: String,
  senha: {
    type: String,
    required: true
  },
  nota: Number,
  localizacao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Localizacao'
  },
  foto: String,
  linkedin: String
});

export default mongoose.model('Profissional', ProfissionalSchema);