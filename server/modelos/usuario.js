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

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  desc: String,
  inst: String,
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
  foto: String,
  contatos: [contatoSchema]
});

export default mongoose.model('Usuario', UsuarioSchema);