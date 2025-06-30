import Menu from './Menu';
import './corpo.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Menu className="menu" />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;