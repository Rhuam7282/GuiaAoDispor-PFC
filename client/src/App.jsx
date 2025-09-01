import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contextos/AuthContext';
import SobreNos from "./paginas/sobrenos/sobreNos.jsx";
import Perfil from "./paginas/perfil/perfil.jsx";
import Mensagem from "./paginas/mensagem/mensagem.jsx";
import Qualificados from "./paginas/qualificados/qualificados.jsx";
import Cadastro from "./paginas/cadastro/cadastro.jsx";
import Inicio from "./paginas/inicio/inicio.jsx";
import PainelControle from "@componentes/acessibilidade/controles";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
      future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
        <PainelControle />
        {}
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/qualificados" element={<Qualificados />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/sobreNos" element={<SobreNos />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/perfil/:id" element={<Perfil />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
