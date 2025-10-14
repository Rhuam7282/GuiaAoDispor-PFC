import React, { useState } from 'react';
import RedesSociais from './RedesSociais.jsx';

const FormularioContato = () => {
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });

  const aoAlterarCampo = (evento) => {
    const { name, value } = evento.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  };

  const aoEnviarFormulario = (evento) => {
    evento.preventDefault();
    console.log('Formulário enviado:', dadosFormulario);
    alert('Mensagem enviada com sucesso!');
    setDadosFormulario({ nome: '', email: '', mensagem: '' });
  };

  return (
    <section className="enviarEmail">
      <h2>Entre em contato conosco</h2>
      <form className="contact-form" onSubmit={aoEnviarFormulario}>
        <input 
          className='cartaoDestaque variacao3' 
          type="text" 
          name="nome"
          placeholder="Seu nome" 
          value={dadosFormulario.nome}
          onChange={aoAlterarCampo}
          required 
        />
        <input 
          className='cartaoDestaque variacao3' 
          type="email" 
          name="email"
          placeholder="Seu email" 
          value={dadosFormulario.email}
          onChange={aoAlterarCampo}
          required 
        />
        <textarea 
          className='cartaoDestaque variacao3'
          name="mensagem"
          placeholder="Sua mensagem" 
          value={dadosFormulario.mensagem}
          onChange={aoAlterarCampo}
          required
        />
        <button type="submit">Enviar</button>
      </form>
      <RedesSociais />
    </section>
  );
};

export default FormularioContato;

