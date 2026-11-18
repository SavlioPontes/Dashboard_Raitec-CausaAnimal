
import "./Dashboard.css";
import GenderChart from "./charts/Gender";
import HealthChart from "./charts/Health";
import Filters from "./filters/Filters";
import AdoptionChart from "./charts/Adoption";
import { useState } from "react";

interface DashboardProps {
    nomeColetivo: string;
}

function Dashboard({ nomeColetivo }: DashboardProps) {
    // Filtros de espécie
    const [showCats, setShowCats] = useState(true);
    const [showDogs, setShowDogs] = useState(true);

    // Filtros de faixa etária
    const [showPuppies, setShowPuppies] = useState(true);
    const [showAdults, setShowAdults] = useState(true);

    return (
        <>
            <section className="dashboard">
                <h2>Dashboard</h2>
                <h3>Análise de dados do coletivo {nomeColetivo}</h3>
            </section>

            <section className="filtros">
                <Filters
                    showCats={showCats}
                    setShowCats={setShowCats}
                    showDogs={showDogs}
                    setShowDogs={setShowDogs}
                    showPuppies={showPuppies}
                    setShowPuppies={setShowPuppies}
                    showAdults={showAdults}
                    setShowAdults={setShowAdults}
                />
            </section>

            <section className="Charts">
                <h2>Visão Geral</h2>

                    <div className="charts-container">
                        <div className="chart chart-wide">
                        <h3>Adoções por Ano</h3>
                        <AdoptionChart
                            showCats={showCats}
                            showDogs={showDogs}
                            showPuppies={showPuppies}
                            showAdults={showAdults}
                        />
                    </div>

                    <div className="chart">
                        <h3>Distribuição por Sexo</h3>
                        <GenderChart
                            showCats={showCats}
                            showDogs={showDogs}
                            showPuppies={showPuppies}
                            showAdults={showAdults}
                        />
                    </div>

                    <div className="chart">
                        <h3>Castração</h3>
                        <HealthChart
                            tipo="castrado"
                            showCats={showCats}
                            showDogs={showDogs}
                            showPuppies={showPuppies}
                            showAdults={showAdults}
                        />
                    </div>

                    <div className="chart">
                        <h3>Vacinação</h3>
                        <HealthChart
                            tipo="vacinado"
                            showCats={showCats}
                            showDogs={showDogs}
                            showPuppies={showPuppies}
                            showAdults={showAdults}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

export default Dashboard;
        