import Menu from './Menu';
import './corpo.css';
import PainelControle from "../../components/acessibilidade/controles"; // 

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <PainelControle />
      <Menu className="menu" />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;