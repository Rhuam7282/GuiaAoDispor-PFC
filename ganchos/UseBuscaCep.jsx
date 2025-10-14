// /src/paginas/Cadastro/componentes/BuscaCep.jsx

import { useState, useEffect } from 'react';

/**
 * Hook customizado para buscar dados de um CEP.
 * @param {string} cep - O CEP a ser pesquisado.
 * @param {function} setDadosFormulario - Função para atualizar o estado do formulário pai.
 * @param {function} setErros - Função para atualizar os erros no formulário pai.
 */
const useBuscaCep = (cep, setDadosFormulario, setErros) => {
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      return;
    }

    const buscarEndereco = async () => {
      setCarregando(true);
      setErros(prev => ({ ...prev, cep: '' })); // Limpa erro de CEP anterior

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/` );
        const data = await response.json();

        if (data.erro) {
          setErros(prev => ({ ...prev, cep: 'CEP não encontrado.' }));
          // Limpa os campos caso o CEP seja inválido
          setDadosFormulario(prev => ({
            ...prev,
            cidade: '',
            estado: '',
            // Adicione outros campos como bairro e rua se existirem no seu formulário
          }));
        } else {
          // Atualiza o formulário com os dados recebidos
          setDadosFormulario(prev => ({
            ...prev,
            cidade: data.localidade || '',
            estado: data.uf || '',
            // Adicione outros campos como bairro: data.bairro, rua: data.logradouro
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        setErros(prev => ({ ...prev, cep: 'Não foi possível buscar o CEP.' }));
      } finally {
        setCarregando(false);
      }
    };

    buscarEndereco();

  }, [cep, setDadosFormulario, setErros]);

  return { carregando };
};

export default useBuscaCep;
