<<<<<<< HEAD
//import { useState } from 'react'
import './App.css'
import Menu from '../components/Menu.jsx'

function App() {
    return (<Menu/>)
}

export default App
=======
import "./App.css";
import Menu from "./components/Menu.jsx";
import LoginPage from "./components/cadastro.jsx";


function App() {
  return (
    <div className="flex">
      <Menu />
      <main className="flex-1 ml-[20%] min-h-screen p-8 bg-gray-50">
        <LoginPage />
      </main>
    </div>
  );
}
export default App;
>>>>>>> edc0c24bf28698abccd3a244ef395b81b0d622e1
