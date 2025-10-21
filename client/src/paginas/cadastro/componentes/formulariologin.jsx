import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contextos/autenticacao.jsx';
import { servicoAuth } from '../../../servicos/api.js';
import GoogleLoginButton from '../../../componentes/autenticacao/botaologingoogle.jsx';
import { Eye, EyeOff } from 'lucide-react';

const FormularioLogin = () => {
  const navigate = useNavigate();
  const { login, estaAutenticado } = useAuth();
  
  const [dadosLogin, setDadosLogin] = useState({
    email: '',
    senha: ''
  });
  
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrarMe, setLembrarMe] = useState(false);

  useEffect(() => {
    if (estaAutenticado()) {
      navigate('/qualificados');
    }
  }, [estaAutenticado, navigate]);

  useEffect(() => {
    const emailSalvo = localStorage.getItem('emailLembrado');
    const lembrarSalvo = localStorage.getItem('lembrarMe') === 'true';
    
    if (emailSalvo && lembrarSalvo) {
      setDadosLogin(prev => ({ ...prev, email: emailSalvo }));
      setLembrarMe(true);
    }
  }, []);

  const aoAlterarCampo = (evento) => {
    const { name, value } = evento.target;
    setDadosLogin(prev => ({ ...prev, [name]: value }));
    
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: '' }));
    }
    if (erros.geral) {
      setErros(prev => ({ ...prev, geral: '' }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!dadosLogin.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!emailRegex.test(dadosLogin.email)) {
      novosErros.email = 'Email inválido';
    }

    if (!dadosLogin.senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (dadosLogin.senha.length < 6) {
      novosErros.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const aoFazerLogin = async (evento) => {
    evento.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);
    setErros({});

    try {
      console.log('🔐 Tentando login...', dadosLogin.email);
      
      if (lembrarMe) {
        localStorage.setItem('emailLembrado', dadosLogin.email);
        localStorage.setItem('lembrarMe', 'true');
      } else {
        localStorage.removeItem('emailLembrado');
        localStorage.removeItem('lembrarMe');
      }

      const resposta = await servicoAuth.login(dadosLogin.email, dadosLogin.senha);
      
      console.log('✅ Resposta do servidor:', resposta);
      
      if (resposta.data && resposta.token) {
        console.log('✅ Login bem-sucedido:', resposta.data.nome);
        login(resposta.data, resposta.token);
      } else {
        throw new Error('Resposta de login inválida');
      }
      
    } catch (erro) {
      console.error('❌ Erro no login:', erro);
      
      let mensagemErro = 'Erro ao fazer login';
      
      if (erro.message.includes('Credenciais inválidas')) {
        mensagemErro = 'Email ou senha incorretos';
      } else if (erro.message.includes('Email não encontrado')) {
        mensagemErro = 'Email não cadastrado';
      } else if (erro.message.includes('Erro de conexão')) {
        mensagemErro = 'Erro de conexão. Verifique sua internet.';
      } else if (erro.message.includes('fetch')) {
        mensagemErro = 'Servidor indisponível. Tente novamente mais tarde.';
      } else {
        mensagemErro = erro.message || 'Erro ao fazer login';
      }
      
      setErros({ geral: mensagemErro });
    } finally {
      setCarregando(false);
    }
  };

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  // const lidarEsqueciSenha = () => {
  //   console.log('Redirecionar para recuperação de senha');
  // };

  const aoSucessoLoginGoogle = (userData) => {
    console.log('Login Google realizado:', userData);
  };

  const aoErroLoginGoogle = () => {
    console.error('Erro no login com Google');
  };

  return (
    <div className="cartao-login-unificado">
      <div className="cabecalho-login-unificado">
        <h1 className="titulo-login-unificado">Entre na sua conta</h1>
        <p className="subtitulo-login-unificado">
          Acesse com suas credenciais ou usando sua conta Google
        </p>
      </div>

      <div className="conteudo-login-unificado">
        <div className="formulario-login-container">
          <form onSubmit={aoFazerLogin} className="formulario-login">
            {erros.geral && (
              <div className="mensagem-erro-geral">
                {erros.geral}
              </div>
            )}

            <div className="grupo-formulario">
              <label htmlFor="email" className="rotulo-campo">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={dadosLogin.email}
                onChange={aoAlterarCampo}
                className={`campo-input ${erros.email ? 'erro' : ''}`}
                placeholder="seu@email.com"
                disabled={carregando}
              />
              {erros.email && (
                <span className="mensagem-erro-campo">{erros.email}</span>
              )}
            </div>

            <div className="grupo-formulario">
              <label htmlFor="senha" className="rotulo-campo">
                Senha
              </label>
              <div className="container-senha">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  id="senha"
                  name="senha"
                  value={dadosLogin.senha}
                  onChange={aoAlterarCampo}
                  className={`campo-input ${erros.senha ? 'erro' : ''}`}
                  placeholder="Sua senha"
                  disabled={carregando}
                />
                <button
                  type="button"
                  className="botao-visibilidade"
                  onClick={toggleMostrarSenha}
                  disabled={carregando}
                >
                  {mostrarSenha ? <Eye /> : <EyeOff/>}
                </button>
              </div>
              {erros.senha && (
                <span className="mensagem-erro-campo">{erros.senha}</span>
              )}
            </div>

            <div className="linha-opcoes">
              {/* <label className="opcao-lembrar">
                <input
                  type="checkbox"
                  checked={lembrarMe}
                  onChange={(e) => setLembrarMe(e.target.checked)}
                  disabled={carregando}
                />
                <span className="texto-lembrar">Lembrar-me</span>
              </label> */}
              
              {/* <button
                type="button"
                className="link-esqueci-senha"
                onClick={lidarEsqueciSenha}
                disabled={carregando}
              >
                Esqueci minha senha
              </button> */}
            </div>

            <button
              type="submit"
              className="botao-login"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <div className="spinner-login"></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        <div className="login-google-container">
          <div className="separador-login-google">
            <span>Ou entre com</span>
          </div>
          
          <GoogleLoginButton 
            text="Entrar com Google"
            onSuccess={aoSucessoLoginGoogle}
            onError={aoErroLoginGoogle}
          />
          
          <p className="texto-apoio">
            Entre rapidamente com sua conta Google
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormularioLogin;