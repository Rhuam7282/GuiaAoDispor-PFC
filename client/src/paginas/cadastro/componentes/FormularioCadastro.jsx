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
  setDadosFormulario,
  adicionarHistoricoCurricular,
  removerHistoricoCurricular,
  alterarHistoricoCurricular,
  adicionarHistoricoProfissional,
  removerHistoricoProfissional,
  alterarHistoricoProfissional,
  alterarFotoHistoricoProfissional
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
            <div>
              <span>Tipo de Perfil</span>
            </div>
            <div className="listaIcones">
              <button
                type="button"
                className={dadosFormulario.tipoPerfil === 'Pessoal' ? 'botaoAtivo' : ''}
                onClick={() => setDadosFormulario(prev => ({ ...prev, tipoPerfil: 'Pessoal' }))}
              >
                Pessoal
              </button>
              <button
                type="button"
                className={dadosFormulario.tipoPerfil === 'Profissional' ? 'botaoAtivo' : ''}
                onClick={() => setDadosFormulario(prev => ({ ...prev, tipoPerfil: 'Profissional' }))}
              >
                Profissional
              </button>
            </div>
            <p className="texto-obrigatorio">* Campos obrigatórios</p>
          </div>

          {dadosFormulario.tipoPerfil === 'Profissional' && (
            <>
              <div className="grupo-formulario">
                <label htmlFor="descricao">Descrição Profissional *</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={dadosFormulario.descricao}
                  onChange={aoAlterarCampo}
                  rows="3"
                  className={erros.descricao ? 'erro' : ''}
                />
                {erros.descricao && <span className="mensagem-erro">{erros.descricao}</span>}
              </div>

              <div className="grupo-formulario">
                <label htmlFor="instituicao">Instituição/Formação</label>
                <input
                  type="text"
                  id="instituicao"
                  name="instituicao"
                  value={dadosFormulario.instituicao}
                  onChange={aoAlterarCampo}
                />
              </div>

              <div className="grupo-formulario">
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={dadosFormulario.linkedin}
                  onChange={aoAlterarCampo}
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
            </>
          )}

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
          
          <button 
            type="submit" 
            disabled={carregando}
          >
            {carregando ? 'Cadastrando...' : 'Criar Conta'}
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

