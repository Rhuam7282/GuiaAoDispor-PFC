// client/src/contextos/Autenticacao.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAuth } from '../Servicos/Api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um ProvedorAutenticacao');
  }
  return context;
};

export const ProvedorAutenticacao = ({ children }) => {
  const navigate = useNavigate();
  
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const estaAutenticado = () => {
    return usuario !== null && token !== null;
  };

  // CORREÇÃO: Função para obter o usuário atual
  const obterUsuario = () => {
    return usuario;
  };

  const login = (dadosUsuario, tokenJWT) => {
    const usuarioNormalizado = {
      _id: dadosUsuario._id,
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      foto: dadosUsuario.foto || null,
      localizacao: dadosUsuario.localizacao,
      desc: dadosUsuario.desc,
      inst: dadosUsuario.inst,
      face: dadosUsuario.face,
      num: dadosUsuario.num,
      tipoPerfil: dadosUsuario.tipoPerfil || 'Pessoal',
      name: dadosUsuario.nome,
      picture: dadosUsuario.foto
    };
    
    setUsuario(usuarioNormalizado);
    setToken(tokenJWT);
    
    localStorage.setItem('usuario', JSON.stringify(usuarioNormalizado));
    localStorage.setItem('token', tokenJWT);
    localStorage.setItem('autenticado', 'true');
    localStorage.setItem('timestampLogin', Date.now().toString());
    
    console.log('✅ Login realizado:', usuarioNormalizado.nome);
    
    // Redirecionar para qualificados após login
    navigate('/qualificados');
  };

  const logout = async () => {
    try {
      await servicoAuth.logout();
    } catch (erro) {
      console.warn('⚠️ Erro no logout da API:', erro.message);
    } finally {
      setUsuario(null);
      setToken(null);
      
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      localStorage.removeItem('autenticado');
      localStorage.removeItem('timestampLogin');
      localStorage.removeItem('emailLembrado');
      localStorage.removeItem('lembrarMe');
      
      console.log('🚪 Logout realizado');
      // Redirecionar para página inicial após logout
      navigate('/');
    }
  };

  const atualizarUsuario = async (dadosAtualizados) => {
    if (!usuario) return;

    try {
      const resposta = await servicoAuth.editarPerfil(usuario._id, dadosAtualizados);
      
      if (resposta.data) {
        const usuarioAtualizado = { ...usuario, ...resposta.data };
        setUsuario(usuarioAtualizado);
        localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
        console.log('✅ Usuário atualizado:', usuarioAtualizado.nome);
        return usuarioAtualizado;
      }
    } catch (erro) {
      console.error('❌ Erro ao atualizar usuário:', erro);
      throw erro;
    }
  };

  const obterDadosArmazenados = () => {
    try {
      const usuarioArmazenado = localStorage.getItem('usuario');
      const tokenArmazenado = localStorage.getItem('token');
      const autenticado = localStorage.getItem('autenticado') === 'true';

      if (usuarioArmazenado && tokenArmazenado && autenticado) {
        return {
          usuario: JSON.parse(usuarioArmazenado),
          token: tokenArmazenado,
          autenticado: true
        };
      }
    } catch (erro) {
      console.error('❌ Erro ao obter dados armazenados:', erro);
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      localStorage.removeItem('autenticado');
      localStorage.removeItem('timestampLogin');
    }
    
    return { usuario: null, token: null, autenticado: false };
  };

  useEffect(() => {
    const inicializarAuth = async () => {
      setCarregando(true);
      
      const { usuario: usuarioArmazenado, token: tokenArmazenado, autenticado } = obterDadosArmazenados();
      
      if (autenticado && usuarioArmazenado && tokenArmazenado) {
        try {
          const resposta = await servicoAuth.buscarPerfilLogado(usuarioArmazenado._id);
          
          if (resposta.data) {
            setUsuario(usuarioArmazenado);
            setToken(tokenArmazenado);
            console.log('✅ Sessão válida - usuário autenticado:', usuarioArmazenado.nome);
          } else {
            throw new Error('Perfil não encontrado');
          }
        } catch (erro) {
          console.log('🔒 Sessão inválida - realizando logout silencioso');
          // Limpa os dados de autenticação sem redirecionar
          localStorage.removeItem('usuario');
          localStorage.removeItem('token');
          localStorage.removeItem('autenticado');
          localStorage.removeItem('timestampLogin');
          setUsuario(null);
          setToken(null);
        }
      } else {
        console.log('🔍 Nenhuma sessão ativa');
      }
      
      setCarregando(false);
    };

    inicializarAuth();
  }, [navigate]);

  const valor = {
    usuario,
    token,
    carregando,
    estaAutenticado,
    obterUsuario,
    login,
    logout,
    atualizarUsuario,
    obterDadosArmazenados
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
