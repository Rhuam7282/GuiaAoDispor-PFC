import mongoose from 'mongoose';

const contatoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['Email', 'Telefone', 'Facebook', 'LinkedIn', 'Outro']
  },
  valor: {
    type: String,
    required: true
  }
});

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
  email: {
    type: String,
    required: true,
    unique: true
  },
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
  linkedin: String,
  contatos: [contatoSchema],
  tipoPerfil: {
    type: String,
    enum: ['Pessoal', 'Profissional'],
    default: 'Profissional'
  }
});

export default mongoose.model('Profissional', ProfissionalSchema);
