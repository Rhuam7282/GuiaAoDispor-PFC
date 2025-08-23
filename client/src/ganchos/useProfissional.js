import { useState, useEffect } from 'react';
import { servicoProfissional } from '@servicos/apiService';

export const useProfissional = (id) => {
  const [profissional, setProfissional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfissional = async () => {
      try {
        console.log('Buscando profissional com ID:', id);
        
        if (!id || id === 'undefined') {
          throw new Error('ID não fornecido');
        }

        const response = await servicoProfissional.buscarPorId(id);
        console.log('Resposta da API:', response);
        
        // Ajuste conforme a estrutura da sua API
        if (!response) {
          throw new Error('Nenhum dado retornado pela API');
        }
        
        setProfissional(response);
        setError(null);
      } catch (err) {
        console.error('Erro no hook useProfissional:', err);
        setError(err.message || 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfissional();
  }, [id]);

  return { profissional, loading, error };
};