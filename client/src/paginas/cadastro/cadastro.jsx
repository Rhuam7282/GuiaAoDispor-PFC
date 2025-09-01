import React, { useState } from 'react';
import Corpo from "@componentes/layout/corpo.jsx";
import GoogleLoginButton from '@componentes/auth/botaoLoginGoogle.jsx';
import { servicoCadastro } from '@/servicos/apiService';
import './cadastro.css';

const Cadastro = () => {
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

  return (
    <Corpo>
      <div className="container">
        <h1 className="titulo">Criar Conta</h1>
        
        {/* Seção de login com Google */}
        <form onSubmit={aoEnviarFormulario} className="formulario-cadastro">
          <div className="conteudo-formulario">
            <div className="campos-formulario">
              <div className="grupo-formulario">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={dadosFormulario.nome}
                  onChange={aoAlterarCampo}
                  className={erros.nome ? 'erro' : ''}
                />
                {erros.nome && <span className="mensagem-erro">{erros.nome}</span>}
              </div>

              <div className="grupo-formulario">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={dadosFormulario.email}
                  onChange={aoAlterarCampo}
                  className={erros.email ? 'erro' : ''}
                />
                {erros.email && <span className="mensagem-erro">{erros.email}</span>}
              </div>

              <div className="linha-senhas">
                <div className="grupo-formulario">
                  <label htmlFor="senha">Senha *</label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={dadosFormulario.senha}
                    onChange={aoAlterarCampo}
                    className={erros.senha ? 'erro' : ''}
                  />
                  {erros.senha && <span className="mensagem-erro">{erros.senha}</span>}
                </div>

                <div className="grupo-formulario">
                  <label htmlFor="confirmarSenha">Confirmar Senha *</label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={dadosFormulario.confirmarSenha}
                    onChange={aoAlterarCampo}
                    className={erros.confirmarSenha ? 'erro' : ''}
                  />
                  {erros.confirmarSenha && <span className="mensagem-erro">{erros.confirmarSenha}</span>}
                </div>
              </div>

              <div className="linha-endereco">
                <div className="grupo-formulario grupo-cep">
                  <label htmlFor="cep">CEP *</label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    value={dadosFormulario.cep}
                    onChange={aoAlterarCampo}
                    className={erros.cep ? 'erro' : ''}
                  />
                  {erros.cep && <span className="mensagem-erro">{erros.cep}</span>}
                </div>

                <div className="grupo-formulario">
                  <label htmlFor="cidade">Cidade *</label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    value={dadosFormulario.cidade}
                    onChange={aoAlterarCampo}
                    className={erros.cidade ? 'erro' : ''}
                  />
                  {erros.cidade && <span className="mensagem-erro">{erros.cidade}</span>}
                </div>

                <div className="grupo-formulario">
                  <label htmlFor="estado">Estado</label>
                  <input
                    type="text"
                    id="estado"
                    name="estado"
                    value={dadosFormulario.estado}
                    onChange={aoAlterarCampo}
                  />
                </div>
              </div>

              <div className="cartaoDestaque variacao2" id='tipo-perfil'>
                <div>
                  <span>Tipo de Perfil</span>
                </div>
                <div className="listaIcones">
                  <button
                    type="button"
                    className={dadosFormulario.tipoPerfil === 'Pessoal' ? 'ativo' : ''}
                    onClick={() => setDadosFormulario(prev => ({ ...prev, tipoPerfil: 'Pessoal' }))}
                  >
                    Pessoal
                  </button>
                  <button
                    type="button"
                    className={dadosFormulario.tipoPerfil === 'Profissional' ? 'ativo' : ''}
                    onClick={() => setDadosFormulario(prev => ({ ...prev, tipoPerfil: 'Profissional' }))}
                  >
                    Profissional
                  </button>
                </div>
                <p className="texto-obrigatorio">* Campos obrigatórios</p>
              </div>

              {dadosFormulario.tipoPerfil === 'Profissional' && (
                <>
                  <div className="grupo-formulario">
                    <label htmlFor="descricao">Descrição Profissional *</label>
                    <textarea
                      id="descricao"
                      name="descricao"
                      value={dadosFormulario.descricao}
                      onChange={aoAlterarCampo}
                      rows="3"
                      className={erros.descricao ? 'erro' : ''}
                    />
                    {erros.descricao && <span className="mensagem-erro">{erros.descricao}</span>}
                  </div>

                  <div className="grupo-formulario">
                    <label htmlFor="instituicao">Instituição/Formação</label>
                    <input
                      type="text"
                      id="instituicao"
                      name="instituicao"
                      value={dadosFormulario.instituicao}
                      onChange={aoAlterarCampo}
                    />
                  </div>

                  <div className="grupo-formulario">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={dadosFormulario.linkedin}
                      onChange={aoAlterarCampo}
                    />
                  </div>

                  <div className="cartaoDestaque variacao3">
                    <h3>Histórico Curricular</h3>
                    {dadosFormulario.historicosCurriculares.map((hc, indice) => (
                      <div key={indice} className="item-historico">
                        <div className="grupo-formulario">
                          <label htmlFor={`hc-nome-${indice}`}>Título</label>
                          <input
                            type="text"
                            id={`hc-nome-${indice}`}
                            value={hc.nome}
                            onChange={(e) => alterarHistoricoCurricular(indice, 'nome', e.target.value)}
                          />
                        </div>
                        <div className="grupo-formulario">
                          <label htmlFor={`hc-descricao-${indice}`}>Descrição</label>
                          <textarea
                            id={`hc-descricao-${indice}`}
                            value={hc.descricao}
                            onChange={(e) => alterarHistoricoCurricular(indice, 'descricao', e.target.value)}
                            rows="2"
                          />
                        </div>
                        <button type="button" onClick={() => removerHistoricoCurricular(indice)}>Remover</button>
                      </div>
                    ))}
                    <button type="button" onClick={adicionarHistoricoCurricular}>Adicionar Histórico Curricular</button>
                  </div>

                  <div className="cartaoDestaque variacao3">
                    <h3>Histórico Profissional</h3>
                    {dadosFormulario.historicosProfissionais.map((hp, indice) => (
                      <div key={indice} className="item-historico">
                        <div className="grupo-formulario">
                          <label htmlFor={`hp-nome-${indice}`}>Título</label>
                          <input
                            type="text"
                            id={`hp-nome-${indice}`}
                            value={hp.nome}
                            onChange={(e) => alterarHistoricoProfissional(indice, 'nome', e.target.value)}
                          />
                        </div>
                        <div className="grupo-formulario">
                          <label htmlFor={`hp-descricao-${indice}`}>Descrição</label>
                          <textarea
                            id={`hp-descricao-${indice}`}
                            value={hp.descricao}
                            onChange={(e) => alterarHistoricoProfissional(indice, 'descricao', e.target.value)}
                            rows="2"
                          />
                        </div>
                        <div className="grupo-formulario">
                          <label htmlFor={`hp-foto-${indice}`}>Imagem</label>
                          <input
                            type="file"
                            id={`hp-foto-${indice}`}
                            accept="image/*"
                            onChange={(e) => alterarFotoHistoricoProfissional(indice, e.target.files[0])}
                          />
                          {hp.foto && <img src={hp.foto} alt="Preview" className="preview-imagem" />}
                        </div>
                        <button type="button" onClick={() => removerHistoricoProfissional(indice)}>Remover</button>
                      </div>
                    ))}
                    <button type="button" onClick={adicionarHistoricoProfissional}>Adicionar Histórico Profissional</button>
                  </div>
                </>
              )}

              <div className="grupo-formulario">
                <label htmlFor="facebook">Facebook</label>
                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  value={dadosFormulario.facebook}
                  onChange={aoAlterarCampo}
                />
              </div>

              <div className="grupo-formulario">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={dadosFormulario.telefone}
                  onChange={aoAlterarCampo}
                />
              </div>

              {mensagemSucesso && (
                <div className="mensagem-sucesso">{mensagemSucesso}</div>
              )}
              
              {erros.submit && (
                <div className="mensagem-erro">{erros.submit}</div>
              )}
              
              <button 
                type="submit" 
                disabled={carregando}
              >
                {carregando ? 'Cadastrando...' : 'Criar Conta'}
              </button>
            </div>
            
            <div className="secao-upload-imagem">
              <div className="area-upload-imagem sombraPequena fundoMarromDestaqueTransparente">
                <input
                  type="file"
                  id="foto"
                  className="input-arquivo"
                  accept="image/*"
                  onChange={aoSelecionarArquivo}
                />
                <label htmlFor="foto" className="rotulo-upload-imagem">
                  {dadosFormulario.foto ? (
                    <img src={dadosFormulario.foto} alt="Preview" className="imagemPerfil" />
                  ) : (
                    <div className="placeholder-upload">
                      <span>Clique para adicionar uma foto</span>
                    </div>
                  )}
                </label>
              </div>
        <div className="cartao cartaoSecundario textoCentro margemGrande paddingMedio bordaArredondada">
  <h3 className="margemInferiorPequena textoMarromEscuro">Entre rapidamente com sua conta Google</h3>
  <GoogleLoginButton
    text="Entrar com Google"
    onSuccess={(userData) => {
      console.log('Login Google realizado:', userData);
    }}
    onError={() => {
      console.error('Erro no login com Google');
    }}
  />
  <p className="margemSuperiorPequena textoMinimo textoMarromOfuscado bordaSuperiorSubtle paddingSuperiorPequeno">
    Ou preencha o formulário abaixo para criar uma conta tradicional
  </p>
</div>
        
            </div>
          </div>
        </form>
      </div>
    </Corpo>
  );
};

export default Cadastro;