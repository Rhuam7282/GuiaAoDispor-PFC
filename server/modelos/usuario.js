import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  desc: {
    type: String,
    default: ''
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
  localizacao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Localizacao'
  },
  foto: {
    type: String,
    default: ''
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

// Índices para melhor performance
UsuarioSchema.index({ email: 1 });
UsuarioSchema.index({ localizacao: 1 });

export default mongoose.model('Usuario', UsuarioSchema);