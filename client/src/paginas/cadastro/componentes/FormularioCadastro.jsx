import React from 'react';
import HistoricoCurricular from './HistoricoCurricular';
import HistoricoProfissional from './HistoricoProfissional';
import UploadImagem from './UploadImagem';

const FormularioCadastro = ({
  dadosFormulario,
  erros,
  carregando,
  mensagemSucesso,
  aoAlterarCampo,
  aoSelecionarArquivo,
  aoEnviarFormulario,
  adicionarHistoricoCurricular,
  removerHistoricoCurricular,
  alterarHistoricoCurricular,
  adicionarHistoricoProfissional,
  removerHistoricoProfissional,
  alterarHistoricoProfissional,
  alterarFotoHistoricoProfissional,
  adicionarContato,
  removerContato,
  alterarContato
}) => {
  const isPerfilProfissional = dadosFormulario.tipoPerfil === 'Profissional';
  const errosContatos = erros.errosContatos || [];

  return (
    <form onSubmit={aoEnviarFormulario} className="formulario-cadastro">
      <div className="conteudo-formulario">
        <div className="campos-formulario">
          {/* Seção de campos básicos ao lado da foto */}
          <div className="secao-campos-basicos">
            <div className="grupo-formulario">
              <label htmlFor="nome">Nome Completo *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={dadosFormulario.nome}
                onChange={aoAlterarCampo}
                className={erros.nome ? 'erro' : ''}
              />
              {erros.nome && <span className="mensagem-erro">{erros.nome}</span>}
            </div>

            <div className="grupo-formulario">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={dadosFormulario.email}
                onChange={aoAlterarCampo}
                className={erros.email ? 'erro' : ''}
              />
              {erros.email && <span className="mensagem-erro">{erros.email}</span>}
            </div>

            <div className="linha-senhas">
              <div className="grupo-formulario">
                <label htmlFor="senha">Senha *</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={dadosFormulario.senha}
                  onChange={aoAlterarCampo}
                  className={erros.senha ? 'erro' : ''}
                />
                {erros.senha && <span className="mensagem-erro">{erros.senha}</span>}
              </div>

              <div className="grupo-formulario">
                <label htmlFor="confirmarSenha">Confirmar Senha *</label>
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={dadosFormulario.confirmarSenha}
                  onChange={aoAlterarCampo}
                  className={erros.confirmarSenha ? 'erro' : ''}
                />
                {erros.confirmarSenha && <span className="mensagem-erro">{erros.confirmarSenha}</span>}
              </div>
            </div>

            <div className="linha-endereco">
              <div className="grupo-formulario grupo-cep">
                <label htmlFor="cep">CEP *</label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={dadosFormulario.cep}
                  onChange={aoAlterarCampo}
                  className={erros.cep ? 'erro' : ''}
                />
                {erros.cep && <span className="mensagem-erro">{erros.cep}</span>}
              </div>

              <div className="grupo-formulario">
                <label htmlFor="cidade">Cidade *</label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={dadosFormulario.cidade}
                  onChange={aoAlterarCampo}
                  className={erros.cidade ? 'erro' : ''}
                />
                {erros.cidade && <span className="mensagem-erro">{erros.cidade}</span>}
              </div>

              <div className="grupo-formulario">
                <label htmlFor="estado">Estado</label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={dadosFormulario.estado}
                  onChange={aoAlterarCampo}
                />
              </div>
            </div>

            {/* Campos específicos para perfil Profissional */}
            {isPerfilProfissional && (
              <>
                <div className="grupo-formulario">
                  <label htmlFor="instituicao">Instituição *</label>
                  <input
                    type="text"
                    id="instituicao"
                    name="instituicao"
                    value={dadosFormulario.instituicao}
                    onChange={aoAlterarCampo}
                    className={erros.instituicao ? 'erro' : ''}
                  />
                  {erros.instituicao && <span className="mensagem-erro">{erros.instituicao}</span>}
                </div>

                <div className="grupo-formulario">
                  <label htmlFor="linkedin">LinkedIn</label>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={dadosFormulario.linkedin}
                    onChange={aoAlterarCampo}
                    placeholder="URL do seu perfil do LinkedIn"
                  />
                </div>
              </>
            )}

            {/* Seção de Tipo de Perfil */}
            <div className="cartaoDestaque variacao2" id='tipo-perfil'>
              <div className="grupo-formulario">
                <label>Tipo de Perfil *</label>
                <div className="botoes-tipo-perfil">
                  <button
                    type="button"
                    className={`botao-tipo ${dadosFormulario.tipoPerfil === 'Pessoal' ? 'ativo' : ''}`}
                    onClick={() => aoAlterarCampo({ target: { name: 'tipoPerfil', value: 'Pessoal' } })}
                  >
                    Pessoal
                  </button>
                  <button
                    type="button"
                    className={`botao-tipo ${dadosFormulario.tipoPerfil === 'Profissional' ? 'ativo' : ''}`}
                    onClick={() => aoAlterarCampo({ target: { name: 'tipoPerfil', value: 'Profissional' } })}
                  >
                    Profissional
                  </button>
                </div>
              </div>

              {/* Descrição (obrigatória para profissional, opcional para pessoal) */}
              <div className="grupo-formulario">
                <label>Descrição {isPerfilProfissional && '*'}</label>
                <textarea
                  name="descricao"
                  value={dadosFormulario.descricao}
                  onChange={aoAlterarCampo}
                  rows="3"
                  placeholder={isPerfilProfissional ? 
                    "Uma breve descrição sobre você (obrigatório)" : 
                    "Uma breve descrição sobre você (opcional)"}
                  className={isPerfilProfissional && erros.descricao ? 'erro textarea-pequeno' : 'textarea-pequeno'}
                />
                {isPerfilProfissional && erros.descricao && (
                  <span className="mensagem-erro">{erros.descricao}</span>
                )}
              </div>
            </div>
          </div>

          {/* Seção de Contatos separada - ocupando espaço todo */}
          <div className="cartaoDestaque variacao2 secao-completa">
  <div className="grupo-formulario">
    <label>Contatos</label>
    {dadosFormulario.contatos && dadosFormulario.contatos.map((contato, index) => (
      <div key={index} className="item-contato">
        <select
          value={contato.tipo}
          onChange={(e) => alterarContato(index, 'tipo', e.target.value)}
        >
          <option value="">Selecione o tipo</option>
          <option value="Telefone">Telefone</option>
          <option value="Email">Email</option>
          <option value="Facebook">Facebook</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Outro">Outro</option>
        </select>
        <input
          type="text"
          value={contato.valor}
          onChange={(e) => alterarContato(index, 'valor', e.target.value)}
          placeholder="Valor do contato"
        />
        {errosContatos && errosContatos[index] && (
          <span className="mensagem-erro">{errosContatos[index]}</span>
        )}
        <button
          type="button"
          onClick={() => removerContato(index)}
          className="botao-remover"
        >
          Remover
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={adicionarContato}
      className="botao-adicionar"
    >
      + Adicionar Contato
    </button>
  </div>
</div>
          {/* Seção de Histórico Curricular (apenas para perfil Profissional) */}
          {isPerfilProfissional && (
            <div className="cartaoDestaque variacao2 secao-completa">
              <HistoricoCurricular
                historicosCurriculares={dadosFormulario.historicosCurriculares}
                adicionarHistoricoCurricular={adicionarHistoricoCurricular}
                removerHistoricoCurricular={removerHistoricoCurricular}
                alterarHistoricoCurricular={alterarHistoricoCurricular}
              />
            </div>
          )}

          {/* Seção de Histórico Profissional (apenas para perfil Profissional) */}
          {isPerfilProfissional && (
            <div className="cartaoDestaque variacao2 secao-completa">
              <HistoricoProfissional
                historicosProfissionais={dadosFormulario.historicosProfissionais}
                adicionarHistoricoProfissional={adicionarHistoricoProfissional}
                removerHistoricoProfissional={removerHistoricoProfissional}
                alterarHistoricoProfissional={alterarHistoricoProfissional}
                alterarFotoHistoricoProfissional={alterarFotoHistoricoProfissional}
              />
            </div>
          )}

          {mensagemSucesso && (
            <div className="mensagem-sucesso">{mensagemSucesso}</div>
          )}

          {erros.submit && (
            <div className="mensagem-erro">{erros.submit}</div>
          )}

          {/* Botão de finalizar ocupando todo o espaço */}
          <button type="submit" disabled={carregando} className="botao-finalizar-completo">
            {carregando ? 'Cadastrando...' : 'Finalizar Cadastro'}
          </button>
        </div>

        <UploadImagem
          foto={dadosFormulario.foto}
          aoSelecionarArquivo={aoSelecionarArquivo}
        />
      </div>
    </form>
  );
};

export default FormularioCadastro;