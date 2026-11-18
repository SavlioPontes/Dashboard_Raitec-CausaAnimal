
import "./Filters.css";
import type { Dispatch, SetStateAction } from "react";

interface FiltersProps {
    showCats: boolean;
    setShowCats: Dispatch<SetStateAction<boolean>>;

    showDogs: boolean;
    setShowDogs: Dispatch<SetStateAction<boolean>>;

    showPuppies: boolean;
    setShowPuppies: Dispatch<SetStateAction<boolean>>;

    showAdults: boolean;
    setShowAdults: Dispatch<SetStateAction<boolean>>;
}

function Filters({
    showCats,
    setShowCats,
    showDogs,
    setShowDogs,
    showPuppies,
    setShowPuppies,
    showAdults,
    setShowAdults,
}: FiltersProps) {

    function resetFilters() {
        setShowCats(true);
        setShowDogs(true);
        setShowPuppies(true);
        setShowAdults(true);
    }

    const speciesCount = Number(showCats) + Number(showDogs);
    const ageCount =
        Number(showPuppies) +
        Number(showAdults)

    return (
        <div className="filters">
            <div className="filters-header">
                <h2>Filtros</h2>

                <button
                    type="button"
                    className="filters-reset"
                    onClick={resetFilters}
                >
                    Limpar filtros
                </button>
            </div>

            <div className="filters-groups">
                <details className="filter-dropdown">
                    <summary>
                        Espécie
                        <span>{speciesCount}/2</span>
                    </summary>

                    <div className="filter-options">
                        <label>
                            <input
                                type="checkbox"
                                checked={showCats}
                                onChange={(e) => setShowCats(e.target.checked)}
                            />
                            Gatos
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={showDogs}
                                onChange={(e) => setShowDogs(e.target.checked)}
                            />
                            Cachorros
                        </label>
                    </div>
                </details>

                <details className="filter-dropdown">
                    <summary>
                        Faixa etária
                        <span>{ageCount}/2</span>
                    </summary>

                    <div className="filter-options">
                        <label>
                            <input
                                type="checkbox"
                                checked={showPuppies}
                                onChange={(e) => setShowPuppies(e.target.checked)}
                            />
                            Filhotes
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={showAdults}
                                onChange={(e) => setShowAdults(e.target.checked)}
                            />
                            Adultos
                        </label>
                    </div>
                </details>
            </div>
        </div>
    );
}

export default Filters;
