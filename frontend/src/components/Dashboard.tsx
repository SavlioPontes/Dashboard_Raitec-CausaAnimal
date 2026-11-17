import "./Dashboard.css"
import GenderChart from "./charts/gender";
import { useState } from "react";

interface DashboardProps {
    nomeColetivo: string;
}

function Dashboard({ nomeColetivo }: DashboardProps) {
    const [showCats,setShowCats] = useState(true);
    const [showDogs,setShowDogs] = useState(true);

    return (
        <><section className="dashboard">
            <h2>Dashboard Causa Animal</h2>
            <h3>Dados do coletivo {nomeColetivo}</h3>
        </section>

        <section className="filtros">
            <h2>Filtros</h2>
            <div className="filtros-container">
                <div className="filtro">
                    <label>
                        <input
                            type="checkbox"
                            checked={showCats}
                            onChange={() => setShowCats(!showCats)}
                        />
                        Gatos
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showDogs}
                            onChange={() => setShowDogs(!showDogs)}
                        />
                        Cachorros
                    </label>
                </div>                
            </div>
        </section>

        <section className="Charts">
            <h2>Visão Geral</h2>
            <div className="charts-container">
                <div className="chart">
                    <h3>Distribuição por Gênero</h3>
                    <GenderChart
                     showCats={showCats}
                     showDogs={showDogs}
                    />
                </div>
            </div>
        </section>
        </>       
    )
}
 
export default Dashboard;