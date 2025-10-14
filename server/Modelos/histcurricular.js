import mongoose from 'mongoose';

const HCurricularSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  desc: String,
  profissional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profissional'
  }
});

export default mongoose.model('HCurricular', HCurricularSchema);
