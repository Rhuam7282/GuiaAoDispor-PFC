import mongoose from 'mongoose';

const AvaliacaoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  desc: String,
  nota: {
    type: Number,
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  profissional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profissional'
  }
});

export default mongoose.model('Avaliacao', AvaliacaoSchema);