import { useState, useEffect, useCallback } from 'react';

export const useConfiguracaoAcessibilidade = () => {
  const [configuracoes, setConfiguracoes] = useState({
    tamanhoFonte: 100,
    espacamentoLetras: 0,
    alturaLinha: 1.5,
    modoContraste: 0,
    modoEscuro: 0,
    modoDaltonico: 0,
    removerImagens: false,
    removerCabecalhos: false,
    destacarLinks: 0, // 0 = desativado, 1 = modo cores, 2 = modo borda
    pausarAnimacoes: false,
    cursorGrande: false,
    guiaLeitura: false
  });

  const salvarConfiguracao = useCallback((chave, valor) => {
    try {
      localStorage.setItem(`acessibilidade_${chave}`, JSON.stringify(valor));
    } catch (error) {
      console.warn('Erro ao salvar configuração:', error);
    }
  }, []);

  const carregarConfiguracao = useCallback((chave, valorPadrao) => {
    try {
      const valorSalvo = localStorage.getItem(`acessibilidade_${chave}`);
      return valorSalvo !== null ? JSON.parse(valorSalvo) : valorPadrao;
    } catch (error) {
      return valorPadrao;
    }
  }, []);

  useEffect(() => {
    const configuracoesSalvas = {
      tamanhoFonte: carregarConfiguracao('tamanhoFonte', 100),
      espacamentoLetras: carregarConfiguracao('espacamentoLetras', 0),
      alturaLinha: carregarConfiguracao('alturaLinha', 1.5),
      modoContraste: carregarConfiguracao('modoContraste', 0),
      modoEscuro: carregarConfiguracao('modoEscuro', 0),
      guiaLeitura: carregarConfiguracao('guiaLeitura', 0),
      removerImagens: carregarConfiguracao('removerImagens', false),
      removerCabecalhos: carregarConfiguracao('removerCabecalhos', false),
      destacarLinks: carregarConfiguracao('destacarLinks', false),
      modoDaltonico: carregarConfiguracao('modoDaltonico', 0),
      pausarAnimacoes: carregarConfiguracao('pausarAnimacoes', false),
      cursorGrande: carregarConfiguracao('cursorGrande', false)
    };

    setConfiguracoes(configuracoesSalvas);
  }, [carregarConfiguracao]);

  const atualizarConfiguracao = useCallback((chave, valor) => {
    setConfiguracoes(prev => ({ ...prev, [chave]: valor }));
    salvarConfiguracao(chave, valor);
  }, [salvarConfiguracao]);

  return { configuracoes, atualizarConfiguracao };
};