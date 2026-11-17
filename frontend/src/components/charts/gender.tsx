import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useEffect, useState } from "react";

interface Animal {
  id: number;
  especie: string;
  sexo: string;
}

interface GenderProps {
  showCats: boolean;
  showDogs: boolean;
}


const colors = ["#1f81f1", "#f14242"];

function GenderChart({ showCats, showDogs }: GenderProps) {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/animais")
      .then((response) => response.json())
      .then((data) => setAnimals(data));
  }, []);

  const filteredAnimals = animals.filter(
    animal =>
        (showCats && animal.especie === "Gato") ||
        (showDogs && animal.especie === "Cachorro")
  );

  const data = [
    {
      name: "Macho",
      value: filteredAnimals.filter((animal) => animal.sexo === "Macho").length,
    },
    {
      name: "Fêmea",
      value: filteredAnimals.filter((animal) => animal.sexo === "Fêmea").length,
    },
  ];

  return (
    <div style={{ width: "100%", height: 300, fontFamily: 'Ubuntu, sans-serif' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#FFBB00"
            label
          >
            {data.map((item, index) => (
              <Cell key={item.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GenderChart;