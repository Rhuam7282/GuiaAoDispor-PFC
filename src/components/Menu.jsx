<<<<<<< HEAD
//import fotodeperfil from '../assets/fotodeperfil.png';
function Menu (){
<menu>
    <div>
        {/* <img  alt="Logo" src="fotodeperfil" width="115px"/> */}
        <h1>Guia ao Dispor</h1>
    </div>
    <div>
        <h2><a href="Página Inicial.html">Página Inicial</a></h2>
        <h2><a href="Conversas.html">Conversas</a></h2>
        <h2><a href="Perfil do Usuário.html">Perfil</a></h2>
        <h2><a href="Sobre nós.html">Sobre Nós</a></h2>
        <h2><a href="Contato.html">Contato</a></h2>
    </div>
    <footer>
        <h5>
            Guia ao Dispor é um projeto escolar criado e proporcionado por Lucas Schultz e Rhuam de Ré.<br /><a href="Contato.html">Entre em contato</a>
        </h5>
    </footer>
</menu>
}
=======
import { useState } from 'react'
import logo from '../assets/logo.svg';

const Menu = () => {
  const [paginaAtiva, setPaginaAtiva] = useState('início');

  return (
    <div className="flex flex-col h-screen w-1/5 bg-[#f5f5dc] p-5 fixed left-0 top-0 shadow-xl">
<ul className="p-3 rounded hover:bg-[#e0e0d1] cursor-pointer transition-colors">
      <img src={logo} alt="logo da empresa" className="w-4/5 max-w-[150px] mx-auto mb-8 rounded-full"/>
      {['Início', 'Perfil', 'Mensagem', 'Contato'].map((pagina) => (
        <li
          key={pagina}
          onClick={() => setPaginaAtiva(pagina)}
          className={`cursor-pointer ${pagina === paginaAtiva ? 'fonte-ativa' : 'fonte-normal'}`}
        >
          {pagina}
        </li>
      ))}
    </ul>
    <footer className="mt-auto pt-5 text-sm text-gray-600 border-t border-gray-300">
        <p>© 2024 Todos os direitos reservados</p>
        <p className="mt-2">Desenvolvido por Webnode</p>
        <p className="mt-2">Cookies</p>
      </footer>
    </div>
    
  );
};
>>>>>>> edc0c24bf28698abccd3a244ef395b81b0d622e1
export default Menu;