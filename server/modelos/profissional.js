import mongoose from 'mongoose';

const ProfissionalSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  desc: {
    type: String,
    required: [true, 'Descrição é obrigatória']
  },
  inst: {
    type: String,
    default: ''
  },
  face: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  num: {
    type: String,
    default: ''
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  },
  nota: {
    type: Number,
    default: 0,
    min: [0, 'Nota não pode ser menor que 0'],
    max: [5, 'Nota não pode ser maior que 5']
  },
  localizacao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Localizacao'
  },
  foto: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

// Índices para melhor performance
ProfissionalSchema.index({ email: 1 });
ProfissionalSchema.index({ localizacao: 1 });
ProfissionalSchema.index({ nota: -1 });

export default mongoose.model('Profissional', ProfissionalSchema);