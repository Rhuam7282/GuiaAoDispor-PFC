import React from 'react';
import Corpo from "@componentes/layout/corpo";
import SecaoSobre from './componentes/SecaoSobre';
import FormularioContato from './componentes/FormularioContato';
import './sobreNos.css';

const SobreNosPage = () => {
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

export default SobreNosPage;

