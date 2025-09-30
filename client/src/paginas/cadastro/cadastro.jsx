import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Corpo from "@Componentes/Layout/Corpo.jsx";
import FormularioLoginGoogle from './Componentes/FormularioLoginGoogle.jsx';
import FormularioLogin from './Componentes/FormularioLogin.jsx';
import FormularioCadastro from './Componentes/FormularioCadastro.jsx';
import { servicoCadastro, servicoAuth } from '@Servicos/api.js';
import { useAuth } from '@Contextos/Autenticacao.jsx';
import './Cadastro.css';

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
  const [errosContatos, setErrosContatos] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const [dadosLogin, setDadosLogin] = useState({
    email: '',
    senha: ''
  });
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

  const aoEnviarFormulario = async (evento) => {
    evento.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);
    setMensagemSucesso('');

    try {
      console.log('📧 Validando email...');
      // Primeiro validar email único
      const respostaValidacao = await servicoCadastro.validarEmail(dadosFormulario.email);
      if (!respostaValidacao.valido) {
        setErros({ email: 'Este email já está em uso' });
        setCarregando(false);
        return;
      }

      const dadosLocalizacao = {
        nome: `${dadosFormulario.cidade}, ${dadosFormulario.estado}`,
        cep: dadosFormulario.cep,
        cidade: dadosFormulario.cidade,
        estado: dadosFormulario.estado
      };

      // Filtrar contatos válidos (com tipo e valor)
      const contatosValidos = dadosFormulario.contatos.filter(
        contato => contato.tipo && contato.valor
      );

      // Preparar dados do perfil com contatos mapeados
      const dadosPerfil = {
        nome: dadosFormulario.nome,
        email: dadosFormulario.email,
        senha: dadosFormulario.senha,
        desc: dadosFormulario.descricao,
        inst: dadosFormulario.instituicao,
        foto: dadosFormulario.foto,
        contatos: contatosValidos,
        tipoPerfil: dadosFormulario.tipoPerfil
      };

      if (dadosFormulario.tipoPerfil === 'Profissional') {
        dadosPerfil.linkedin = dadosFormulario.linkedin;
      }

      console.log('👤 Iniciando cadastro...');
      const respostaCadastro = await servicoCadastro.cadastrarUsuario(dadosPerfil, dadosLocalizacao);

      console.log('🔐 Realizando login automático...');
      const respostaLogin = await servicoAuth.login(dadosFormulario.email, dadosFormulario.senha);
      
      if (respostaLogin.data && respostaLogin.token) {
        login(respostaLogin.data, respostaLogin.token);
        setMensagemSucesso('Cadastro realizado com sucesso! Redirecionando...');
        setTimeout(() => navigate("/perfil"), 2000);
      } else {
        throw new Error('Erro no login automático após cadastro');
      }

    } catch (erro) {
      console.error('❌ Erro no cadastro:', erro);
      setErros({ submit: erro.message || 'Erro ao realizar cadastro' });
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
      console.log('🔐 Tentando login...');
      const resposta = await servicoAuth.login(dadosLogin.email, dadosLogin.senha);
      
      if (resposta.data && resposta.token) {
        login(resposta.data, resposta.token);
        navigate('/perfil');
      } else {
        throw new Error('Resposta de login inválida');
      }
      
    } catch (erro) {
      console.error('❌ Erro no login:', erro);
      setErros({ login: erro.message || 'Erro ao fazer login' });
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
    
    // Remover também qualquer erro associado a este contato
    setErrosContatos(prev => {
      const novosErros = { ...prev };
      delete novosErros[indice];
      return novosErros;
    });
  };

  const validarContato = (tipo, valor) => {
    if (!valor.trim()) return 'Campo obrigatório';
    
    switch (tipo) {
      case 'Email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) return 'Email inválido';
        break;
      }
      case 'Telefone': {
        const telefoneRegex = /^(\d{2}\s?\d{4,5}\s?\d{4})|(\(\d{2}\)\s?\d{4,5}?\d{4})$/;
        if (!telefoneRegex.test(valor.replace(/\s/g, ''))) return 'Telefone inválido';
        break;
      }
      case 'LinkedIn': {
        const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/;
        if (!linkedinRegex.test(valor)) return 'URL do LinkedIn inválida';
        break;
      }
      case 'Facebook': {
        const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/.+/;
        if (!facebookRegex.test(valor)) return 'URL do Facebook inválida';
        break;
      }
      default: {
        // Para tipo "Outro", não há validação específica
        break;
      }
    }
    
    return '';
  };

  const alterarContato = (indice, campo, valor) => {
    setDadosFormulario(prev => {
      const novosContatos = prev.contatos.map((contato, i) => 
        i === indice ? { ...contato, [campo]: valor } : contato
      );
      
      // Validar o contato apenas se ambos os campos estiverem preenchidos
      const contatoAtualizado = novosContatos[indice];
      
      if (contatoAtualizado.tipo && contatoAtualizado.valor) {
        const erro = validarContato(contatoAtualizado.tipo, contatoAtualizado.valor);
        setErrosContatos(prevErros => ({
          ...prevErros,
          [indice]: erro
        }));
      } else {
        // Limpar erro se um dos campos estiver vazio
        setErrosContatos(prevErros => {
          const novosErros = { ...prevErros };
          delete novosErros[indice];
          return novosErros;
        });
      }
      
      return {
        ...prev,
        contatos: novosContatos
      };
    });
  };

  const validarFormulario = () => {
    const novosErros = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const novosErrosContatos = {};

    // Validações básicas
    if (!dadosFormulario.nome.trim()) novosErros.nome = 'Nome é obrigatório';
    
    if (!dadosFormulario.email) {
      novosErros.email = 'Email é obrigatório';
    } else if (!emailRegex.test(dadosFormulario.email)) {
      novosErros.email = 'Email inválido';
    }
    
    if (!dadosFormulario.senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (dadosFormulario.senha.length < 8) {
      novosErros.senha = 'A senha deve ter pelo menos 8 caracteres';
    }
    
    if (dadosFormulario.senha !== dadosFormulario.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }
    
    if (!dadosFormulario.cep) novosErros.cep = 'CEP é obrigatório';
    if (!dadosFormulario.cidade) novosErros.cidade = 'Cidade é obrigatória';

    // Validações específicas para perfil profissional
    if (dadosFormulario.tipoPerfil === 'Profissional') {
      if (!dadosFormulario.descricao.trim()) novosErros.descricao = 'Descrição é obrigatória para perfil profissional';
      if (!dadosFormulario.instituicao.trim()) novosErros.instituicao = 'Instituição é obrigatória para perfil profissional';
    }

    // Validar apenas contatos que têm ambos os campos preenchidos
    dadosFormulario.contatos.forEach((contato, index) => {
      if (contato.tipo && contato.valor) {
        const erro = validarContato(contato.tipo, contato.valor);
        if (erro) {
          novosErrosContatos[index] = erro;
        }
      }
      // Contatos incompletos (apenas um campo preenchido) não geram erro - são ignorados no submit
    });

    setErros(novosErros);
    setErrosContatos(novosErrosContatos);

    return Object.keys(novosErros).length === 0 && Object.keys(novosErrosContatos).length === 0;
  };

  return (
    <Corpo>
      <div className="container">
        <h1 className="titulo">Criar Conta</h1>
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
          erros={{...erros, errosContatos}}
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