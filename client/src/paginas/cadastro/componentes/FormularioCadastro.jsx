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
  return (
    <form onSubmit={aoEnviarFormulario} className="formulario-cadastro">
      <div className="conteudo-formulario">
        <div className="campos-formulario">
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

          <div className="cartaoDestaque variacao2" id='tipo-perfil'>
            {/* Seção de Tipo de Perfil */}
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

            {/* Campos básicos */}
            <div className="grupo-formulario">
              <label>Nome Completo *</label>
              <input
                type="text"
                name="nome"
                value={dadosFormulario.nome}
                onChange={aoAlterarCampo}
                placeholder="Seu nome completo"
              />
              {erros.nome && <span className="mensagem-erro">{erros.nome}</span>}
            </div>

            {/* Seção de Contatos */}
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

            {/* Descrição (opcional) */}
            <div className="grupo-formulario">
              <label>Descrição</label>
              <textarea
                name="descricao"
                value={dadosFormulario.descricao}
                onChange={aoAlterarCampo}
                rows="3"
                placeholder="Uma breve descrição sobre você (opcional)"
                className="textarea-pequeno"
              />
            </div>

            <HistoricoCurricular
              historicosCurriculares={dadosFormulario.historicosCurriculares}
              adicionarHistoricoCurricular={adicionarHistoricoCurricular}
              removerHistoricoCurricular={removerHistoricoCurricular}
              alterarHistoricoCurricular={alterarHistoricoCurricular}
            />

            <HistoricoProfissional
              historicosProfissionais={dadosFormulario.historicosProfissionais}
              adicionarHistoricoProfissional={adicionarHistoricoProfissional}
              removerHistoricoProfissional={removerHistoricoProfissional}
              alterarHistoricoProfissional={alterarHistoricoProfissional}
              alterarFotoHistoricoProfissional={alterarFotoHistoricoProfissional}
            />
          </div> {/* Corrigido: era <div/> */}

          <div className="grupo-formulario">
            <label htmlFor="facebook">Facebook</label>
            <input
              type="url"
              id="facebook"
              name="facebook"
              value={dadosFormulario.facebook}
              onChange={aoAlterarCampo}
            />
          </div>

          <div className="grupo-formulario">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={dadosFormulario.telefone}
              onChange={aoAlterarCampo}
            />
          </div>

          {mensagemSucesso && (
            <div className="mensagem-sucesso">{mensagemSucesso}</div>
          )}

          {erros.submit && (
            <div className="mensagem-erro">{erros.submit}</div>
          )}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Finalizar Cadastro'}
          </button>

          {mensagemSucesso && <div className="mensagem-sucesso">{mensagemSucesso}</div>}
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