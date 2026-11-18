import "./Header.css";
import { useEffect, useState } from "react";
import logo_raitec from "../assets/logo_raitec.jpg";

interface HeaderProps {
    nomeColetivo: string;
    logoColetivo: string;
}

function Header({ nomeColetivo, logoColetivo }: HeaderProps) {
    const [tema, setTema] = useState<"light" | "dark">(
        () => (localStorage.getItem("tema") as "light" | "dark") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", tema);
        localStorage.setItem("tema", tema);
    }, [tema]);

    return (
        <header>
            <div className="header-raitec">
                <span className="logo-tile">
                    <img src={logo_raitec} alt="Logo RAITec" />
                </span>
                <div className="header-titulo">
                    <h1>RAITec Causa Animal</h1>
                </div>
            </div>

            <div className="header-direita">
                <div className="header-coletivo">
                    <img src={logoColetivo} alt={`Logo ${nomeColetivo}`} />
                    <span>{nomeColetivo}</span>
                </div>

                <button
                    type="button"
                    className="tema-toggle"
                    onClick={() => setTema(tema === "light" ? "dark" : "light")}
                    aria-label={tema === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
                    title={tema === "light" ? "Modo escuro" : "Modo claro"}
                >
                    {tema === "light" ? "🌙" : "☀️"}
                </button>
            </div>
        </header>
    );
}

export default Header;
