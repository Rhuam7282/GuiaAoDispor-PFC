import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  desc: String,
  inst: String,
  face: String,
  email: {
    type: String,
    required: true
  },
  num: String,
  senha: {
    type: String,
    required: true
  },
  localizacao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Localizacao'
  },
  foto: String
});

export default mongoose.model('Usuario', UsuarioSchema);