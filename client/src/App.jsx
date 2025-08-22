import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SobreNos from "./paginas/sobrenos/sobreNos.jsx";
import Perfil from "./paginas/perfil/Perfil.jsx";
import Mensagem from "./paginas/mensagem/mensagem.jsx";
import Qualificados from "./paginas/qualificados/qualificados.jsx";
import Cadastro from "./paginas/cadastro/cadastro.jsx";
import Inicio from "./paginas/inicio/inicio.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/qualificados" element={<Qualificados />} />
        <Route path="/perfil" element={<Perfil />} />
        {/* Temporariamente inativo */}
        {/* <Route path="/mensagem" element={<Mensagem />} /> */}
        <Route path="/sobreNos" element={<SobreNos />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;