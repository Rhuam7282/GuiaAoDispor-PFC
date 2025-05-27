import { useState } from 'react'
import logo from '../assets/logo.svg';

const Menu = () => {
  const [paginaAtiva, setPaginaAtiva] = useState('Início');

  return (
    <div className="flex flex-col h-screen w-1/5 bg-[#f5f5dc] p-5 fixed">
      <img src={logo} alt="logo da empresa" className="w-4/5 max-w-[150px] mx-auto mb-8 rounded-full my-10"/>
      <ul className="space-y-2">
        {['Início', 'Perfil', 'Mensagem', 'Contato'].map((pagina) => (
          <li
            key={pagina}
            onClick={() => setPaginaAtiva(pagina)}
            className={`p-3 rounded cursor-pointer transition-colors ${
              pagina === paginaAtiva 
                ? 'bg-[#e0e0d1] font-medium' 
                : 'hover:bg-[#e0e0d1]'
            }`}
          >
            {pagina}
          </li>
        ))}
      </ul>
      <footer className="mt-auto pt-5 text-sm text-gray-600 bg-blue-500 border-t border-gray-300">
        <p>© 2024 Todos os direitos reservados</p>
        <p className="mt-2">Desenvolvido por Lucas Narciso e Rhuam de Ré</p>
      </footer>
    </div>
  );
};

export default Menu;