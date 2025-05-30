import Menu from "./components/Menu.jsx";
import Profissionais from "./components/profissionais.jsx";


function App() {
  return (
    <div className="flex">
      <Menu />
      <main className="flex-1 ml-[20%] min-h-screen p-8 bg-gray-900">
        <Profissionais/>
      </main>
    </div>
  );
}
export default App;
