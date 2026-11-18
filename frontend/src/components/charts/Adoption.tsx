
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";
import "./Adoption.css";

interface Animal {
    id: number;
    especie: string;
    faixa_etaria: string | null;
}

interface Ocorrencia {
    id: number;
    animal_id: number | null;
    tipo: string;
    ano: number | null;
    data_ocorrencia: string | null;
}

interface AdoptionProps {
    showCats: boolean;
    showDogs: boolean;
    showPuppies: boolean;
    showAdults: boolean;
}

interface AdoptionData {
    ano: string;
    quantidade: number;
}

function AdoptionChart({
    showCats,
    showDogs,
    showPuppies,
    showAdults
}: AdoptionProps) {

    const [animals, setAnimals] = useState<Animal[]>([]);
    const [occurrences, setOccurrences] = useState<Ocorrencia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            try {
                setLoading(true);

                const [animalsResponse, occurrencesResponse] =
                    await Promise.all([
                        fetch("http://localhost:8000/api/animais/", {
                            signal: controller.signal
                        }),
                        fetch("http://localhost:8000/api/ocorrencias/", {
                            signal: controller.signal
                        })
                    ]);

                if (!animalsResponse.ok || !occurrencesResponse.ok) {
                    throw new Error("Erro ao buscar os dados");
                }

                const animalsData: Animal[] =
                    await animalsResponse.json();

                const occurrencesData: Ocorrencia[] =
                    await occurrencesResponse.json();

                if (controller.signal.aborted) return;

                setAnimals(animalsData);
                setOccurrences(occurrencesData);
                setError("");

            } catch (error) {
                if (!controller.signal.aborted) {
                    setError("Não foi possível carregar as adoções.");
                    console.error(error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => controller.abort();
    }, []);

    // Verifica se todos os filtros estão selecionados
    const allSpecies = showCats && showDogs;
    const allAges = showPuppies && showAdults;

    // Facilita encontrar um animal pelo seu ID
    const animalsById = new Map(
        animals.map((animal) => [animal.id, animal])
    );

    // Seleciona somente as ocorrências de adoção
    const adoptions = occurrences.filter(
        (occurrence) => occurrence.tipo.toLowerCase() === "adocao"
    );

    // Aplica os filtros de espécie e idade
    const filteredAdoptions = adoptions.filter((occurrence) => {
        const animal = occurrence.animal_id !== null
            ? animalsById.get(occurrence.animal_id)
            : undefined;

        // Sem filtros restritivos, mantém todas as adoções
        if (allSpecies && allAges) {
            return true;
        }

        // Não é possível filtrar registros sem animal vinculado
        if (!animal) {
            return false;
        }

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

    // Agrupa as adoções por ano
    const adoptionsByYear: Record<string, number> = {};

    filteredAdoptions.forEach((occurrence) => {
        const year = occurrence.ano ??
            (occurrence.data_ocorrencia
                ? Number(occurrence.data_ocorrencia.slice(0, 4))
                : null);

        if (year === null || !Number.isInteger(year) || year <= 0) {
            return;
        }

        const key = String(year);

        adoptionsByYear[key] = (adoptionsByYear[key] ?? 0) + 1;
    });

    // Transforma as contagens em dados para o Recharts
    const data: AdoptionData[] = Object.entries(adoptionsByYear)
        .map(([ano, quantidade]) => ({
            ano,
            quantidade
        }))
        .sort((a, b) => Number(a.ano) - Number(b.ano));

    const unlinkedAdoptions = adoptions.filter(
        (occurrence) =>
            occurrence.animal_id === null ||
            !animalsById.has(occurrence.animal_id)
    ).length;

    if (loading) {
        return <p>Carregando adoções...</p>;
    }

    if (error) {
        return <p role="alert">{error}</p>;
    }

    return (
        <div className="adoption-chart-container">
            {data.length > 0 ? (
                <div className="adoption-chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 15,
                                right: 20,
                                left: 0,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="var(--line)"
                            />

                            <XAxis
                                dataKey="ano"
                                tickLine={false}
                                axisLine={false}
                            />

                            <YAxis
                                allowDecimals={false}
                                tickLine={false}
                                axisLine={false}
                            />

                            <Tooltip
                                formatter={(value) => [
                                    `${value} adoções`,
                                    "Quantidade"
                                ]}
                            />

                            <Bar
                                dataKey="quantidade"
                                name="Adoções"
                                fill="#E58A62"
                                radius={[8, 8, 0, 0]}
                                maxBarSize={65}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p>Nenhuma adoção encontrada para os filtros selecionados.</p>
            )}

            {(!allSpecies || !allAges) && unlinkedAdoptions > 0 && (
                <p className="adoption-warning">
                    {unlinkedAdoptions} ocorrência(s) sem animal vinculado
                    não podem ser classificadas pelos filtros.
                </p>
            )}
        </div>
    );
}

export default AdoptionChart;
