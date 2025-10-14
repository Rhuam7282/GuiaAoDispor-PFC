import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contextos/autenticacao.jsx";
import ProtectedRoute from "./componentes/autenticacao/protectedroute.jsx";
import AuthRedirect from "./contextos/authredirect.jsx";
import { Suspense, lazy } from "react";
import PainelControle from "./componentes/acessibilidade/painelcontrole.jsx";

// Lazy Loading para todas as páginas
const SobreNos = lazy(() => import("./paginas/sobrenos/sobrenos.jsx"));
const Perfil = lazy(() => import("./paginas/perfil/perfil.jsx"));
const Qualificados = lazy(() => import("./paginas/qualificados/qualificados.jsx"));
const Cadastro = lazy(() => import("./paginas/cadastro/cadastro.jsx"));
const Inicio = lazy(() => import("./paginas/inicio/inicio.jsx"));

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
