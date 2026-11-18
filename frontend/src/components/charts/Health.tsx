
import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

interface Animal {
    id: number;
    especie: string;
    faixa_etaria: string | null;
    castrado: boolean | null;
    vacinado: boolean | null;
}

interface HealthProps {
    tipo: "castrado" | "vacinado";
    showCats: boolean;
    showDogs: boolean;
    showPuppies: boolean;
    showAdults: boolean;
}

const colors_castration = [ "#327C92", "#F47C68", "#A9B8C5"];
const colors_vaccination = ["#A3C65C", "#8561C5", "#A9B8C5"];

function HealthChart({
    tipo,
    showCats,
    showDogs,
    showPuppies,
    showAdults
}: HealthProps) {

    const colors =
    tipo === "castrado" ? colors_castration : colors_vaccination;
    const [animals, setAnimals] = useState<Animal[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/animais/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar animais");
                }

                return response.json();
            })
            .then((data: Animal[]) => setAnimals(data))
            .catch((error) => console.error(error));
    }, []);

    // Filtros de espécie e idade
    const allAges = showPuppies && showAdults;

    const filteredAnimals = animals.filter((animal) => {
        const speciesMatch =
            (showCats && animal.especie === "Gato") ||
            (showDogs && animal.especie === "Cachorro");

        const age = animal.faixa_etaria?.trim().toLowerCase();

        const ageMatch =
            allAges ||
            (showPuppies && age === "filhote") ||
            (showAdults && age === "adulto");

        return speciesMatch && ageMatch;
    });

    // Dados específicos de castração ou vacinação
    const data = [
        {
            name: tipo === "castrado" ? "Castrados" : "Vacinados",
            value: filteredAnimals.filter(
                (animal) => animal[tipo] === true
            ).length
        },
        {
            name: tipo === "castrado" ? "Não castrados" : "Não vacinados",
            value: filteredAnimals.filter(
                (animal) => animal[tipo] === false
            ).length
        },
        {
            name: "Não informado",
            value: filteredAnimals.filter(
                (animal) => animal[tipo] == null
            ).length
        }
    ];

    const total = data.reduce(
        (soma, item) => soma + item.value,
        0
    );

    const porcentagem = (valor: number) =>
        total ? Math.round((valor / total) * 100) : 0;

    return (
        <div className="gender">
            <div className="gender-donut">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={72}
                            outerRadius={104}
                            paddingAngle={total ? 3 : 0}
                            stroke="var(--surface)"
                            strokeWidth={3}
                        >
                            {data.map((item, index) => (
                                <Cell
                                   key={item.name} 
                                   fill={colors[index % colors.length]} 
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value, name) => [
                                `${value} animais`,
                                name
                            ]}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="gender-centro">
                    <strong>{total}</strong>
                    <span>animais</span>
                </div>
            </div>

            <ul className="gender-legenda">
                {data.map((item, index) => (
                    <li
                        key={item.name}
                        style={{
                            "--cor": colors[index % colors.length]
                        } as CSSProperties}
                    >
                        <div>
                            <span className="gender-nome">
                                {item.name}
                            </span>

                            <span className="gender-qtd">
                                {item.value} animais
                            </span>
                        </div>

                        <strong className="gender-pct">
                            {porcentagem(item.value)}%
                        </strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HealthChart;
