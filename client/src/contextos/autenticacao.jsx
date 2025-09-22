import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um ProvedorAutenticacao');
  }
  return context;
};


export const ProvedorAutenticacao = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  
  const [loading, setLoading] = useState(true);

  
  const isAuthenticated = () => {
    return user !== null && token !== null;
  };

  
  const login = (userData, authToken) => {
    // Normalizar dados do usuário para garantir consistência
    const usuarioNormalizado = {
      _id: userData._id,
      nome: userData.nome,
      email: userData.email,
      foto: userData.foto || null,
      localizacao: userData.localizacao,
      desc: userData.desc,
      inst: userData.inst,
      face: userData.face,
      num: userData.num,
      // Campos para compatibilidade com Google OAuth
      name: userData.nome,
      picture: userData.foto
    };
    
    setUser(usuarioNormalizado);
    setToken(authToken);
    
    localStorage.setItem('user', JSON.stringify(usuarioNormalizado));
    localStorage.setItem('token', authToken);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('loginTimestamp', Date.now().toString());
  };

  
  const logout = () => {
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTimestamp');
  };

  
  const getUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      const isAuth = localStorage.getItem('isAuthenticated');
      const loginTimestamp = localStorage.getItem('loginTimestamp');
      
      if (storedUser && storedToken && isAuth === 'true') {
        // Verificar se o login não expirou (opcional - 7 dias)
        const agora = Date.now();
        const tempoLogin = parseInt(loginTimestamp) || 0;
        const seteDialasEmMs = 7 * 24 * 60 * 60 * 1000;
        
        if (agora - tempoLogin > seteDialasEmMs) {
          // Login expirado, limpar dados
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('loginTimestamp');
          return { user: null, token: null };
        }
        
        return { 
          user: JSON.parse(storedUser), 
          token: storedToken 
        };
      }
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
      // Limpar dados corrompidos
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('loginTimestamp');
    }
    return { user: null, token: null };
  };

  
  const atualizarUsuario = (dadosAtualizados) => {
    if (user) {
      const usuarioAtualizado = { ...user, ...dadosAtualizados };
      setUser(usuarioAtualizado);
      localStorage.setItem('user', JSON.stringify(usuarioAtualizado));
    }
  };

  
  useEffect(() => {
    const { user: storedUser, token: storedToken } = getUserFromStorage();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  
  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    getUserFromStorage,
    atualizarUsuario
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;