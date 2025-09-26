import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProvedorAutenticacao } from './Contextos/Autenticacao.jsx';
import SobreNos from './Paginas/SobreNos/SobreNos.jsx';
import Perfil from './Paginas/Perfil/Perfil.jsx';
import Mensagem from './Paginas/Mensagem/Mensagem.jsx';
import Qualificados from './Paginas/Qualificados/Qualificados.jsx';
import Cadastro from './Paginas/Cadastro/Cadastro.jsx';
import Inicio from './Paginas/Inicio/Inicio.jsx';
import Layout from './Componentes/Layout/Corpo.jsx';

function App() {
  return (
    <ProvedorAutenticacao>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Inicio />} />
            <Route path="qualificados" element={<Qualificados />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="sobre-nos" element={<SobreNos />} />
            <Route path="cadastro" element={<Cadastro />} />
            <Route path="perfil/:id" element={<Perfil />} />
            <Route path="mensagem" element={<Mensagem />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProvedorAutenticacao>
  );
}

export default App;

