import Menu from "./components/Menu.jsx";
import Profissionais from "./pages/profissionais.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SobreNos from "./pages/sobreNos.jsx"


// <><Menu /><Profissionais /></>
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Menu /><Profissionais /></>} />
        <Route path="/perfil" element={<><Menu /><Perfil /></>} />
        <Route path="/mensagem" element={<><Menu /><Mensagem /></>} />
        <Route path="/contato" element={<><Menu /><Contato /></>} />
        <Route path="/cadastro" element={<><Menu /><Cadastro /></>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

{/* <Route path="/cadastro" element={<CadastroPage />} />
<Route path="/perfil" element={<ProfilePage />} />
<Route path="/mensagens" element={<MensagensPage />} />
<Route path="/contato" element={<ContatoPage />} /> */}