import logo from "../assets/logo.svg"
import "./Menu.css"
function Menu() {
  return (
    <div>
      <img src={logo} alt="logo da empresa" />
      <aside>
        <ul>
          <li>Início</li>
          <li>Perfil</li>
          <li>Mensagem</li>
          <li>Contato</li>
        </ul>
      </aside>
      <footer>
        <p>© 2024 Todos os direitos reservados</p>
        <p>Desenvolvido por Webnode</p>
        <p>Cookies</p>
      </footer>
    </div>
  );
}
export default Menu;
