import UploadImagem from "./uploadimagem.jsx";
import HistoricoCurricular from "./historicocurricular.jsx";
import HistoricoProfissional from "./historicoprofissional.jsx";

// Modifique o componente para receber as novas props
const FormularioCadastro = ({
  dadosFormulario,
  erros,
  carregando,
  mensagemSucesso,
  aoAlterarCampo,
  aoSelecionarArquivo,
  aoEnviarFormulario,
  adicionarContato,
  removerContato,
  alterarContato,
  historicosCurriculares,
  historicosProfissionais,
  adicionarHistoricoCurricular,
  removerHistoricoCurricular,
  alterarHistoricoCurricular,
  adicionarHistoricoProfissional,
  removerHistoricoProfissional,
  alterarHistoricoProfissional,
  alterarFotoHistoricoProfissional,
}) => {
  const isPerfilProfissional = dadosFormulario.tipoPerfil === "Profissional";
  const errosContatos = erros.errosContatos || {};
  const enderecoPreenchidoPelaAPI =
    dadosFormulario.cidade && dadosFormulario.estado && !erros.cep;

  return (
    <form onSubmit={aoEnviarFormulario} className="formulario-cadastro">
      <div className="conteudo-formulario">
        <div className="campos-formulario">
          {/* Seção de campos básicos */}
          <div className="secao-campos-basicos">
            <aside>
              <div className="grupo-formulario">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={dadosFormulario.nome}
                  onChange={aoAlterarCampo}
                  className={erros.nome ? "erro" : ""}
                  placeholder="Seu nome completo"
                />
                {erros.nome && (
                  <span className="mensagem-erro">{erros.nome}</span>
                )}
              </div>

              <div className="grupo-formulario">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={dadosFormulario.email}
                  onChange={aoAlterarCampo}
                  className={erros.email ? "erro" : ""}
                  placeholder="seu@email.com"
                />
                {erros.email && (
                  <span className="mensagem-erro">{erros.email}</span>
                )}
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
                    className={erros.senha ? "erro" : ""}
                    placeholder="Mínimo 8 caracteres"
                  />
                  {erros.senha && (
                    <span className="mensagem-erro">{erros.senha}</span>
                  )}
                </div>

                <div className="grupo-formulario">
                  <label htmlFor="confirmarSenha">Confirmar Senha *</label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={dadosFormulario.confirmarSenha}
                    onChange={aoAlterarCampo}
                    className={erros.confirmarSenha ? "erro" : ""}
                    placeholder="Digite novamente sua senha"
                  />
                  {erros.confirmarSenha && (
                    <span className="mensagem-erro">
                      {erros.confirmarSenha}
                    </span>
                  )}
                </div>
              </div>
              {/* Seção de Upload de Imagem */}
              <UploadImagem
                foto={dadosFormulario.foto}
                aoSelecionarArquivo={aoSelecionarArquivo}
              />
            </aside>

            <div className="linha-endereco">
              <div className="grupo-formulario grupo-cep">
                <label htmlFor="cep">CEP *</label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={dadosFormulario.cep}
                  onChange={aoAlterarCampo}
                  className={erros.cep ? "erro" : ""}
                  placeholder="00000-000"
                  maxLength="9" // Garante que o usuário não digite mais que o necessário
                />
                {/* <<< 2. FEEDBACK DE CARREGAMENTO */}
                {carregando && !mensagemSucesso && (
                  <span className="mensagem-info">Buscando CEP...</span>
                )}
                {erros.cep && (
                  <span className="mensagem-erro">{erros.cep}</span>
                )}
              </div>

              <div className="grupo-formulario">
                <label htmlFor="cidade">Cidade *</label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={dadosFormulario.cidade}
                  onChange={aoAlterarCampo}
                  className={erros.cidade ? "erro" : ""}
                  placeholder="Preenchimento automático"
                  // <<< 3. CAMPO DESABILITADO DINAMICAMENTE
                  disabled={carregando || enderecoPreenchidoPelaAPI}
                  readOnly={enderecoPreenchidoPelaAPI} // Impede edição manual após preenchimento
                />
                {erros.cidade && (
                  <span className="mensagem-erro">{erros.cidade}</span>
                )}
              </div>

              <div className="grupo-formulario">
                <label htmlFor="estado">Estado</label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={dadosFormulario.estado}
                  onChange={aoAlterarCampo}
                  placeholder="UF"
                  // <<< 3. CAMPO DESABILITADO DINAMICAMENTE
                  disabled={carregando || enderecoPreenchidoPelaAPI}
                  readOnly={enderecoPreenchidoPelaAPI} // Impede edição manual após preenchimento
                />
              </div>
            </div>

            {/* Campos específicos para perfil Profissional */}
            {isPerfilProfissional && (
              <>
                <div className="grupo-formulario">
                  <label htmlFor="inst">Instituição/Formação</label>
                  <input
                    type="text"
                    id="inst"
                    name="inst"
                    value={dadosFormulario.inst}
                    onChange={aoAlterarCampo}
                    placeholder="Sua instituição de ensino ou empresa"
                  />
                </div>
                {/* ADICIONE AS SEÇÕES DE HISTÓRICOS AQUI */}
                <HistoricoCurricular
                  historicosCurriculares={historicosCurriculares}
                  adicionarHistoricoCurricular={adicionarHistoricoCurricular}
                  removerHistoricoCurricular={removerHistoricoCurricular}
                  alterarHistoricoCurricular={alterarHistoricoCurricular}
                />

                <HistoricoProfissional
                  historicosProfissionais={historicosProfissionais}
                  adicionarHistoricoProfissional={
                    adicionarHistoricoProfissional
                  }
                  removerHistoricoProfissional={removerHistoricoProfissional}
                  alterarHistoricoProfissional={alterarHistoricoProfissional}
                  alterarFotoHistoricoProfissional={
                    alterarFotoHistoricoProfissional
                  }
                />
              </>
            )}
            {/* Seção de Tipo de Perfil */}
            <div className="cartaoDestaque variacao2" id="tipo-perfil">
              <div className="grupo-formulario">
                <label>Tipo de Perfil *</label>
                <div className="botoes-tipo-perfil">
                  <button
                    type="button"
                    className={`botao-tipo ${
                      dadosFormulario.tipoPerfil === "Pessoal" ? "ativo" : ""
                    }`}
                    onClick={() =>
                      aoAlterarCampo({
                        target: { name: "tipoPerfil", value: "Pessoal" },
                      })
                    }
                  >
                    👤 Pessoal
                  </button>
                  <button
                    type="button"
                    className={`botao-tipo ${
                      dadosFormulario.tipoPerfil === "Profissional"
                        ? "ativo"
                        : ""
                    }`}
                    onClick={() =>
                      aoAlterarCampo({
                        target: { name: "tipoPerfil", value: "Profissional" },
                      })
                    }
                  >
                    💼 Profissional
                  </button>
                </div>
                <p className="texto-obrigatorio">
                  {isPerfilProfissional
                    ? "Perfil Profissional: ideal para oferecer serviços e conectar-se com clientes"
                    : "Perfil Pessoal: para buscar serviços e conectar-se com profissionais"}
                </p>
              </div>

              {/* Descrição (obrigatória para profissional, opcional para pessoal) */}
            </div>
          </div>

          {/* Seção de Descrição */}
          <div className="grupo-formulario">
            <label htmlFor="desc">
              Descrição {isPerfilProfissional && "*"}
            </label>
            <textarea
              id="desc"
              name="desc"
              value={dadosFormulario.desc}
              onChange={aoAlterarCampo}
              rows="3"
              placeholder={
                isPerfilProfissional
                  ? "Descreva seus serviços, especialidades e experiência profissional..."
                  : "Conte um pouco sobre você (opcional)"
              }
              className={
                isPerfilProfissional && erros.desc
                  ? "erro textarea-pequeno"
                  : "textarea-pequeno"
              }
            />
            {isPerfilProfissional && erros.desc && (
              <span className="mensagem-erro">{erros.desc}</span>
            )}
          </div>

          {/* Seção de Contatos */}
          <div className="cartaoDestaque variacao2 secao-completa">
            <div className="grupo-formulario">
              <label>Contatos Adicionais</label>
              <p className="texto-obrigatorio">
                Adicione outras formas de contato como LinkedIn, Facebook, etc.
              </p>

              {dadosFormulario.contatos &&
                dadosFormulario.contatos.map((contato, index) => (
                  <div key={index} className="item-contato">
                    <select
                      value={contato.tipo}
                      onChange={(e) =>
                        alterarContato(index, "tipo", e.target.value)
                      }
                      className={errosContatos[index] ? "erro" : ""}
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="Telefone">📞 Telefone</option>
                      <option value="Email">📧 Email</option>
                      <option value="Facebook">📘 Facebook</option>
                      <option value="LinkedIn">💼 LinkedIn</option>
                      <option value="Outro">🔗 Outro</option>
                    </select>
                    <input
                      type="text"
                      value={contato.valor}
                      onChange={(e) =>
                        alterarContato(index, "valor", e.target.value)
                      }
                      placeholder="Valor do contato"
                      className={errosContatos[index] ? "erro" : ""}
                    />
                    {errosContatos[index] && (
                      <span className="mensagem-erro pequena">
                        {errosContatos[index]}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removerContato(index)}
                      className="botao-remover"
                      title="Remover contato"
                    >
                      ✕
                    </button>
                  </div>
                ))}

              <button
                type="button"
                onClick={adicionarContato}
                className="botao-adicionar"
              >
                ➕ Adicionar Contato
              </button>
            </div>
          </div>

          {/* Mensagens de feedback */}
          {mensagemSucesso && (
            <div className="mensagem-sucesso">{mensagemSucesso}</div>
          )}

          {erros.submit && <div className="mensagem-erro">{erros.submit}</div>}

          {/* Botão de finalizar */}
          <button
            type="submit"
            disabled={carregando}
            className="botao-finalizar-completo"
          >
            {carregando
              ? "⏳ Cadastrando..."
              : `🎉 Criar Conta ${
                  isPerfilProfissional ? "Profissional" : "Pessoal"
                }`}
          </button>

          <p className="texto-obrigatorio textoCentro margemSuperiorPequena">
            * Campos obrigatórios
          </p>
        </div>
      </div>
    </form>
  );
};

export default FormularioCadastro;
