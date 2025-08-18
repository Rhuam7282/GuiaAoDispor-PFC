import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Contato from "./paginas/contato/Contato.jsx";
import Perfil from "./paginas/perfil/Perfil.jsx";
import Mensagem from "./paginas/mensagem/mensagem.jsx";
import Profissionais from "./paginas/principal/profissionais.jsx";
import Cadastro from "./paginas/cadastro/cadastro.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Profissionais />} />
        <Route path="/perfil" element={<Perfil />} />
        {/* Temporariamente inativo */}
        {/* <Route path="/mensagem" element={<Mensagem />} /> */}
        <Route path="/contato" element={<Contato />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;