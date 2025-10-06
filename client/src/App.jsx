// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProvedorAutenticacao } from './contextos/Autenticacao.jsx';
import ProtectedRoute from './componentes/Autenticacao/ProtectedRoute.jsx';
import AuthRedirect from './componentes/Autenticacao/AuthRedirect.jsx';
import SobreNos from "./paginas/sobrenos/sobreNos.jsx";
import Perfil from "./paginas/perfil/perfil.jsx";
import Mensagem from "./paginas/mensagem/mensagem.jsx";
import Qualificados from "./paginas/qualificados/qualificados.jsx";
import Cadastro from "./paginas/cadastro/cadastro.jsx";
import Inicio from "./paginas/inicio/inicio.jsx";
import PainelControle from "./componentes/acessibilidade/PainelControle.jsx";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
      <ProvedorAutenticacao>
        <PainelControle />
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/sobreNos" element={<SobreNos />} />
          
          {/* Rotas que redirecionam se autenticado */}
          <Route path="/cadastro" element={
            <>
              <AuthRedirect redirecionarSeAutenticado={true} destinoAutenticado="/qualificados" />
              <Cadastro />
            </>
          } />
          
          {/* Rotas protegidas - requerem autenticação */}
          <Route path="/qualificados" element={
            <ProtectedRoute>
              <Qualificados />
            </ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } />
          <Route path="/perfil/:id" element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } />
          <Route path="/mensagem" element={
            <ProtectedRoute>
              <Mensagem />
            </ProtectedRoute>
          } />
          
          {/* Rota 404 */}
          <Route path="*" element={
            <div className="pagina-nao-encontrada">
              <h1>Página não encontrada</h1>
              <p>A página que você está procurando não existe.</p>
            </div>
          } />
        </Routes>
      </ProvedorAutenticacao>
    </BrowserRouter>
  );
}

export default App;