import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contextos/Autenticacao.jsx";
import ProtectedRoute from "./componentes/Autenticacao/ProtectedRoute.jsx";
import AuthRedirect from "./contextos/AuthRedirect.jsx";
import { Suspense, lazy } from "react";
import PainelControle from "./componentes/acessibilidade/PainelControle.jsx";

// Lazy Loading para todas as páginas
const SobreNos = lazy(() => import("./paginas/sobrenos/sobreNos.jsx"));
const Perfil = lazy(() => import("./paginas/Perfil/perfil.jsx"));
const Qualificados = lazy(() => import("./paginas/Qualificados/qualificados.jsx"));
const Cadastro = lazy(() => import("./paginas/Cadastro/Cadastro.jsx"));
const Inicio = lazy(() => import("./paginas/Inicio/Inicio.jsx"));

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
          <Suspense fallback={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              fontSize: '18px'
            }}>
              Carregando...
            </div>
          }>
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

              <Route
                path="/qualificados"
                element={<Qualificados />}
              />

              {/* Rotas protegidas - requerem autenticação */}
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
      {/* <VlibrasWidget /> */}
    </div>
  );
}

export default App;