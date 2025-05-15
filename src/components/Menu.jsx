import { useState } from 'react'
import logo from '../assets/logo.svg';

const Menu = () => {
  const [paginaAtiva, setPaginaAtiva] = useState('início');

<<<<<<< HEAD

export default function Menu() {
=======
>>>>>>> 70fa682d7110b132fc96182f4a4370d04949e812
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
export default Menu;