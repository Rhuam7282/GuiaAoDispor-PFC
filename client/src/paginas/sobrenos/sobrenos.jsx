import React from 'react';
import Corpo from "../../componentes/layout/corpo.jsx";
import SecaoSobre from './componentes/secaosobre.jsx';
import RedesSociais from './componentes/redessociais.jsx';
import FormularioContato from './componentes/formulariocontato.jsx';
import './sobrenos.css';

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
