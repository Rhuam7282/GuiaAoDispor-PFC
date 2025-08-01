import React, { useState, useEffect } from 'react';
import './mensagens.css';
import Cadastro from './cadastro';
import { MessageCircle, Send, Search, MoreVertical, ArrowLeft } from 'lucide-react';

const Mensagens = ({ classeAdicional = '' }) => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [conversaSelecionada, setConversaSelecionada] = useState(null);
  const [mensagemTexto, setMensagemTexto] = useState('');
  const [termoPesquisa, setTermoPesquisa] = useState('');

  // Simular verificação de usuário logado
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      try {
        setUsuarioLogado(JSON.parse(usuarioSalvo));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  const handleLogin = (dadosLogin) => {
    const usuario = {
      id: Date.now(),
      nome: 'Usuário Exemplo',
      email: dadosLogin.email,
      avatar: null,
      dataLogin: new Date().toISOString()
    };
    
    setUsuarioLogado(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    alert('Login realizado com sucesso!');
  };

  const handleCadastro = (dadosCadastro) => {
    const novoUsuario = {
      id: Date.now(),
      nome: dadosCadastro.nome,
      email: dadosCadastro.email,
      avatar: null,
      dataCadastro: new Date().toISOString()
    };
    
    setUsuarioLogado(novoUsuario);
    localStorage.setItem('usuario', JSON.stringify(novoUsuario));
    alert('Cadastro realizado com sucesso!');
  };

  // Dados simulados de conversas
  const conversas = [
    {
      id: 1,
      nome: 'Maria Silva',
      ultimaMensagem: 'Olá! Gostaria de agendar uma consulta.',
      horario: '14:30',
      naoLidas: 2,
      avatar: null,
      online: true
    },
    {
      id: 2,
      nome: 'João Oliveira',
      ultimaMensagem: 'Obrigado pelo atendimento!',
      horario: '12:15',
      naoLidas: 0,
      avatar: null,
      online: false
    },
    {
      id: 3,
      nome: 'Ana Santos',
      ultimaMensagem: 'Quando podemos conversar?',
      horario: '10:45',
      naoLidas: 1,
      avatar: null,
      online: true
    }
  ];

  // Mensagens simuladas
  const mensagensConversa = {
    1: [
      { id: 1, texto: 'Olá! Como está?', enviada: false, horario: '14:25' },
      { id: 2, texto: 'Oi! Estou bem, obrigado!', enviada: true, horario: '14:26' },
      { id: 3, texto: 'Gostaria de agendar uma consulta.', enviada: false, horario: '14:30' }
    ],
    2: [
      { id: 1, texto: 'Muito obrigado pelo atendimento!', enviada: false, horario: '12:15' },
      { id: 2, texto: 'Foi um prazer ajudar!', enviada: true, horario: '12:16' }
    ],
    3: [
      { id: 1, texto: 'Quando podemos conversar?', enviada: false, horario: '10:45' }
    ]
  };

  const conversasFiltradas = conversas.filter(conversa =>
    conversa.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const enviarMensagem = () => {
    if (mensagemTexto.trim() && conversaSelecionada) {
      // Aqui você adicionaria a lógica para enviar a mensagem
      console.log('Enviando mensagem:', mensagemTexto);
      setMensagemTexto('');
      alert('Mensagem enviada!');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  // Se não há usuário logado, mostrar tela de cadastro/login
  if (!usuarioLogado) {
    return (
      <div className={`mensagens-wrapper ${classeAdicional}`}>
        <div className="mensagens-login-prompt">
          <div className="login-prompt-content">
            <MessageCircle size={48} className="login-prompt-icon" />
            <h2>Acesse suas Mensagens</h2>
            <p>Faça login ou cadastre-se para acessar suas conversas</p>
          </div>
          <Cadastro 
            onLogin={handleLogin}
            onCadastro={handleCadastro}
            mostrarLogin={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`mensagens-wrapper ${classeAdicional}`}>
      <div className="mensagens-container">
        {/* Lista de conversas */}
        <div className={`conversas-lista ${conversaSelecionada ? 'oculta-mobile' : ''}`}>
          <div className="conversas-header">
            <h2>Mensagens</h2>
            <button className="botao-opcoes">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="pesquisa-container">
            <Search size={16} className="pesquisa-icon" />
            <input
              type="text"
              placeholder="Pesquisar conversas..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              className="pesquisa-input"
            />
          </div>

          <div className="conversas-scroll">
            {conversasFiltradas.map(conversa => (
              <div
                key={conversa.id}
                className={`conversa-item ${conversaSelecionada?.id === conversa.id ? 'ativa' : ''}`}
                onClick={() => setConversaSelecionada(conversa)}
              >
                <div className="conversa-avatar">
                  {conversa.avatar ? (
                    <img src={conversa.avatar} alt={conversa.nome} />
                  ) : (
                    <div className="avatar-placeholder">
                      {conversa.nome.charAt(0)}
                    </div>
                  )}
                  {conversa.online && <div className="status-online"></div>}
                </div>
                
                <div className="conversa-info">
                  <div className="conversa-nome">{conversa.nome}</div>
                  <div className="conversa-ultima-mensagem">
                    {conversa.ultimaMensagem}
                  </div>
                </div>
                
                <div className="conversa-meta">
                  <div className="conversa-horario">{conversa.horario}</div>
                  {conversa.naoLidas > 0 && (
                    <div className="conversa-badge">{conversa.naoLidas}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de conversa */}
        <div className={`conversa-area ${!conversaSelecionada ? 'oculta-mobile' : ''}`}>
          {conversaSelecionada ? (
            <>
              <div className="conversa-header">
                <button 
                  className="botao-voltar"
                  onClick={() => setConversaSelecionada(null)}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="conversa-info-header">
                  <div className="conversa-avatar-header">
                    {conversaSelecionada.avatar ? (
                      <img src={conversaSelecionada.avatar} alt={conversaSelecionada.nome} />
                    ) : (
                      <div className="avatar-placeholder">
                        {conversaSelecionada.nome.charAt(0)}
                      </div>
                    )}
                    {conversaSelecionada.online && <div className="status-online"></div>}
                  </div>
                  <div>
                    <div className="conversa-nome-header">{conversaSelecionada.nome}</div>
                    <div className="conversa-status">
                      {conversaSelecionada.online ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
                <button className="botao-opcoes">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="mensagens-scroll">
                {mensagensConversa[conversaSelecionada.id]?.map(mensagem => (
                  <div
                    key={mensagem.id}
                    className={`mensagem ${mensagem.enviada ? 'enviada' : 'recebida'}`}
                  >
                    <div className="mensagem-conteudo">
                      {mensagem.texto}
                    </div>
                    <div className="mensagem-horario">
                      {mensagem.horario}
                    </div>
                  </div>
                ))}
              </div>

              <div className="input-mensagem">
                <textarea
                  value={mensagemTexto}
                  onChange={(e) => setMensagemTexto(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="input-texto"
                  rows="1"
                />
                <button 
                  onClick={enviarMensagem}
                  className="botao-enviar"
                  disabled={!mensagemTexto.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="conversa-vazia">
              <MessageCircle size={64} className="conversa-vazia-icon" />
              <h3>Selecione uma conversa</h3>
              <p>Escolha uma conversa da lista para começar a trocar mensagens</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mensagens;

