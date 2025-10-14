import React from 'react';
import GoogleLoginButton from '../../../componentes/autenticacao/botaologingoogle.jsx';

const FormularioLoginGoogle = ({ aoSucesso, aoErro }) => {
  return (
    <div className="cartao cartaoSecundario textoCentro margemGrande paddingMedio bordaArredondada flexWrap ">
      <h3 className="margemInferiorPequena textoMarromEscuro">Entre rapidamente com sua conta Google</h3>
      <GoogleLoginButton 
        className="alinharCentro"
        text="Entrar com Google"
        onSuccess={aoSucesso}
        onError={aoErro}
      />
      <p className="margemSuperiorPequena textoMinimo textoMarromOfuscado bordaSuperiorSubtle paddingSuperiorPequeno">
        Ou preencha o formulário abaixo para criar uma conta tradicional
      </p>
    </div>
  );
};

export default FormularioLoginGoogle;

