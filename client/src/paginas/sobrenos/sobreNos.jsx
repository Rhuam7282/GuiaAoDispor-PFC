import React from 'react';
import Corpo from "../../componentes/Layout/Corpo.jsx";
import SecaoSobre from './Componentes/SecaoSobre.jsx';
import RedesSociais from './Componentes/RedesSociais.jsx';
import FormularioContato from './Componentes/FormularioContato.jsx';
import './sobreNos.module.css';



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

