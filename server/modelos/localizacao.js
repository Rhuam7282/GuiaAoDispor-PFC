const mongoose = require('mongoose');

const localizacaoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome da localização é obrigatório.']
    },
    // Para coordenadas, o ideal é usar o formato GeoJSON do MongoDB
    // para permitir consultas geoespaciais.
    coordenadas: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },
    cep: {
        type: String,
        required: [true, 'O CEP é obrigatório.']
    }
}, { timestamps: true });

const Localizacao = mongoose.model('Localizacao', localizacaoSchema);

module.exports = Localizacao;