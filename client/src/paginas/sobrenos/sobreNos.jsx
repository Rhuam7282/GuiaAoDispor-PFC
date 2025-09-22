import React from 'react';
import Corpo from "@componentes/Layout/Corpo";
import SecaoSobre from './componentes/SecaoSobre';
import RedesSociais from './componentes/RedesSociais';
import FormularioContato from './componentes/FormularioContato';
import './sobreNos.css';


const SobreNos = () => {
  return (
    <Corpo>
      <main className="container">
       <h1 className='titulo'>Sobre</h1>
      <SecaoSobre />
      <FormularioContato />
      </main>
      
    </Corpo>
  );
};


export default SobreNos;

