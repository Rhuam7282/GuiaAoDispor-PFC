import express from 'express';

const router = express.Router();

// Rota SIMPLES para teste
router.get('/', async (req, res) => {
  try {
    console.log('✅ Rota /api/profissionais chamada');
    
    // Dados mock simples
    const profissionaisMock = [
      {
        _id: "1",
        imagem: "/imagens/mulher.png",
        nome: "Ana Silva",
        localizacao: "São Paulo, SP",
        experiencia: "Enfermeira com 5 anos de experiência"
      },
      {
        _id: "2", 
        imagem: "/imagens/homem.png",
        nome: "Carlos Santos",
        localizacao: "Rio de Janeiro, RJ",
        experiencia: "Cuidador especializado"
      }
    ];

    res.json(profissionaisMock);
    
  } catch (error) {
    console.error('❌ Erro na rota:', error);
    res.status(500).json({ 
      error: 'Erro interno',
      message: error.message 
    });
  }
});

// Rota de teste
router.get('/test', (req, res) => {
  res.json({ message: 'Rota de profissionais funcionando!', timestamp: new Date().toISOString() });
});

export default router;