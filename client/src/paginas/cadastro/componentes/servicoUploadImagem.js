class ServicoUploadImagem {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  async fazerUpload(arquivo, token) {
    try {
      console.log('📤 Iniciando upload da imagem...');
      
      if (!arquivo) {
        throw new Error('Nenhum arquivo selecionado');
      }

      // Validar tipo de arquivo
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!tiposPermitidos.includes(arquivo.type)) {
        throw new Error('Tipo de arquivo não suportado. Use JPG, PNG ou WebP.');
      }

      // Validar tamanho (5MB)
      if (arquivo.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 5MB.');
      }

      const formData = new FormData();
      formData.append('imagem', arquivo);

      const resposta = await fetch(`${this.apiUrl}/upload/imagem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.message || 'Erro no upload da imagem');
      }

      console.log('✅ Upload realizado com sucesso:', dados.data.url);
      return dados;

    } catch (error) {
      console.error('❌ Erro no upload:', error);
      throw error;
    }
  }

  // Método para converter imagem em base64 (útil para preview)
  async lerArquivoComoDataURL(arquivo) {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(leitor.result);
      leitor.onerror = reject;
      leitor.readAsDataURL(arquivo);
    });
  }

  // Método para validar imagem antes do upload
  validarImagem(arquivo) {
    const erros = [];

    // Validar tipo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(arquivo.type)) {
      erros.push('Tipo de arquivo não suportado. Use JPG, PNG ou WebP.');
    }

    // Validar tamanho
    if (arquivo.size > 5 * 1024 * 1024) {
      erros.push('Arquivo muito grande. Tamanho máximo: 5MB.');
    }

    return {
      valido: erros.length === 0,
      erros
    };
  }
}

export default new ServicoUploadImagem();