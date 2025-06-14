import Menu from './Menu';
import './corpo.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <div className='menufantasma'><Menu /></div>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;