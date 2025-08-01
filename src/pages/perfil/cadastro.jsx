import React, { useState } from "react";
import "./cadastro.css";
import { Eye, EyeOff, Info } from "lucide-react";
import Corpo from "../../components/layout/corpo";

const Cadastro = ({
  onLogin,
  onCadastro,
  mostrarLogin = false,
  classeAdicional = "",
}) => {
  const [modoLogin, setModoLogin] = useState(mostrarLogin);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacaoSenha, setMostrarConfirmacaoSenha] = useState(false);
  const [mostrarTooltips, setMostrarTooltips] = useState({});

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmacaoSenha: "",
  });

  const [erros, setErros] = useState({});

  const alternarModo = () => {
    setModoLogin(!modoLogin);
    setFormData({
      nome: "",
      email: "",
      senha: "",
      confirmacaoSenha: "",
    });
    setErros({});
  };

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const alternarVisibilidadeConfirmacaoSenha = () => {
    setMostrarConfirmacaoSenha(!mostrarConfirmacaoSenha);
  };

  const mostrarTooltip = (campo) => {
    setMostrarTooltips((prev) => ({
      ...prev,
      [campo]: true,
    }));
  };

  const esconderTooltip = (campo) => {
    setMostrarTooltips((prev) => ({
      ...prev,
      [campo]: false,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro quando o usuário começar a digitar
    if (erros[name]) {
      setErros((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!modoLogin && !formData.nome.trim()) {
      novosErros.nome = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      novosErros.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      novosErros.email = "Email inválido";
    }

    if (!formData.senha) {
      novosErros.senha = "Senha é obrigatória";
    } else if (!modoLogin && formData.senha.length < 6) {
      novosErros.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!modoLogin && !formData.confirmacaoSenha) {
      novosErros.confirmacaoSenha = "Confirmação de senha é obrigatória";
    } else if (!modoLogin && formData.senha !== formData.confirmacaoSenha) {
      novosErros.confirmacaoSenha = "Senhas não coincidem";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      if (modoLogin) {
        onLogin &&
          onLogin({
            email: formData.email,
            senha: formData.senha,
          });
      } else {
        onCadastro &&
          onCadastro({
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
          });
      }
    }
  };

  const tooltipTextos = {
    nome: "Digite seu nome completo para identificação",
    email: "Insira um email válido para acesso à conta",
    senha: modoLogin
      ? "Digite sua senha"
      : "Crie uma senha com pelo menos 6 caracteres",
    confirmacaoSenha: "Digite novamente a senha para confirmação",
  };

  return (
    <Corpo>
      <div className={`cadastro-container ${classeAdicional}`}>
        <div className="cadastro-card">
          <div className="cadastro-header">
            <h2 className="cadastro-titulo">
              {modoLogin ? "Entrar na Conta" : "Criar Conta"}
            </h2>
            <p className="cadastro-subtitulo">
              {modoLogin
                ? "Acesse sua conta para continuar"
                : "Preencha os dados para criar sua conta"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="cadastro-form">
            {!modoLogin && (
              <div className="campo-grupo">
                <label htmlFor="nome" className="campo-label">
                  Nome Completo
                  <button
                    type="button"
                    className="tooltip-trigger"
                    onMouseEnter={() => mostrarTooltip("nome")}
                    onMouseLeave={() => esconderTooltip("nome")}
                    onClick={() => mostrarTooltip("nome")}
                  >
                    <Info size={16} />
                  </button>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={`campo-input ${erros.nome ? "erro" : ""}`}
                  placeholder="Digite seu nome completo"
                />
                {erros.nome && <span className="erro-texto">{erros.nome}</span>}
                {mostrarTooltips.nome && (
                  <div className="tooltip">{tooltipTextos.nome}</div>
                )}
              </div>
            )}

            <div className="campo-grupo">
              <label htmlFor="email" className="campo-label">
                Email
                <button
                  type="button"
                  className="tooltip-trigger"
                  onMouseEnter={() => mostrarTooltip("email")}
                  onMouseLeave={() => esconderTooltip("email")}
                  onClick={() => mostrarTooltip("email")}
                >
                  <Info size={16} />
                </button>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`campo-input ${erros.email ? "erro" : ""}`}
                placeholder="Digite seu email"
              />
              {erros.email && <span className="erro-texto">{erros.email}</span>}
              {mostrarTooltips.email && (
                <div className="tooltip">{tooltipTextos.email}</div>
              )}
            </div>

            <div className="campo-grupo">
              <label htmlFor="senha" className="campo-label">
                Senha
                <button
                  type="button"
                  className="tooltip-trigger"
                  onMouseEnter={() => mostrarTooltip("senha")}
                  onMouseLeave={() => esconderTooltip("senha")}
                  onClick={() => mostrarTooltip("senha")}
                >
                  <Info size={16} />
                </button>
              </label>
              <div className="campo-senha">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  className={`campo-input ${erros.senha ? "erro" : ""}`}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="botao-visibilidade"
                  onClick={alternarVisibilidadeSenha}
                >
                  {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {erros.senha && <span className="erro-texto">{erros.senha}</span>}
              {mostrarTooltips.senha && (
                <div className="tooltip">{tooltipTextos.senha}</div>
              )}
            </div>

            {!modoLogin && (
              <div className="campo-grupo">
                <label htmlFor="confirmacaoSenha" className="campo-label">
                  Confirmar Senha
                  <button
                    type="button"
                    className="tooltip-trigger"
                    onMouseEnter={() => mostrarTooltip("confirmacaoSenha")}
                    onMouseLeave={() => esconderTooltip("confirmacaoSenha")}
                    onClick={() => mostrarTooltip("confirmacaoSenha")}
                  >
                    <Info size={16} />
                  </button>
                </label>
                <div className="campo-senha">
                  <input
                    type={mostrarConfirmacaoSenha ? "text" : "password"}
                    id="confirmacaoSenha"
                    name="confirmacaoSenha"
                    value={formData.confirmacaoSenha}
                    onChange={handleInputChange}
                    className={`campo-input ${
                      erros.confirmacaoSenha ? "erro" : ""
                    }`}
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    className="botao-visibilidade"
                    onClick={alternarVisibilidadeConfirmacaoSenha}
                  >
                    {mostrarConfirmacaoSenha ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {erros.confirmacaoSenha && (
                  <span className="erro-texto">{erros.confirmacaoSenha}</span>
                )}
                {mostrarTooltips.confirmacaoSenha && (
                  <div className="tooltip">
                    {tooltipTextos.confirmacaoSenha}
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="botao-submit">
              {modoLogin ? "Entrar" : "Criar Conta"}
            </button>
          </form>

          <div className="cadastro-footer">
            <p className="alternar-modo">
              {modoLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
              <button
                type="button"
                className="link-alternar"
                onClick={alternarModo}
              >
                {modoLogin ? "Criar conta" : "Fazer login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </Corpo>
  );
};

export default Cadastro;
