import React from 'react';
import GoogleLoginButton from '../../../Componentes/Autenticacao/BotaoLoginGoogle.jsx';

const FormularioLoginGoogle = ({ aoSucesso, aoErro }) => {
  return (
    <div className="cartaoSecundario textoCentro paddingMedio bordaArredondada">
      <h3 className="margemInferiorPequena textoMarromEscuro">Entre rapidamente com Google</h3>
      <GoogleLoginButton 
        text="Entrar com Google"
        onSuccess={aoSucesso}
        onError={aoErro}
      />
      <p className="textoMinimo textoMarromOfuscado margemSuperiorPequena">
        Ou preencha o formulário para criar uma conta
      </p>
    </div>
  );
};

export default FormularioLoginGoogle;