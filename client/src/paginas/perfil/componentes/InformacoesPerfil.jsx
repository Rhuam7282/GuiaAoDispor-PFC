import React, { useState, useEffect, useRef } from 'react';
import { Star, Facebook, Instagram, Linkedin, Save, X, Edit, Camera, Upload } from "lucide-react";
import { useAuth } from '@contextos/autenticacao.jsx';
import { servicoAuth } from '@servicos/api.js';

const InformacoesPerfil = ({ dadosPerfil, isAuthenticated, user, id, modoEdicao, setModoEdicao }) => {
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
    if (dadosPerfil) {
      setDadosEditaveis({
        nome: dadosPerfil.nome || '',
        descricao: dadosPerfil.descricao || '',
        email: dadosPerfil.email || '',
        facebook: dadosPerfil.facebook || dadosPerfil.face || '',
        instagram: dadosPerfil.instagram || dadosPerfil.inst || '',
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

    // Verificar se é uma imagem
    if (!arquivo.type.startsWith('image/')) {
      setMensagem('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    // Verificar tamanho do arquivo (máximo 5MB)
    if (arquivo.size > 5 * 1024 * 1024) {
      setMensagem('A imagem deve ter no máximo 5MB.');
      return;
    }

    setCarregandoFoto(true);

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewFoto(e.target.result);
      setDadosEditaveis(prev => ({
        ...prev,
        foto: e.target.result // Usar base64 para a imagem
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
        descricao: dadosEditaveis.descricao,
        email: dadosEditaveis.email,
        face: dadosEditaveis.facebook,
        inst: dadosEditaveis.instagram,
        linkedin: dadosEditaveis.linkedin,
        foto: dadosEditaveis.foto
      };

      // Remover campos vazios
      Object.keys(dadosAtualizacao).forEach(key => {
        if (dadosAtualizacao[key] === '') {
          delete dadosAtualizacao[key];
        }
      });

      const resposta = await servicoAuth.editarPerfil(id, dadosAtualizacao);
      
      if (resposta.status === 'sucesso') {
        // Atualizar contexto de autenticação
        atualizarUsuario({
          nome: dadosEditaveis.nome,
          email: dadosEditaveis.email,
          face: dadosEditaveis.facebook,
          inst: dadosEditaveis.instagram,
          linkedin: dadosEditaveis.linkedin,
          desc: dadosEditaveis.descricao,
          foto: dadosEditaveis.foto,
          picture: dadosEditaveis.foto // Para compatibilidade com Google OAuth
        });
        
        setMensagem('Perfil atualizado com sucesso!');
        setTimeout(() => setMensagem(''), 3000);
        setModoEdicao(false);
      }
    } catch (erro) {
      console.error('Erro ao editar perfil:', erro);
      setMensagem('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelarEdicao = () => {
    // Restaurar dados originais
    setDadosEditaveis({
      nome: dadosPerfil.nome || '',
      descricao: dadosPerfil.descricao || '',
      email: dadosPerfil.email || '',
      facebook: dadosPerfil.facebook || dadosPerfil.face || '',
      instagram: dadosPerfil.instagram || dadosPerfil.inst || '',
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

  if (modoEdicao) {
    return (
      <div className="gridContainer gridTresColunas gapGrande margemInferiorGrande">
        <div className="alinharCentro">
          <div className="containerFotoEdicao">
            <img
              className="imagemPerfil imagemPerfilGrande"
              src={previewFoto || '/placeholder-avatar.jpg'}
              alt={`Preview da foto de ${dadosEditaveis.nome}`}
            />
            <div className="sobreposicaoFoto" onClick={triggerFileInput}>
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
              className="inputFormulario"
              disabled={carregando}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
        </div>
        
        <div className="cartaoDestaque fundoMarromDestaqueTransparente textoEsquerda flexWrap">
          <div className="campoFormulario">
            <label htmlFor="nome" className="rotuloCampo">Nome</label>
            <input
              id="nome"
              type="text"
              value={dadosEditaveis.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className="inputFormulario"
              disabled={carregando}
            />
          </div>
          
          <div className="campoFormulario">
            <label htmlFor="descricao" className="rotuloCampo">Descrição</label>
            <textarea
              id="descricao"
              value={dadosEditaveis.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              className="inputFormulario areaTexto"
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
              className="inputFormulario"
              disabled={carregando}
            />
          </div>

          {mensagem && (
            <div className={`mensagem ${mensagem.includes('Erro') ? 'mensagemErro' : 'mensagemSucesso'}`}>
              {mensagem}
            </div>
          )}

          <div className="botoesAcao margemSuperiorMedia">
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
        
        <div>
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
              className="inputFormulario"
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
              className="inputFormulario"
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
              className="inputFormulario"
              disabled={carregando}
              placeholder="Seu perfil do LinkedIn"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gridContainer gridTresColunas gapGrande margemInferiorGrande">
      <div className="alinharCentro">
        <div className="containerFoto">
          <img
            className="imagemPerfil imagemPerfilGrande"
            src={dadosPerfil.foto || '/placeholder-avatar.jpg'}
            alt={`${dadosPerfil.nome} - ${dadosPerfil.descricao} em ${dadosPerfil.localizacao}`}
          />
          {isAuthenticated && user && user._id === id && (
            <div className="sobreposicaoFoto" onClick={() => setModoEdicao(true)}>
              <Camera size={24} />
              <span>Alterar foto</span>
            </div>
          )}
        </div>
        
        
      </div>
      
      <div className="cartaoDestaque fundoMarromDestaqueTransparente textoEsquerda flexWrap">
        <p>{dadosPerfil.descricao}</p>
        <div className="listaHorizontal ">
          <div className="gapMedio">
            <div className="flexCentro gapPequeno">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(dadosPerfil.avaliacao)
                      ? "textoAmarelo preenchido"
                      : "textoMarromOfuscado"
                  }
                />
              ))}
              <span className="textoMarromEscuro">
                {dadosPerfil.avaliacao !== undefined && dadosPerfil.avaliacao !== null ? dadosPerfil.avaliacao.toFixed(1) : '0.0'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3>Contatos</h3>
        <div className="listaIcones vertical">
          {dadosPerfil.facebook || dadosPerfil.face ? (
            <div className="listaIcones">
              <Facebook size={18} />
              <span>{dadosPerfil.facebook || dadosPerfil.face}</span>
            </div>
          ) : null}
          
          {dadosPerfil.instagram || dadosPerfil.inst ? (
            <div className="listaIcones">
              <Instagram size={18} />
              <span>{dadosPerfil.instagram || dadosPerfil.inst}</span>
            </div>
          ) : null}
          
          {dadosPerfil.linkedin ? (
            <div className="listaIcones">
              <Linkedin size={18} />
              <span>{dadosPerfil.linkedin}</span>
            </div>
          ) : null}
          
          {dadosPerfil.email ? (
            <div className="listaIcones">
              <span>📧 {dadosPerfil.email}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InformacoesPerfil;