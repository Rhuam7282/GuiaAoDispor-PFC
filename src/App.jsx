import Menu from "./components/Menu.jsx";
import Profissionais from "./pages/profissionais.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Contato from "./pages/sobreNos.jsx"
import Perfil from "./pages/perfil.jsx"


// <><Menu /><Profissionais /></>
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Menu /><Profissionais /></>} />
        <Route path="/perfil" element={<><Menu /><Perfil /></>} />
        {/* <Route path="/mensagem" element={<><Menu /><Mensagem /></>} /> */}
        <Route path="/contato" element={<><Menu /><Contato /></>} />
        
      </Routes>
    </BrowserRouter>
  );
}
export default App;