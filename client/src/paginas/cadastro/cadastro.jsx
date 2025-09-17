import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Corpo from "@componentes/Layout/Corpo.jsx";
import FormularioLoginGoogle from './componentes/FormularioLoginGoogle.jsx';
import FormularioLogin from './componentes/FormularioLogin.jsx';
import FormularioCadastro from './componentes/FormularioCadastro.jsx';
import { servicoCadastro, servicoAuth } from '@/servicos/api';
import { useAuth } from '@/contextos/autenticacao';
import './cadastro.css';

const Cadastro = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cep: '',
    cidade: '',
    estado: '',
    descricao: '',
    instituicao: '',
    linkedin: '',
    tipoPerfil: 'Pessoal',
    foto: null,
    historicosCurriculares: [],
    historicosProfissionais: [],
    contatos: []
  });
  
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [carregandoLogin, setCarregandoLogin] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  const [dadosLogin, setDadosLogin] = useState({
    email: '',
    senha: ''
  });

  const aoAlterarCampo = (evento) => {
    const { name, value } = evento.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
    
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: '' }));
    }
  };

  const aoAlterarCampoLogin = (evento) => {
    const { name, value } = evento.target;
    setDadosLogin(prev => ({ ...prev, [name]: value }));
    
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: '' }));
    }
  };

  const aoSelecionarArquivo = (evento) => {
    const arquivo = evento.target.files[0];
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onload = (e) => setDadosFormulario(prev => ({ ...prev, foto: e.target.result }));
      leitor.readAsDataURL(arquivo);
    }
  };

  const adicionarHistoricoCurricular = () => {
    setDadosFormulario(prev => ({
      ...prev,
      historicosCurriculares: [...prev.historicosCurriculares, { nome: '', descricao: '' }]
    }));
  };

  const removerHistoricoCurricular = (indice) => {
    setDadosFormulario(prev => ({
      ...prev,
      historicosCurriculares: prev.historicosCurriculares.filter((_, i) => i !== indice)
    }));
  };

  const alterarHistoricoCurricular = (indice, campo, valor) => {
    setDadosFormulario(prev => ({
      ...prev,
      historicosCurriculares: prev.historicosCurriculares.map((hc, i) => 
        i === indice ? { ...hc, [campo]: valor } : hc
      )
    }));
  };

  const adicionarHistoricoProfissional = () => {
    setDadosFormulario(prev => ({
      ...prev,
      historicosProfissionais: [...prev.historicosProfissionais, { nome: '', descricao: '', foto: null }]
    }));
  };

  const removerHistoricoProfissional = (indice) => {
    setDadosFormulario(prev => ({
      ...prev,
      historicosProfissionais: prev.historicosProfissionais.filter((_, i) => i !== indice)
    }));
  };

  const alterarHistoricoProfissional = (indice, campo, valor) => {
    setDadosFormulario(prev => ({
      ...prev,
      historicosProfissionais: prev.historicosProfissionais.map((hp, i) => 
        i === indice ? { ...hp, [campo]: valor } : hp
      )
    }));
  };

  const alterarFotoHistoricoProfissional = (indice, arquivo) => {
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onload = (e) => {
        setDadosFormulario(prev => ({
          ...prev,
          historicosProfissionais: prev.historicosProfissionais.map((hp, i) => 
            i === indice ? { ...hp, foto: e.target.result } : hp
          )
        }));
      };
      leitor.readAsDataURL(arquivo);
    }
  };

  const aoEnviarFormulario = async (evento) => {
    evento.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);
    setMensagemSucesso('');
    setMensagemErro('');

    try {
      const dadosLocalizacao = {
        nome: `${dadosFormulario.cidade}, ${dadosFormulario.estado}`,
        cep: dadosFormulario.cep,
        cidade: dadosFormulario.cidade,
        estado: dadosFormulario.estado
      };

      const dadosPerfil = {
        nome: dadosFormulario.nome,
        email: dadosFormulario.email,
        senha: dadosFormulario.senha,
        desc: dadosFormulario.descricao,
        inst: dadosFormulario.instituicao,
        foto: dadosFormulario.foto
      };

      if (dadosFormulario.tipoPerfil === 'Profissional') {
        dadosPerfil.linkedin = dadosFormulario.linkedin;
      }

      const respostaCadastro = await servicoCadastro.cadastrarUsuario(dadosPerfil, dadosLocalizacao);

      if (respostaCadastro.status === 'sucesso') {
        // Login automático após o cadastro
        const respostaLogin = await servicoAuth.login({
          email: dadosFormulario.email,
          senha: dadosFormulario.senha
        });
        
        login(respostaLogin.data);
        navigate("/perfil");
      } else {
        setMensagemErro(respostaCadastro.mensagem || 'Erro ao realizar cadastro');
      }

    } catch (erro) {
      console.error('Erro no cadastro:', erro);
      setMensagemErro(erro.response?.data?.mensagem || 'Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  const aoFazerLogin = async (evento) => {
    evento.preventDefault();
    
    if (!dadosLogin.email || !dadosLogin.senha) {
      setMensagemErro('Email e senha são obrigatórios');
      return;
    }

    setCarregandoLogin(true);
    setMensagemErro('');
    setMensagemSucesso('');

    try {
      const resposta = await servicoAuth.login({
        email: dadosLogin.email,
        senha: dadosLogin.senha
      });
      
      if (resposta.status === 'sucesso') {
        login(resposta.data);
        navigate('/perfil');
      } else {
        setMensagemErro(resposta.mensagem || 'Erro ao fazer login');
      }
      
    } catch (erro) {
      console.error('Erro no login:', erro);
      setMensagemErro(erro.response?.data?.mensagem || 'Erro ao conectar com o servidor');
    } finally {
      setCarregandoLogin(false);
    }
  };

  const aoSucessoLoginGoogle = (userData) => {
    console.log('Login Google realizado:', userData);
  };

  const aoErroLoginGoogle = () => {
    console.error('Erro no login com Google');
  };

  const adicionarContato = () => {
    setDadosFormulario(prev => ({
      ...prev,
      contatos: [...(prev.contatos || []), { tipo: '', valor: '' }]
    }));
  };

  const removerContato = (indice) => {
    setDadosFormulario(prev => ({
      ...prev,
      contatos: prev.contatos.filter((_, i) => i !== indice)
    }));
  };

  const alterarContato = (indice, campo, valor) => {
    setDadosFormulario(prev => ({
      ...prev,
      contatos: prev.contatos.map((contato, i) => 
        i === indice ? { ...contato, [campo]: valor } : contato
      )
    }));
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!dadosFormulario.nome) novosErros.nome = 'Nome é obrigatório';
    if (!dadosFormulario.email) novosErros.email = 'Email é obrigatório';
    if (!dadosFormulario.senha) novosErros.senha = 'Senha é obrigatória';
    if (dadosFormulario.senha !== dadosFormulario.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }
    if (!dadosFormulario.cep) novosErros.cep = 'CEP é obrigatório';
    if (!dadosFormulario.cidade) novosErros.cidade = 'Cidade é obrigatória';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  return (
    <Corpo>
      <div className="container">
        <h1 className="titulo">Criar Conta</h1>
        
        {mensagemErro && (
          <div className="mensagem-erro">
            {mensagemErro}
          </div>
        )}
        
        {mensagemSucesso && (
          <div className="mensagem-sucesso">
            {mensagemSucesso}
          </div>
        )}
        
        <div className='listaHorizontal'>
          <FormularioLogin 
            dadosLogin={dadosLogin}
            carregandoLogin={carregandoLogin}
            erros={erros}
            aoAlterarCampoLogin={aoAlterarCampoLogin}
            aoFazerLogin={aoFazerLogin}
          />
          <FormularioLoginGoogle 
            aoSucesso={aoSucessoLoginGoogle}
            aoErro={aoErroLoginGoogle}
          />
        </div>
        
        <FormularioCadastro 
          dadosFormulario={dadosFormulario}
          erros={erros}
          carregando={carregando}
          mensagemSucesso={mensagemSucesso}
          aoAlterarCampo={aoAlterarCampo}
          aoSelecionarArquivo={aoSelecionarArquivo}
          aoEnviarFormulario={aoEnviarFormulario}
          setDadosFormulario={setDadosFormulario}
          adicionarHistoricoCurricular={adicionarHistoricoCurricular}
          removerHistoricoCurricular={removerHistoricoCurricular}
          alterarHistoricoCurricular={alterarHistoricoCurricular}
          adicionarHistoricoProfissional={adicionarHistoricoProfissional}
          removerHistoricoProfissional={removerHistoricoProfissional}
          alterarHistoricoProfissional={alterarHistoricoProfissional}
          alterarFotoHistoricoProfissional={alterarFotoHistoricoProfissional}
          adicionarContato={adicionarContato}
          removerContato={removerContato}
          alterarContato={alterarContato}
        />
      </div>
    </Corpo>
  );
};

export default Cadastro;