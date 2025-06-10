import Menu from "./components/Menu.jsx";
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
        <Route path="/" element={<><Menu /><Profissionais /></>} />
        <Route path="/perfil" element={<><Menu /><Perfil /></>} />
<<<<<<< HEAD
        {/* <Route path="/mensagem" element={<><Menu /><Mensagem /></>} /> */}
=======
        {<Route path="/mensagem" element={<><Menu /><Mensagem /></>} />}
>>>>>>> c4e61b94fd05c435463afc2bd7c9e7705f72c3ef
        <Route path="/contato" element={<><Menu /><Contato /></>} />
        
      </Routes>
    </BrowserRouter>
  );
}
export default App;