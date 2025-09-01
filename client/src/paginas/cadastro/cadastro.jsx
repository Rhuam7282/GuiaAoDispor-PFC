import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Corpo from "@componentes/layout/corpo.jsx";
import FormularioLoginGoogle from './componentes/FormularioLoginGoogle.jsx';
import FormularioLogin from './componentes/FormularioLogin.jsx';
import FormularioCadastro from './componentes/FormularioCadastro.jsx';
import { servicoCadastro, servicoAuth } from '@/servicos/apiService';
import { useAuth } from '@/contextos/AuthContext';
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
    facebook: '',
    telefone: '',
    linkedin: '',
    tipoPerfil: 'Pessoal',
    foto: null,
    historicosCurriculares: [],
    historicosProfissionais: []
  });
  
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const [dadosLogin, setDadosLogin] = useState({
    email: '',
    senha: ''
  });
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [carregandoLogin, setCarregandoLogin] = useState(false);

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

    if (dadosFormulario.tipoPerfil === 'Profissional') {
      if (!dadosFormulario.descricao) {
        novosErros.descricao = 'Descrição é obrigatória para profissionais';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const aoEnviarFormulario = async (evento) => {
    evento.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);
    setMensagemSucesso('');

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
        face: dadosFormulario.facebook,
        num: dadosFormulario.telefone,
        foto: dadosFormulario.foto
      };

      if (dadosFormulario.tipoPerfil === 'Profissional') {
        dadosPerfil.linkedin = dadosFormulario.linkedin;
      }

      let resposta;
      if (dadosFormulario.tipoPerfil === 'Pessoal') {
        resposta = await servicoCadastro.cadastrarUsuario(dadosPerfil, dadosLocalizacao);
      } else {
        resposta = await servicoCadastro.cadastrarProfissionalComHistoricos(
          dadosPerfil, 
          dadosLocalizacao, 
          dadosFormulario.historicosCurriculares, 
          dadosFormulario.historicosProfissionais
        );
      }

      setMensagemSucesso('Cadastro realizado com sucesso!');
      
      setDadosFormulario({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        cep: '',
        cidade: '',
        estado: '',
        descricao: '',
        instituicao: '',
        facebook: '',
        telefone: '',
        linkedin: '',
        tipoPerfil: 'Pessoal',
        foto: null,
        historicosCurriculares: [],
        historicosProfissionais: []
      });

    } catch (erro) {
      console.error('Erro no cadastro:', erro);
      setErros({ submit: erro.message });
    } finally {
      setCarregando(false);
    }
  };

  const aoFazerLogin = async (evento) => {
    evento.preventDefault();
    
    if (!dadosLogin.email || !dadosLogin.senha) {
      setErros({ login: 'Email e senha são obrigatórios' });
      return;
    }

    setCarregandoLogin(true);
    setErros({});

    try {
      const resposta = await servicoAuth.login(dadosLogin.email, dadosLogin.senha);
      
      login(resposta.data);
      
      navigate('/perfil');
      
    } catch (erro) {
      console.error('Erro no login:', erro);
      setErros({ login: erro.message });
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

  const alternarMostrarLogin = () => {
    setMostrarLogin(!mostrarLogin);
  };

  return (
    <Corpo>
      <div className="container">
        <h1 className="titulo">Criar Conta</h1>
        
        <FormularioLoginGoogle 
          aoSucesso={aoSucessoLoginGoogle}
          aoErro={aoErroLoginGoogle}
        />

        <FormularioLogin 
          dadosLogin={dadosLogin}
          mostrarLogin={mostrarLogin}
          carregandoLogin={carregandoLogin}
          erros={erros}
          aoAlterarCampoLogin={aoAlterarCampoLogin}
          aoFazerLogin={aoFazerLogin}
          alternarMostrarLogin={alternarMostrarLogin}
        />
        
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
        />
      </div>
    </Corpo>
  );
};

export default Cadastro;

