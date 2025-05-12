import logo from "../assets/logo.svg";

export default function Menu() {
  return (
    <div className="flex flex-col h-screen w-1/5 bg-[#f5f5dc] p-5 fixed left-0 top-0 shadow-xl">
      <img 
        src={logo} 
        alt="logo da empresa" 
        className="w-4/5 max-w-[150px] mx-auto mb-8 rounded-full"
      />

      <aside className="flex-1">
        <ul className="space-y-2">
          <li className="p-3 rounded hover:bg-[#e0e0d1] cursor-pointer transition-colors">
            Perfil de usuário
          </li>
          <li className="p-3 rounded hover:bg-[#e0e0d1] cursor-pointer transition-colors">
            Perfil Profissional
          </li>
          <li className="p-3 rounded hover:bg-[#e0e0d1] cursor-pointer transition-colors">
            Conversas
          </li>
          <li className="p-3 rounded hover:bg-[#e0e0d1] cursor-pointer transition-colors">
            Sobre nós
          </li>
          <li className="p-3 rounded hover:bg-[#e0e0d1] cursor-pointer transition-colors">
            Contato
          </li>
        </ul>
      </aside>

      <footer className="mt-auto pt-5 text-sm text-gray-600 border-t border-gray-300">
        <p>© 2024 Todos os direitos reservados</p>
        <p className="mt-2">Desenvolvido por Webnode</p>
        <p className="mt-2">Cookies</p>
      </footer>
    </div>
  );
}