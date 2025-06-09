import Menu from "./components/Menu.jsx";
import Profissionais from "./pages/profissionais.jsx";
import Filtro from "./components/filtro.jsx"
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Routes>
            {<Route path="/" element={<><Menu/><Profissionais /></>} />}
            {/* <Route path="/perfil" element={<><Menu/><Perfil/></>} /> } */}
            {/* <Route path="/mensagem" element={<><Menu/><Mensagem/></>} /> */}
            {/* <Route path="/contato" element={<><Menu/><Contato/></>} /> */}
            {/* <Route path="/cadastro" element={<><Menu/><Cadastro/></>} />Vou começar a ver isso daqui tá */}
        </Routes>
    </BrowserRouter>
  );
}
export default App;