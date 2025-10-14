import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Corpo from "../../Componentes/Layout/Corpo.jsx";
import FormularioLoginGoogle from './Componentes/FormularioLoginGoogle.jsx';
import FormularioLogin from './Componentes/FormularioLogin.jsx';
import FormularioCadastro from './Componentes/FormularioCadastro.jsx';
import useBuscaCep from "../../Componentes/Acessibilidade/./Ganchos/UseBuscaCep.jsx";
import { servicoCadastro, servicoAuth } from '../../Servicos/Api.js';
import { useAuth } from '../../Contextos/Autenticacao.jsx';
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
    desc: '',
    inst: '',
    num: '',
    foto: null,
    tipoPerfil: 'Pessoal',
    contatos: []
  });
  
  const [erros, setErros] = useState({});
  const [errosContatos, setErrosContatos] = useState({});
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  
  // <<< CORREÇÃO 1: Declarar o estado 'carregandoSubmit'
  const [carregandoSubmit, setCarregandoSubmit] = useState(false);

  // Usar o hook de busca de CEP
  const { carregandoCep } = useBuscaCep(dadosFormulario.cep, setDadosFormulario, setErros);

  const aoAlterarCampo = (evento) => {
    const { name, value } = evento.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
    
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

  const aoEnviarFormulario = async (evento) => {
    evento.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setCarregandoSubmit(true); 
    setMensagemSucesso('');

    try {
      console.log('📧 Validando email...');
      const respostaValidacao = await servicoCadastro.validarEmail(dadosFormulario.email);
      if (!respostaValidacao.valido) {
        setErros({ email: 'Este email já está em uso' });
        setCarregandoSubmit(false); 
        return;
      }

      const dadosLocalizacao = {
        nome: `${dadosFormulario.cidade}, ${dadosFormulario.estado}`,
        cep: dadosFormulario.cep,
        cidade: dadosFormulario.cidade,
        estado: dadosFormulario.estado
      };

      const contatosValidos = dadosFormulario.contatos.filter(
        contato => contato.tipo && contato.valor
      );

      const dadosPerfil = {
        nome: dadosFormulario.nome,
        email: dadosFormulario.email,
        senha: dadosFormulario.senha,
        desc: dadosFormulario.desc,
        inst: dadosFormulario.inst,
        num: dadosFormulario.num,
        foto: dadosFormulario.foto,
        contatos: contatosValidos,
        tipoPerfil: dadosFormulario.tipoPerfil
      };

      console.log('👤 Iniciando cadastro como:', dadosFormulario.tipoPerfil);
      
      let respostaCadastro;
      if (dadosFormulario.tipoPerfil === 'Profissional') {
        respostaCadastro = await servicoCadastro.cadastrarProfissional(dadosPerfil, dadosLocalizacao);
      } else {
        respostaCadastro = await servicoCadastro.cadastrarUsuario(dadosPerfil, dadosLocalizacao);
      }

      console.log('✅ Cadastro realizado, fazendo login automático...');
      
      // CORREÇÃO: Usar os dados do cadastro para login imediato
      if (respostaCadastro.data && respostaCadastro.token) {
        login(respostaCadastro.data, respostaCadastro.token);
        setMensagemSucesso('Cadastro realizado com sucesso! Redirecionando...');
        // O redirecionamento será feito automaticamente pelo contexto de autenticação
      } else {
        throw new Error('Erro no login automático após cadastro');
      }

    } catch (erro) {
      console.error('❌ Erro no cadastro:', erro);
      setErros({ submit: erro.message || 'Erro ao realizar cadastro' });
    } finally {
      setCarregandoSubmit(false); 
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
    
    setErrosContatos(prev => {
      const novosErros = { ...prev };
      delete novosErros[indice];
      return novosErros;
    });
  };

  const alterarContato = (indice, campo, valor) => {
    setDadosFormulario(prev => {
      const novosContatos = prev.contatos.map((contato, i) => 
        i === indice ? { ...contato, [campo]: valor } : contato
      );
      
      const contatoAtualizado = novosContatos[indice];
      
      if (contatoAtualizado.tipo && contatoAtualizado.valor) {
        const erro = validarContato(contatoAtualizado.tipo, contatoAtualizado.valor);
        setErrosContatos(prevErros => ({
          ...prevErros,
          [indice]: erro
        }));
      } else {
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
        break;
      }
    }
    
    return '';
  };

  const validarFormulario = () => {
    const novosErros = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const novosErrosContatos = {};

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

    if (dadosFormulario.tipoPerfil === 'Profissional') {
      if (!dadosFormulario.desc.trim()) novosErros.desc = 'Descrição é obrigatória para perfil profissional';
    }

    dadosFormulario.contatos.forEach((contato, index) => {
      if (contato.tipo && contato.valor) {
        const erro = validarContato(contato.tipo, contato.valor);
        if (erro) {
          novosErrosContatos[index] = erro;
        }
      }
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
          <FormularioLogin />
          <FormularioLoginGoogle 
            aoSucesso={() => {}}
            aoErro={() => {}}
          />
        </div>
        
        <FormularioCadastro 
          dadosFormulario={dadosFormulario}
          erros={{...erros, errosContatos}}
          // A lógica para combinar os carregamentos está correta
          carregando={carregandoSubmit || carregandoCep} 
          mensagemSucesso={mensagemSucesso}
          aoAlterarCampo={aoAlterarCampo}
          aoSelecionarArquivo={aoSelecionarArquivo}
          aoEnviarFormulario={aoEnviarFormulario}
          setDadosFormulario={setDadosFormulario}
          adicionarContato={adicionarContato}
          removerContato={removerContato}
          alterarContato={alterarContato}
        />
      </div>
    </Corpo>
  );
};

export default Cadastro;