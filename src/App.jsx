import Menu from "./components/layout/Menu.jsx";
import Profissionais from "./pages/profissionais.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Contato from "./pages/sobreNos.jsx"
import Perfil from "./pages/perfil.jsx"
import Mensagem from "./pages/mensagem.jsx"


// <><Menu /><Profissionais /></>
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Profissionais />} />
        <Route path="/perfil" element={<Perfil />} />
        {<Route path="/mensagem" element={<Mensagem />} />}
        <Route path="/contato" element={<Contato />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;