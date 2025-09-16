import React, { useState } from 'react';
import { servicoHProfissional } from '@servicos/api';

const HistoricoProfissionalPerfil = ({
  historicoProfissional,
  nomePerfil,
  modoEdicao,
  setHistorico,
  idProfissional
}) => {
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [novoItem, setNovoItem] = useState({
    nome: '',
    imagem: ''
  });
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleAdicionar = async () => {
    if (!novoItem.nome) {
      setMensagem('Por favor, informe o nome da empresa');
      return;
    }

    setCarregando(true);
    setMensagem('');
    try {
      const resposta = await servicoHProfissional.criar({
        ...novoItem,
        profissional: idProfissional
      });
      
      setHistorico([...historicoProfissional, resposta.data]);
      setNovoItem({ nome: '', imagem: '' });
      setMensagem('Item adicionado com sucesso!');
      setTimeout(() => setMensagem(''), 3000);
    } catch (erro) {
      console.error('Erro ao adicionar histórico:', erro);
      setMensagem('Erro ao adicionar histórico. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleEditar = async (index) => {
    if (!novoItem.nome) {
      setMensagem('Por favor, informe o nome da empresa');
      return;
    }

    setCarregando(true);
    setMensagem('');
    try {
      const item = historicoProfissional[index];
      const resposta = await servicoHProfissional.atualizar(item._id, {
        ...item,
        ...novoItem
      });
      
      const atualizado = [...historicoProfissional];
      atualizado[index] = resposta.data;
      setHistorico(atualizado);
      setEditandoIndex(null);
      setNovoItem({ nome: '', imagem: '' });
      setMensagem('Item atualizado com sucesso!');
      setTimeout(() => setMensagem(''), 3000);
    } catch (erro) {
      console.error('Erro ao editar histórico:', erro);
      setMensagem('Erro ao editar histórico. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleRemover = async (index) => {
    if (!window.confirm('Tem certeza que deseja remover este item?')) {
      return;
    }

    setCarregando(true);
    setMensagem('');
    try {
      const item = historicoProfissional[index];
      await servicoHProfissional.deletar(item._id);
      
      const atualizado = historicoProfissional.filter((_, i) => i !== index);
      setHistorico(atualizado);
      setMensagem('Item removido com sucesso!');
      setTimeout(() => setMensagem(''), 3000);
    } catch (erro) {
      console.error('Erro ao remover histórico:', erro);
      setMensagem('Erro ao remover histórico. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const cancelarEdicao = () => {
    setEditandoIndex(null);
    setNovoItem({ nome: '', imagem: '' });
    setMensagem('');
  };

  return (
    <div className="flexItem margemInferiorGrande">
      <h2 className="bordaInferiorSubtle">Histórico Profissional</h2>

      {mensagem && (
        <div className={`mensagem ${mensagem.includes('Erro') ? 'mensagemErro' : 'mensagemSucesso'} margemInferiorPequena`}>
          {mensagem}
        </div>
      )}

      {modoEdicao && (
        <div className="cartao fundoAzulClaro margemInferiorMedio">
          <h3>{editandoIndex !== null ? 'Editar Item' : 'Adicionar Novo Item'}</h3>
          <div className="gridContainer gridColunas2 gapPequeno">
            <input
              type="text"
              placeholder="Nome da Empresa"
              value={novoItem.nome}
              onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
              className="campoFormulario"
              disabled={carregando}
            />
            <input
              type="text"
              placeholder="URL da Imagem (opcional)"
              value={novoItem.imagem}
              onChange={(e) => setNovoItem({ ...novoItem, imagem: e.target.value })}
              className="campoFormulario"
              disabled={carregando}
            />
            <div className="flexContainer gapPequeno">
              <button
                onClick={() => editandoIndex !== null ? handleEditar(editandoIndex) : handleAdicionar()}
                className="botaoPrimario"
                disabled={carregando}
              >
                {carregando ? 'Salvando...' : (editandoIndex !== null ? 'Salvar' : 'Adicionar')}
              </button>
              {editandoIndex !== null && (
                <button
                  onClick={cancelarEdicao}
                  className="botaoSecundario"
                  disabled={carregando}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="gridContainer gridColunasAuto gapMedio">
        {historicoProfissional.length > 0 ? (
          historicoProfissional.map((item, index) => (
            <div key={item._id || index} className="cartao fundoAzulDestaque">
              {modoEdicao && editandoIndex !== index ? (
                <div className="flexContainer espacamentoEntre alinharCentro">
                  <div className="containerImagem margemDireitaMedio">
                    <img
                      className="imagemAspecto"
                      src={item.imagem || '/placeholder-empresa.png'}
                      alt={`${item.nome} - Local de trabalho de ${nomePerfil}`}
                      onError={(e) => {
                        e.target.src = '/placeholder-empresa.png';
                      }}
                    />
                  </div>
                  <div className="flexItemExpandir">
                    <h3>{item.nome}</h3>
                  </div>
                  <div className="flexContainer gapPequeno">
                    <button 
                      onClick={() => {
                        setEditandoIndex(index);
                        setNovoItem(item);
                      }}
                      className="botaoSecundario"
                      disabled={carregando}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleRemover(index)}
                      className="botaoPerigo"
                      disabled={carregando}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flexColuna gapPequeno alinharEsticar">
                  <div className="containerImagem">
                    <img
                      className="imagemAspecto"
                      src={item.imagem || '/placeholder-empresa.png'}
                      alt={`${item.nome} - Local de trabalho de ${nomePerfil}`}
                      onError={(e) => {
                        e.target.src = '/placeholder-empresa.png';
                      }}
                    />
                  </div>
                  <div className="margemSuperiorZero">
                    <h3>{item.nome}</h3>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="cartao fundoAzulDestaque">
            <p>Nenhum histórico profissional cadastrado.</p>
            {modoEdicao && <p>Use o formulário acima para adicionar seu primeiro item.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoProfissionalPerfil;