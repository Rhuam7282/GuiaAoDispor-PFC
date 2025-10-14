import mongoose from 'mongoose';



const LocalizacaoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  coordenadas: {
    lat: Number,
    lng: Number
  },
  cep: String,
  cidade: String,
  estado: String
});

export default mongoose.model('Localizacao', LocalizacaoSchema);
