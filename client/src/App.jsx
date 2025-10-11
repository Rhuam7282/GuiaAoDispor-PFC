import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contextos/Autenticacao.jsx";
import ProtectedRoute from "./componentes/Autenticacao/ProtectedRoute.jsx";
import AuthRedirect from "./componentes/Autenticacao/AuthRedirect.jsx";

import SobreNos from "./paginas/sobrenos/sobreNos.jsx";
import Perfil from "./paginas/Perfil/perfil.jsx";
import Qualificados from "./paginas/Qualificados/qualificados.jsx";
import Cadastro from "./paginas/Cadastro/Cadastro.jsx";
import Inicio from "./paginas/Inicio/Inicio.jsx";
import PainelControle from "./componentes/Acessibilidade/PainelControle.jsx";
import VlibrasWidget from "./componentes/Acessibilidade/VLibras/VLibrasWidget.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
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
        </AuthProvider>
      </BrowserRouter>
      <VlibrasWidget />
    </div>
  );
}

export default App;