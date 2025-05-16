import "./App.css";
import Menu from "./components/Menu.jsx";
import LoginPage from "./components/cadastro.jsx";


function App() {
  return (
    <div className="flex">
      <Menu />
      <main className="flex-1 ml-[20%] min-h-screen p-8 bg-gray-50">
        <LoginPage />
      </main>
    </div>
  );
}
export default App;
