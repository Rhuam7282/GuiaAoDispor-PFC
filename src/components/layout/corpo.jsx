import React from 'react';
import Menu from './Menu';
import './corpo.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Menu />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;