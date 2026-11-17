import "./App.css";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header 
        nomeColetivo="Animais Universitários" 
        logoColetivo="/aus.jpg" 
      />
      <main>
        <h1>Dashboard Causa Animal</h1>
        <p>Dados dos Animais Universitários da UFC</p>

        <section>
          <h2>Visão Geral</h2>
          <p>Em breve, teremos gráficos e estatísticas dos animais. :p</p>
        </section>
      </main>
    </>
  );
}

export default App;