import React, { useState, useEffect, useRef } from 'react';
import { Star, Facebook, Instagram, Linkedin, Save, X, Edit, Camera, MapPin, Mail } from "lucide-react";
import { useAuth } from '../../../contextos/autenticacao.jsx';
import { ServicoAutenticacao } from '../../../servicos/api.js';

const InformacoesPerfil = ({ dadosPerfil, estaAutenticado, usuario, id, modoEdicao, setModoEdicao }) => {
  const { atualizarUsuario } = useAuth();
  const [dadosEditaveis, setDadosEditaveis] = useState({
    nome: '',
    descricao: '',
    email: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    foto: ''
  });
  const [carregando, setCarregando] = useState(false);
  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [previewFoto, setPreviewFoto] = useState('');
  const inputFileRef = useRef(null);

  // Preencher dados editáveis quando os dados do perfil mudarem
  useEffect(() => {
    console.log("🔄 Atualizando dados editáveis com:", dadosPerfil);
    if (dadosPerfil) {
      setDadosEditaveis({
        nome: dadosPerfil.nome || '',
        descricao: dadosPerfil.descricao || '',
        email: dadosPerfil.email || '',
        facebook: dadosPerfil.face || '',
        instagram: dadosPerfil.inst || '',
        linkedin: dadosPerfil.linkedin || '',
        foto: dadosPerfil.foto || ''
      });
      
      setPreviewFoto(dadosPerfil.foto || '');
    }
  }, [dadosPerfil]);

  const handleInputChange = (campo, valor) => {
    setDadosEditaveis(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSelecionarFoto = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith('image/')) {
      setMensagem('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setMensagem('A imagem deve ter no máximo 5MB.');
      return;
    }

    setCarregandoFoto(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewFoto(e.target.result);
      setDadosEditaveis(prev => ({
        ...prev,
        foto: e.target.result
      }));
      setCarregandoFoto(false);
    };
    reader.readAsDataURL(arquivo);
  };

  const handleSalvarEdicao = async () => {
    setCarregando(true);
    setMensagem('');
    
    try {
      const dadosAtualizacao = {
        nome: dadosEditaveis.nome,
        desc: dadosEditaveis.descricao,
        email: dadosEditaveis.email,
        face: dadosEditaveis.facebook,
        inst: dadosEditaveis.instagram,
        linkedin: dadosEditaveis.linkedin,
        foto: dadosEditaveis.foto
      };

      Object.keys(dadosAtualizacao).forEach(key => {
        if (dadosAtualizacao[key] === '') {
          delete dadosAtualizacao[key];
        }
      });

      console.log('📤 Enviando dados de atualização:', dadosAtualizacao);
      
      const resposta = await ServicoAutenticacao.editarPerfil(id, dadosAtualizacao);
      
      if (resposta.status === 'sucesso') {
        await atualizarUsuario(dadosAtualizacao);
        
        setMensagem('Perfil atualizado com sucesso!');
        setTimeout(() => setMensagem(''), 5000);
        setModoEdicao(false);
        
        window.location.reload();
      } else {
        throw new Error(resposta.message || 'Erro ao atualizar perfil');
      }
    } catch (erro) {
      console.error('❌ Erro ao editar perfil:', erro);
      setMensagem(erro.message || 'Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelarEdicao = () => {
    setDadosEditaveis({
      nome: dadosPerfil.nome || '',
      descricao: dadosPerfil.descricao || '',
      email: dadosPerfil.email || '',
      facebook: dadosPerfil.face || '',
      instagram: dadosPerfil.inst || '',
      linkedin: dadosPerfil.linkedin || '',
      foto: dadosPerfil.foto || ''
    });
    setPreviewFoto(dadosPerfil.foto || '');
    setModoEdicao(false);
    setMensagem('');
  };

  const triggerFileInput = () => {
    inputFileRef.current.click();
  };

  const isPerfilProprio = estaAutenticado && usuario && usuario._id === id;

  if (modoEdicao) {
    return (
      <div className="containerPrincipal">
        <div className="colunaFoto">
          <div className="containerFotoEdicao posicaoRelativa">
            <img
              className="imagemPerfil"
              src={previewFoto || dadosPerfil.foto || '/placeholder-avatar.jpg'}
              alt={`Preview da foto de ${dadosEditaveis.nome}`}
            />
            <div className="sobreposicaoFoto flexColuna alinharCentro justificarCentro" onClick={triggerFileInput}>
              <Camera size={24} />
              <span>Alterar foto</span>
            </div>
            <input
              ref={inputFileRef}
              type="file"
              accept="image/*"
              onChange={handleSelecionarFoto}
              style={{ display: 'none' }}
              disabled={carregando || carregandoFoto}
            />
          </div>
          
          {carregandoFoto && (
            <p className="textoPequeno textoCentralizado textoMarromOfuscado margemSuperiorPequena">
              Processando imagem...
            </p>
          )}
          
          <div className="campoFormulario margemSuperiorPequena">
            <label htmlFor="urlFoto" className="rotuloCampo">Ou cole a URL de uma imagem</label>
            <input
              id="urlFoto"
              type="url"
              value={dadosEditaveis.foto}
              onChange={(e) => {
                setDadosEditaveis(prev => ({ ...prev, foto: e.target.value }));
                setPreviewFoto(e.target.value);
              }}
              disabled={carregando}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
        </div>
        
        <div className="destaque3 cartaoDestaque variacao1 flexCentro">
          <div className="campoFormulario">
            <label htmlFor="nome" >Nome</label>
            <input
              id="nome"
              type="text"
              value={dadosEditaveis.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              disabled={carregando}
            />
          </div>
          
          <div className="campoFormulario">
            <label htmlFor="descricao" className="rotuloCampo">Descrição</label>
            <textarea
              id="descricao"
              value={dadosEditaveis.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              className="areaTexto"
              rows="3"
              disabled={carregando}
            />
          </div>
          
          <div className="campoFormulario">
            <label htmlFor="email" className="rotuloCampo">Email</label>
            <input
              id="email"
              type="email"
              value={dadosEditaveis.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={carregando}
            />
          </div>

          {mensagem && (
            <div className={`mensagem ${mensagem.includes('Erro') ? 'mensagemErro' : 'mensagemSucesso'} margemSuperiorPequena`}>
              {mensagem}
            </div>
          )}

          <div className="botoesAcao margemSuperiorMedia flexCentro gapPequeno">
            <button
              onClick={handleSalvarEdicao}
              disabled={carregando || carregandoFoto}
              className="botaoPrimario botaoPequeno flexCentro gapPequeno"
            >
              {carregando ? 'Salvando...' : 'Salvar'}
              <Save size={16} />
            </button>
            <button
              onClick={handleCancelarEdicao}
              disabled={carregando}
              className="botaoSecundario botaoPequeno flexCentro gapPequeno"
            >
              Cancelar
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="colunaContatos">
          <h3>Contatos</h3>
          <div className="campoFormulario">
            <label htmlFor="facebook" className="rotuloCampo flexCentro gapPequeno">
              <Facebook size={16} />
              Facebook
            </label>
            <input
              id="facebook"
              type="text"
              value={dadosEditaveis.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              disabled={carregando}
              placeholder="Seu usuário do Facebook"
            />
          </div>
          
          <div className="campoFormulario">
            <label htmlFor="instagram" className="rotuloCampo flexCentro gapPequeno">
              <Instagram size={16} />
              Instagram
            </label>
            <input
              id="instagram"
              type="text"
              value={dadosEditaveis.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              disabled={carregando}
              placeholder="Seu usuário do Instagram"
            />
          </div>
          
          <div className="campoFormulario">
            <label htmlFor="linkedin" className="rotuloCampo flexCentro gapPequeno">
              <Linkedin size={16} />
              LinkedIn
            </label>
            <input
              id="linkedin"
              type="text"
              value={dadosEditaveis.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              disabled={carregando}
              placeholder="Seu perfil do LinkedIn"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="containerPrincipal">
      <div className="colunaFoto">
        <div className="containerFoto posicaoRelativa">
          <img
            className="imagemPerfil"
            src={dadosPerfil.foto || '/placeholder-avatar.jpg'}
            alt={`Foto de ${dadosPerfil.nome}`}
          />
          {isPerfilProprio && (
            <div className="sobreposicaoFoto flexColuna alinharCentro justificarCentro" onClick={() => setModoEdicao(true)}>
              <Edit size={20} />
              <span>Editar perfil</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="destaque3 cartaoDestaque variacao1">
        <p>{dadosPerfil.descricao}</p>
        <div className="detalhesPerfil">
          <div className="icone">
            <MapPin size={20} />
            <span>{dadosPerfil.localizacao}</span>
          </div>
          
          <div className="icone">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={20} 
                fill={i < Math.floor(dadosPerfil.avaliacao || 0) ? "#54453B" : "none"} 
                stroke="#54453B" 
              />
            ))}
            <span className="valorAvaliacao">{(dadosPerfil.avaliacao || 0).toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      <div className="colunaContatos">
        <h3>Contatos</h3>
        <div className="listaRedes">
          {dadosPerfil.email && (
            <div className="lista">
              <Mail size={18} />
              <span>{dadosPerfil.email}</span>
            </div>
          )}
          
          {dadosPerfil.face && (
            <div className="lista">
              <Facebook size={18} />
              <span>{dadosPerfil.face}</span>
            </div>
          )}
          
          {dadosPerfil.inst && (
            <div className="lista">
              <Instagram size={18} />
              <span>{dadosPerfil.inst}</span>
            </div>
          )}
          
          {dadosPerfil.linkedin && (
            <div className="lista">
              <Linkedin size={18} />
              <span>{dadosPerfil.linkedin}</span>
            </div>
          )}
          
          {!dadosPerfil.email && !dadosPerfil.face && !dadosPerfil.inst && !dadosPerfil.linkedin && (
            <p className="textoMarromOfuscado">Nenhum contato informado</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformacoesPerfil;
