const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do usuário é obrigatório.']
    },
    descricao: String,
    instagram: String,
    facebook: String,
    email: {
        type: String,
        required: [true, 'O e-mail é obrigatório.'],
        unique: true,
        lowercase: true
    },
    telefone: String,
    senha: {
        type: String,
        required: [true, 'A senha é obrigatória.'],
        select: false // Não retorna a senha em consultas por padrão
    },
    localizacao: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Localizacao'
    }
}, { timestamps: true });

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;