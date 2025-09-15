import React from 'react';

const FormularioLogin = ({ 
  dadosLogin, 
  carregandoLogin, 
  erros, 
  aoAlterarCampoLogin, 
  aoFazerLogin
}) => {
  return (
    <div className="cartao cartaoSecundario margemGrande paddingMedio bordaArredondada larguraCompleta">
      <div className="textoCentro margemInferiorMedia">
        <h3 className="textoMarromEscuro">Já tem uma conta?</h3>
        <p className="textoPequeno textoMarromOfuscado">Faça login abaixo</p>
      </div>
      
      <form onSubmit={aoFazerLogin} className="formulario-login">
        <div className="grupo-formulario">
          <label htmlFor="emailLogin">Email</label>
          <input
            type="email"
            id="emailLogin"
            name="email"
            value={dadosLogin.email}
            onChange={aoAlterarCampoLogin}
            className={erros.login ? 'erro' : ''}
          />
        </div>
        
        <div className="grupo-formulario">
          <label htmlFor="senhaLogin">Senha</label>
          <input
            type="password"
            id="senhaLogin"
            name="senha"
            value={dadosLogin.senha}
            onChange={aoAlterarCampoLogin}
            className={erros.login ? 'erro' : ''}
          />
        </div>
        
        {erros.login && <span className="mensagem-erro">{erros.login}</span>}
        
        <button 
          type="submit" 
          className="botao botaoPrimario margemSuperiorMedia"
          disabled={carregandoLogin}
        >
          {carregandoLogin ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default FormularioLogin;