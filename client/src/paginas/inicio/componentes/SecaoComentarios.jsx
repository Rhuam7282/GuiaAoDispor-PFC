import React from 'react';
import './SecaoComentarios.css';

const SecaoComentarios = () => {
  const comentarios = [
    {
      nome: 'Maria Silva',
      comentario: 'TESTE DO COMENTÁRIO - Esta plataforma realmente mudou minha vida! Consegui encontrar um profissional especializado em LIBRAS que me ajudou muito.',
      avaliacao: 5,
      data: '15 de setembro de 2024'
    },
    {
      nome: 'João Santos',
      comentario: 'TESTE DO COMENTÁRIO - Excelente iniciativa! Os recursos de acessibilidade são muito bem pensados e funcionam perfeitamente.',
      avaliacao: 5,
      data: '12 de setembro de 2024'
    },
    {
      nome: 'Ana Costa',
      comentario: 'TESTE DO COMENTÁRIO - Finalmente uma plataforma que pensa em pessoas como eu. O modo de alto contraste é perfeito para minha deficiência visual.',
      avaliacao: 4,
      data: '10 de setembro de 2024'
    },
    {
      nome: 'Carlos Oliveira',
      comentario: 'TESTE DO COMENTÁRIO - Interface muito intuitiva e fácil de usar. Recomendo para todos que precisam de serviços especializados.',
      avaliacao: 5,
      data: '8 de setembro de 2024'
    },
    {
      nome: 'Lucia Ferreira',
      comentario: 'TESTE DO COMENTÁRIO - Ótima experiência! Encontrei rapidamente um cuidador especializado para minha mãe idosa.',
      avaliacao: 4,
      data: '5 de setembro de 2024'
    },
    {
      nome: 'Pedro Almeida',
      comentario: 'TESTE DO COMENTÁRIO - Plataforma inclusiva de verdade! Os atalhos de teclado facilitam muito minha navegação.',
      avaliacao: 5,
      data: '3 de setembro de 2024'
    }
  ];

  const renderEstrelas = (avaliacao) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`estrela ${index < avaliacao ? 'preenchida' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="secaoComentarios">
      <h2>Venha conhecer um pouco da nossa comunidade</h2>
      <p className="descricaoComentarios">
        Veja o que nossos usuários estão dizendo sobre a plataforma
      </p>
      
      <div className="containerComentarios">
        {comentarios.map((comentario, index) => (
          <div key={index} className="cartaoComentario">
            <div className="cabecalhoComentario">
              <div className="infoUsuario">
                <div className="avatarUsuario">
                  {comentario.nome.charAt(0)}
                </div>
                <div className="dadosUsuario">
                  <h4 className="nomeUsuario">{comentario.nome}</h4>
                  <span className="dataComentario">{comentario.data}</span>
                </div>
              </div>
              <div className="avaliacaoEstrelas">
                {renderEstrelas(comentario.avaliacao)}
              </div>
            </div>
            <p className="textoComentario">{comentario.comentario}</p>
          </div>
        ))}
      </div>
      
      <div className="chamadaContato">
        <p>
          <strong>
            Gostaria de sugerir mais alguma ferramenta ou melhorias? Contacte-nos.
          </strong>
        </p>
        <button className="botaoContato">
          Entre em Contato
        </button>
      </div>
    </section>
  );
};

export default SecaoComentarios;
