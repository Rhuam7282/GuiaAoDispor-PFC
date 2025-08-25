import { useState, useEffect } from 'react';
import { servicoProfissional } from '@servicos/apiService';

export const useProfissional = (id) => {
  const [profissional, setProfissional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfissional = async () => {
      try {
        if (!id || id === 'undefined') {
          setError('ID não fornecido');
          setLoading(false);
          return;
        }
        
        console.log('Buscando profissional com ID:', id);
        const response = await servicoProfissional.buscarPorId(id);
        console.log('Resposta da API:', response);

        // Ajuste para a estrutura de resposta da sua API
        if (response && response.status === 'sucesso') {
          setProfissional(response.data);
        } else {
          throw new Error(response?.message || 'Erro ao carregar profissional');
        }
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