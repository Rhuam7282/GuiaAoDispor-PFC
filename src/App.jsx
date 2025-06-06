import Menu from "./components/Menu.jsx";
import Profissionais from "./pages/profissionais.jsx";
import Filtro from "./components/filtro.jsx"
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
        <Menu></Menu>
      <Routes>
            {/* { <Route path="/" element={<HomePage />} /> */}
            {/* <Route path="/cadastro" element={<CadastroPage />} />Vou começar a ver isso daqui tá */}
            {/* <Route path="/sobre" element={<SobreNosPage />} /> } */}
            <Route path="/" element={<><Menu /><Profissionais /></>} />
            {/* <Route path="/mensagens" element={<MensagensPage />} />
            <Route path="/contato" element={<ContatoPage />} /> */}
        </Routes>
    </BrowserRouter>
  );
}
export default App;