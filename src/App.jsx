import Menu from "./components/Menu.jsx";
import Profissionais from "./pages/profissionais.jsx";
import Filtro from "./components/filtro.jsx"

function App() {
  return (
    <div>
      <Menu />
      <main>
        <Filtro/>
        <Profissionais/>
      </main>
    </div>
  );
}
export default App;