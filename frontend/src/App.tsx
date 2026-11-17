import "./App.css";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header 
        nomeColetivo="Animais Universitários" 
        logoColetivo="/aus.jpg" 
      />
      <main>
        <Dashboard
          nomeColetivo="Animais Universitários"
        />
      </main>
    </>
  );
}

export default App;