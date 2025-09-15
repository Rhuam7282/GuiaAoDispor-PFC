import React, { useState } from 'react';
import { servicoHCurricular } from '@servicos/api';

const HistoricoAcademicoPerfil = ({
historicoAcademico,
modoEdicao,
setHistorico,
idProfissional
}) => {
const [editandoIndex, setEditandoIndex] = useState(null);
const [novoItem, setNovoItem] = useState({
nome: '',
instituicao: '',
periodo: ''
});
const [carregando, setCarregando] = useState(false);

const handleAdicionar = async () => {
if (!novoItem.nome || !novoItem.instituicao || !novoItem.periodo) {
alert('Por favor, preencha todos os campos');
return;
}

setCarregando(true);
try {
  const response = await servicoHCurricular.criar({
    ...novoItem,
    profissional: idProfissional
  });
  
  setHistorico([...historicoAcademico, response.data]);
  setNovoItem({ nome: '', instituicao: '', periodo: '' });
} catch (erro) {
  console.error('Erro ao adicionar histórico:', erro);
  alert('Erro ao adicionar histórico. Tente novamente.');
} finally {
  setCarregando(false);
}
};

const handleEditar = async (index) => {
if (!novoItem.nome || !novoItem.instituicao || !novoItem.periodo) {
alert('Por favor, preencha todos os campos');
return;
}

setCarregando(true);
try {
  const item = historicoAcademico[index];
  const response = await servicoHCurricular.atualizar(item._id, {
    ...item,
    ...novoItem
  });
  
  const updated = [...historicoAcademico];
  updated[index] = response.data;
  setHistorico(updated);
  setEditandoIndex(null);
  setNovoItem({ nome: '', instituicao: '', periodo: '' });
} catch (erro) {
  console.error('Erro ao editar histórico:', erro);
  alert('Erro ao editar histórico. Tente novamente.');
} finally {
  setCarregando(false);
}
};

const handleRemover = async (index) => {
if (!window.confirm('Tem certeza que deseja remover este item?')) {
return;
}

setCarregando(true);
try {
  const item = historicoAcademico[index];
  await servicoHCurricular.deletar(item._id);
  
  const updated = historicoAcademico.filter((_, i) => i !== index);
  setHistorico(updated);
} catch (erro) {
  console.error('Erro ao remover histórico:', erro);
  alert('Erro ao remover histórico. Tente novamente.');
} finally {
  setCarregando(false);
}
};

const cancelarEdicao = () => {
setEditandoIndex(null);
setNovoItem({ nome: '', instituicao: '', periodo: '' });
};

return (
<div className="flexItem margemInferiorGrande">
<h2 className="bordaInferiorSubtle">Histórico Acadêmico</h2>

  {modoEdicao && (
    <div className="cartao fundoAzulClaro margemInferiorMedio">
      <h3>{editandoIndex !== null ? 'Editar Item' : 'Adicionar Novo Item'}</h3>
      <div className="gridContainer gridColunas2 gapPequeno">
        <input
          type="text"
          placeholder="Nome do Curso"
          value={novoItem.nome}
          onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
          className="campoFormulario"
          disabled={carregando}
        />
        <input
          type="text"
          placeholder="Instituição"
          value={novoItem.instituicao}
          onChange={(e) => setNovoItem({ ...novoItem, instituicao: e.target.value })}
          className="campoFormulario"
          disabled={carregando}
        />
        <input
          type="text"
          placeholder="Período (ex: 2020-2022)"
          value={novoItem.periodo}
          onChange={(e) => setNovoItem({ ...novoItem, periodo: e.target.value })}
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
    {historicoAcademico.length > 0 ? (
      historicoAcademico.map((item, index) => (
        <div key={item._id || index} className="cartao fundoAzulDestaque">
          {modoEdicao && editandoIndex !== index ? (
            <div className="flexContainer espacamentoEntre alinharCentro">
              <div className="flexItemExpandir">
                <h3>{item.nome}</h3>
                <p>{item.instituicao}</p>
                <p className="textoMarromEscuro">{item.periodo}</p>
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
            <div>
              <h3>{item.nome}</h3>
              <p>{item.instituicao}</p>
              <p className="textoMarromEscuro">{item.periodo}</p>
            </div>
          )}
        </div>
      ))
    ) : (
      <div className="cartao fundoAzulDestaque">
        <p>Nenhum histórico acadêmico cadastrado.</p>
        {modoEdicao && <p>Use o formulário acima para adicionar seu primeiro item.</p>}
      </div>
    )}
  </div>
</div>
);
};

export default HistoricoAcademicoPerfil;