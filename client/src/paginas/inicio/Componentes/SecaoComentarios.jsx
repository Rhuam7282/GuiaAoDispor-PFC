import React from 'react';
import './SecaoComentarios.css';

const SecaoComentarios = () => {
  // Agora usando a estrutura do schema de Avaliacao
  const avaliacoes = [
    {
      nome: 'Maria Silva',
      desc: 'TESTE DO COMENTÁRIO - Esta plataforma realmente mudou minha vida! Consegui encontrar um profissional especializado em LIBRAS que me ajudou muito.',
      nota: 5
    },
    {
      nome: 'João Santos',
      desc: 'TESTE DO COMENTÁRIO - Excelente iniciativa! Os recursos de acessibilidade são muito bem pensados e funcionam perfeitamente.',
      nota: 5
    },
    {
      nome: 'Ana Costa',
      desc: 'TESTE DO COMENTÁRIO - Finalmente uma plataforma que pensa em pessoas como eu. O modo de alto contraste é perfeito para minha deficiência visual.',
      nota: 4
    },
    {
      nome: 'Carlos Oliveira',
      desc: 'TESTE DO COMENTÁRIO - Interface muito intuitiva e fácil de usar. Recomendo para todos que precisam de serviços especializados.',
      nota: 5
    },
    {
      nome: 'Lucia Ferreira',
      desc: 'TESTE DO COMENTÁRIO - Ótima experiência! Encontrei rapidamente um cuidador especializado para minha mãe idosa.',
      nota: 4
    },
    {
      nome: 'Pedro Almeida',
      desc: 'TESTE DO COMENTÁRIO - Plataforma inclusiva de verdade! Os atalhos de teclado facilitam muito minha navegação.',
      nota: 5
    }
  ];

  const renderEstrelas = (nota) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`estrela ${index < nota ? 'preenchida' : ''}`}>
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
        {avaliacoes.map((avaliacao, index) => (
          <div key={index} className="cartaoComentario">
            <div className="cabecalhoComentario">
              <div className="infoUsuario">
                <div className="avatarUsuario">
                  {avaliacao.nome.charAt(0)}
                </div>
                <div className="dadosUsuario">
                  <h4 className="nomeUsuario">{avaliacao.nome}</h4>
                </div>
              </div>
              <div className="avaliacaoEstrelas">
                {renderEstrelas(avaliacao.nota)}
              </div>
            </div>
            <p className="textoComentario">{avaliacao.desc}</p>
          </div>
        ))}
      </div>
      
      {/* <div className="chamadaContato">
        <p>
          <strong>
            Gostaria de sugerir mais alguma ferramenta ou melhorias? Contacte-nos.
          </strong>
        </p>
        <button className="botaoContato">
          Entre em Contato
        </button>
      </div> */}
    </section>
  );
};

export default SecaoComentarios;