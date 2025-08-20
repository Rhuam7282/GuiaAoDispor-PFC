import mongoose from 'mongoose';

const LocalizacaoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  coord: {
    type: Number,
    required: true
  },
  cep: Number
});

export default mongoose.model('Localizacao', LocalizacaoSchema);