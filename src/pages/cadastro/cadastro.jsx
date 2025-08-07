import React, { useState } from 'react';
import './Cadastro.css';
import Corpo from "../../components/layout/corpo";
import PainelControle from "../../components/acessibilidade/controles"; // 

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cep: '',
    cidade: '',
    estado: '',
    descricao: '',
    tipoPerfil: 'Pessoal',
    foto: null
  });

  const [errors, setErrors] = useState({});
  const [showTooltip, setShowTooltip] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          foto: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validação nome completo
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    }

    // Validação email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    // Validação senha
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validação confirmação de senha
    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    // Validação CEP
    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!cepRegex.test(formData.cep)) {
      newErrors.cep = 'CEP deve ter formato válido (00000-000)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Dados do formulário:', formData);
      alert('Cadastro realizado com sucesso!');
      // Aqui você integraria com a API de cadastro
    }
  };

  const toggleTooltip = (field) => {
    setShowTooltip(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const tooltipContent = {
    nomeCompleto: 'Digite seu nome completo como aparece em seus documentos oficiais',
    email: 'Digite um email válido que será usado para login e comunicações',
    senha: 'A senha deve ter pelo menos 6 caracteres, incluindo letras e números',
    confirmarSenha: 'Digite novamente a mesma senha para confirmação',
    cep: 'Digite seu CEP no formato 00000-000 para localização',
    descricao: 'Descreva brevemente sua experiência profissional, especialidades ou interesses',
    tipoPerfil: 'Escolha "Pessoal" para uso individual ou "Profissional" para representar uma empresa/instituição'
  };

  return (
    <Corpo>
      <PainelControle />
      <div className="cadastro-page">
        <h1 className="cadastro-title">Cadastro</h1>
        
        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="form-content">
            <div className="form-fields">
              {/* Nome Completo */}
              <div className="input-group">
                <label className="input-label">Nome completo *</label>
                <div className="input-with-tooltip">
                  <input
                    type="text"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleInputChange}
                    className={errors.nomeCompleto ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="tooltip-btn"
                    onClick={() => toggleTooltip('nomeCompleto')}
                  >
                    ?
                  </button>
                  {showTooltip.nomeCompleto && (
                    <div className="tooltip">
                      {tooltipContent.nomeCompleto}
                    </div>
                  )}
                </div>
                {errors.nomeCompleto && <span className="error-message">{errors.nomeCompleto}</span>}
              </div>

              {/* Email */}
              <div className="input-group">
                <label className="input-label">Email *</label>
                <div className="input-with-tooltip">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="tooltip-btn"
                    onClick={() => toggleTooltip('email')}
                  >
                    ?
                  </button>
                  {showTooltip.email && (
                    <div className="tooltip">
                      {tooltipContent.email}
                    </div>
                  )}
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Senha e Confirmação - Lado a lado */}
              <div className="password-row">
                <div className="input-group">
                  <label className="input-label">Senha *</label>
                  <div className="input-with-tooltip">
                    <input
                      type="password"
                      name="senha"
                      value={formData.senha}
                      onChange={handleInputChange}
                      className={errors.senha ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="tooltip-btn"
                      onClick={() => toggleTooltip('senha')}
                    >
                      ?
                    </button>
                    {showTooltip.senha && (
                      <div className="tooltip">
                        {tooltipContent.senha}
                      </div>
                    )}
                  </div>
                  {errors.senha && <span className="error-message">{errors.senha}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Confirme a senha *</label>
                  <div className="input-with-tooltip">
                    <input
                      type="password"
                      name="confirmarSenha"
                      value={formData.confirmarSenha}
                      onChange={handleInputChange}
                      className={errors.confirmarSenha ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="tooltip-btn"
                      onClick={() => toggleTooltip('confirmarSenha')}
                    >
                      ?
                    </button>
                    {showTooltip.confirmarSenha && (
                      <div className="tooltip">
                        {tooltipContent.confirmarSenha}
                      </div>
                    )}
                  </div>
                  {errors.confirmarSenha && <span className="error-message">{errors.confirmarSenha}</span>}
                </div>
              </div>

              {/* CEP */}
              <div className="input-group">
                <label className="input-label">CEP</label>
                <div className="input-with-tooltip">
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    className={errors.cep ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="tooltip-btn"
                    onClick={() => toggleTooltip('cep')}
                  >
                    ?
                  </button>
                  {showTooltip.cep && (
                    <div className="tooltip">
                      {tooltipContent.cep}
                    </div>
                  )}
                </div>
                {errors.cep && <span className="error-message">{errors.cep}</span>}
              </div>

              {/* Descrição */}
              <div className="input-group">
                <label className="input-label">Descrição</label>
                <div className="input-with-tooltip">
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows="4"
                  />
                  <button
                    type="button"
                    className="tooltip-btn"
                    onClick={() => toggleTooltip('descricao')}
                  >
                    ?
                  </button>
                  {showTooltip.descricao && (
                    <div className="tooltip">
                      {tooltipContent.descricao}
                    </div>
                  )}
                </div>
              </div>

              {/* Cidade e Estado - Lado a lado */}
              <div className="address-row">
                <div className="input-group">
                  <label className="input-label">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Estado</label>
                  <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Tipo de Perfil */}
              <div className="profile-type-section">
                <div className="profile-type-header">
                  <span>Tipo de Perfil:</span>
                  <button
                    type="button"
                    className="tooltip-btn"
                    onClick={() => toggleTooltip('tipoPerfil')}
                  >
                    ?
                  </button>
                  {showTooltip.tipoPerfil && (
                    <div className="tooltip">
                      {tooltipContent.tipoPerfil}
                    </div>
                  )}
                </div>
                <div className="profile-type-options">
                  <button
                    type="button"
                    className={`profile-type-btn ${formData.tipoPerfil === 'Pessoal' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, tipoPerfil: 'Pessoal' }))}
                  >
                    Pessoal
                  </button>
                  <button
                    type="button"
                    className={`profile-type-btn ${formData.tipoPerfil === 'Profissional' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, tipoPerfil: 'Profissional' }))}
                  >
                    Profissional
                  </button>
                </div>
                <span className="required-text">*Obrigatório</span>
              </div>

              <button type="submit" className="submit-btn">
                Concluir
              </button>
            </div>

            {/* Área de Upload de Imagem */}
            <div className="image-upload-section">
              <div className="image-upload-area">
                {formData.foto ? (
                  <img src={formData.foto} alt="Preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <span>Arraste ou carregue uma imagem</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                  id="foto-upload"
                />
                <label htmlFor="foto-upload" className="file-label">
                  Escolher arquivo
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
