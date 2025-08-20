import React, { useState } from 'react';
import './cadastro.css';
import Corpo from "@componentes/layout/corpo.jsx";
import { cadastroService } from '@/servicos/apiService';

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
    foto: null
  });
  
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const aoAlterarInput = (evento) => {
    const { name, value } = evento.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: '' }));
    }
  };

  const aoAlterarArquivo = (evento) => {
    const arquivo = evento.target.files[0];
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onload = (e) => setDadosFormulario(prev => ({ ...prev, foto: e.target.result }));
      leitor.readAsDataURL(arquivo);
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    // Validações básicas
    if (!dadosFormulario.nome) novosErros.nome = 'Nome é obrigatório';
    if (!dadosFormulario.email) novosErros.email = 'Email é obrigatório';
    if (!dadosFormulario.senha) novosErros.senha = 'Senha é obrigatória';
    if (dadosFormulario.senha !== dadosFormulario.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }
    if (!dadosFormulario.cep) novosErros.cep = 'CEP é obrigatório';
    if (!dadosFormulario.cidade) novosErros.cidade = 'Cidade é obrigatória';

    // Validações específicas para profissionais
    if (dadosFormulario.tipoPerfil === 'Profissional' && !dadosFormulario.descricao) {
      novosErros.descricao = 'Descrição é obrigatória para profissionais';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const aoSubmeter = async (evento) => {
    evento.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);
    setMensagemSucesso('');

    try {
      // Preparar dados de localização
      const dadosLocalizacao = {
        nome: `${dadosFormulario.cidade}, ${dadosFormulario.estado}`,
        cep: dadosFormulario.cep,
        coord: 0 // Valor padrão, pode ser ajustado posteriormente
      };

      // Preparar dados do perfil
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

      // Adicionar LinkedIn apenas para profissionais
      if (dadosFormulario.tipoPerfil === 'Profissional') {
        dadosPerfil.linkedin = dadosFormulario.linkedin;
      }

      // Realizar cadastro baseado no tipo de perfil
      let resposta;
      if (dadosFormulario.tipoPerfil === 'Pessoal') {
        resposta = await cadastroService.cadastrarUsuario(dadosPerfil, dadosLocalizacao);
      } else {
        resposta = await cadastroService.cadastrarProfissional(dadosPerfil, dadosLocalizacao);
      }

      setMensagemSucesso('Cadastro realizado com sucesso!');
      console.log('Resposta do servidor:', resposta);
      
      // Limpar formulário após sucesso
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
        foto: null
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
      <div className="cadastro-page">
        <h1 className="cadastro-title">Criar Conta</h1>
        
        <form className="cadastro-form" onSubmit={aoSubmeter}>
          <div className="form-content">
            <div className="form-fields">
              {/* Campos básicos */}
              <div className="form-group">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={dadosFormulario.nome}
                  onChange={aoAlterarInput}
                  className={erros.nome ? 'error' : ''}
                />
                {erros.nome && <span className="error-message">{erros.nome}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={dadosFormulario.email}
                  onChange={aoAlterarInput}
                  className={erros.email ? 'error' : ''}
                />
                {erros.email && <span className="error-message">{erros.email}</span>}
              </div>

              <div className="password-row">
                <div className="form-group">
                  <label htmlFor="senha">Senha *</label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={dadosFormulario.senha}
                    onChange={aoAlterarInput}
                    className={erros.senha ? 'error' : ''}
                  />
                  {erros.senha && <span className="error-message">{erros.senha}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmarSenha">Confirmar Senha *</label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={dadosFormulario.confirmarSenha}
                    onChange={aoAlterarInput}
                    className={erros.confirmarSenha ? 'error' : ''}
                  />
                  {erros.confirmarSenha && <span className="error-message">{erros.confirmarSenha}</span>}
                </div>
              </div>

              <div className="address-row">
                <div className="form-group cep-group">
                  <label htmlFor="cep">CEP *</label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    value={dadosFormulario.cep}
                    onChange={aoAlterarInput}
                    className={erros.cep ? 'error' : ''}
                  />
                  {erros.cep && <span className="error-message">{erros.cep}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cidade">Cidade *</label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    value={dadosFormulario.cidade}
                    onChange={aoAlterarInput}
                    className={erros.cidade ? 'error' : ''}
                  />
                  {erros.cidade && <span className="error-message">{erros.cidade}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="estado">Estado</label>
                  <input
                    type="text"
                    id="estado"
                    name="estado"
                    value={dadosFormulario.estado}
                    onChange={aoAlterarInput}
                  />
                </div>
              </div>

              {/* Seção de tipo de perfil */}
              <div className="profile-type-section">
                <div className="profile-type-header">
                  <span>Tipo de Perfil</span>
                </div>
                <div className="profile-type-options">
                  <button
                    type="button"
                    className={`profile-type-btn ${dadosFormulario.tipoPerfil === 'Pessoal' ? 'active' : ''}`}
                    onClick={() => setDadosFormulario(prev => ({ ...prev, tipoPerfil: 'Pessoal' }))}
                  >
                    Pessoal
                  </button>
                  <button
                    type="button"
                    className={`profile-type-btn ${dadosFormulario.tipoPerfil === 'Profissional' ? 'active' : ''}`}
                    onClick={() => setDadosFormulario(prev => ({ ...prev, tipoPerfil: 'Profissional' }))}
                  >
                    Profissional
                  </button>
                </div>
                <p className="required-text">* Campos obrigatórios</p>
              </div>

              {/* Campos específicos para profissionais */}
              {dadosFormulario.tipoPerfil === 'Profissional' && (
                <>
                  <div className="form-group">
                    <label htmlFor="descricao">Descrição Profissional *</label>
                    <textarea
                      id="descricao"
                      name="descricao"
                      value={dadosFormulario.descricao}
                      onChange={aoAlterarInput}
                      rows="3"
                      className={erros.descricao ? 'error' : ''}
                    />
                    {erros.descricao && <span className="error-message">{erros.descricao}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="instituicao">Instituição/Formação</label>
                    <input
                      type="text"
                      id="instituicao"
                      name="instituicao"
                      value={dadosFormulario.instituicao}
                      onChange={aoAlterarInput}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={dadosFormulario.linkedin}
                      onChange={aoAlterarInput}
                    />
                  </div>
                </>
              )}

              {/* Campos opcionais para ambos os tipos */}
              <div className="form-group">
                <label htmlFor="facebook">Facebook</label>
                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  value={dadosFormulario.facebook}
                  onChange={aoAlterarInput}
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={dadosFormulario.telefone}
                  onChange={aoAlterarInput}
                />
              </div>

              {mensagemSucesso && (
                <div className="mensagem-sucesso">{mensagemSucesso}</div>
              )}
              
              {erros.submit && (
                <div className="error-message">{erros.submit}</div>
              )}
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={carregando}
              >
                {carregando ? 'Cadastrando...' : 'Criar Conta'}
              </button>
            </div>
            
            <div className="image-upload-section">
              <div className="image-upload-area">
                {dadosFormulario.foto ? (
                  <img src={dadosFormulario.foto} alt="Preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <span>Clique para adicionar uma foto</span>
                  </div>
                )}
                <input
                  type="file"
                  id="foto"
                  className="file-input"
                  accept="image/*"
                  onChange={aoAlterarArquivo}
                />
                <label htmlFor="foto" className="file-label">
                  Escolher imagem
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Corpo>
  );
};

export default Cadastro;