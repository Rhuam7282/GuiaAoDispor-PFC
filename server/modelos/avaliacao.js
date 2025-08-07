const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
    titulo: String,
    descricao: String,
    nota: {
        type: Number,
        required: [true, 'A nota é obrigatória.'],
        min: 1,
        max: 5
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    profissional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profissional',
        required: true
    }
}, { timestamps: true });

// Middleware para recalcular a nota média do profissional após salvar uma nova avaliação
avaliacaoSchema.post('save', async function() {
    await this.constructor.recalcularNotaMedia(this.profissional);
});

// Método estático para calcular a média
avaliacaoSchema.statics.recalcularNotaMedia = async function(profissionalId) {
    const Profissional = mongoose.model('Profissional');
    
    const stats = await this.aggregate([
        { $match: { profissional: profissionalId } },
        {
            $group: {
                _id: '$profissional',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$nota' }
            }
        }
    ]);

    if (stats.length > 0) {
        await Profissional.findByIdAndUpdate(profissionalId, {
            notaMedia: stats[0].avgRating
        });
    } else {
        await Profissional.findByIdAndUpdate(profissionalId, {
            notaMedia: 0
        });
    }
};

const Avaliacao = mongoose.model('Avaliacao', avaliacaoSchema);

module.exports = Avaliacao;