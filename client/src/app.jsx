// client/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contextos/autenticacao.jsx";
import ProtectedRoute from "./componentes/autenticacao/protectedroute.jsx";

import SobreNos from "./paginas/sobrenos/sobrenos.jsx";
import Perfil from "./paginas/perfil/perfil.jsx";
// import Mensagem from "./paginas/mensagem/mensagem.jsx";
import Qualificados from "./paginas/qualificados/qualificados.jsx";
import Cadastro from "./paginas/cadastro/cadastro.jsx";
import Inicio from "./paginas/inicio/inicio.jsx";
import PainelControle from "./componentes/acessibilidade/painelcontrole.jsx";
import VlibrasWidget from "./componentes/acessibilidade/vlibras/vlibraswidget.jsx";

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
            <Route path="/cadastro" element={<Cadastro />} />

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
            {/* <Route
              path="/mensagem"
              element={
                <ProtectedRoute>
                  <Mensagem />
                </ProtectedRoute>
              }
            /> */}

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
