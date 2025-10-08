// client/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./Contextos/Autenticacao.jsx";
import ProtectedRoute from "./Componentes/Autenticacao/ProtectedRoute.jsx";
import AuthRedirect from "./Componentes/Autenticacao/AuthRedirect.jsx";
import SobreNos from "./Paginas/Sobrenos/SobreNos.jsx";
import Perfil from "./Paginas/Perfil/Perfil.jsx";
import Mensagem from "./Paginas/Mensagem/Mensagem.jsx";
import Qualificados from "./Paginas/Qualificados/Qualificados.jsx";
import Cadastro from "./Paginas/Cadastro/Cadastro.jsx";
import Inicio from "./Paginas/Inicio/Inicio.jsx";
import PainelControle from "./Componentes/Acessibilidade/PainelControle.jsx";
import VlibrasWidget from "./Componentes/Acessibilidade/VLibras/VLibrasWidget.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthContext>
          <PainelControle />
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Inicio />} />
            <Route path="/sobreNos" element={<SobreNos />} />

            {/* Rotas que redirecionam se autenticado */}
            <Route
              path="/cadastro"
              element={
                <>
                  <AuthRedirect
                    redirecionarSeAutenticado={true}
                    destinoAutenticado="/qualificados"
                  />
                  <Cadastro />
                </>
              }
            />

            {/* Rotas protegidas - requerem autenticação */}
            <Route
              path="/qualificados"
              element={
                <ProtectedRoute>
                  <Qualificados />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil/:id"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mensagem"
              element={
                <ProtectedRoute>
                  <Mensagem />
                </ProtectedRoute>
              }
            />

            {/* Rota 404 */}
            <Route
              path="*"
              element={
                <div className="pagina-nao-encontrada">
                  <h1>Página não encontrada</h1>
                  <p>A página que você está procurando não existe.</p>
                </div>
              }
            />
          </Routes>
        </AuthContext>
      </BrowserRouter>
      <VlibrasWidget />
    </div>
  );
}

export default App;
