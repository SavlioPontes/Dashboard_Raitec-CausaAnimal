
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
    sexo: string;
    faixa_etaria: string | null;
}

interface GenderProps {
    showCats: boolean;
    showDogs: boolean;
    showPuppies: boolean;
    showAdults: boolean;
}

const colors = ["#2A9D8F", "#FFB703"]; // Macho, Fêmea

function GenderChart({
    showCats,
    showDogs,
    showPuppies,
    showAdults,
}: GenderProps) 
{

    const [animals, setAnimals] = useState<Animal[]>([]);

    useEffect(() => {
        fetch("/api/animais/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar animais");
                }
                return response.json();
            })
            .then((data: Animal[]) => setAnimals(data))
            .catch((error) => console.error(error));
    }, []);

    // Se todas as idades estão selecionadas,
    // não restringimos os animais pela idade.
    const allAges = showPuppies && showAdults;

    const filteredAnimals = animals.filter((animal) => {

        const speciesMatch =
            (showCats && animal.especie === "Gato") ||
            (showDogs && animal.especie === "Cachorro");

        const age = animal.faixa_etaria?.trim().toLowerCase();

        const ageMatch =
            allAges ||
            (showPuppies && age === "filhote") ||
            (showAdults && age === "adulto")

        return speciesMatch && ageMatch;
    });

    const data = [
        {
            name: "Macho",
            value: filteredAnimals.filter(
                (animal) => animal.sexo === "Macho"
            ).length
        },
        {
            name: "Fêmea",
            value: filteredAnimals.filter(
                (animal) => animal.sexo === "Fêmea"
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

export default GenderChart;
