import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Import das páginas
import Contato from "./pages/contato/contato.jsx"
import Perfil from "./pages/perfil/perfil.jsx"
import Mensagem from "./pages/mensagem/mensagem.jsx"
import Profissionais from "./pages/principal/profissionais.jsx";
import Cadastro from "./pages/cadastro/cadastro.jsx";

// <><Menu /><Profissionais /></>
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Profissionais />} />
        <Route path="/perfil" element={<Perfil />} />
        {<Route path="/mensagem" element={<Mensagem />} />}
        <Route path="/contato" element={<Contato />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;