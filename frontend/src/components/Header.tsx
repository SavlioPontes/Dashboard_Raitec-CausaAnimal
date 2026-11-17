import "./Header.css"
import logo_raitec from "../assets/logo_raitec.png";

interface HeaderProps {
    nomeColetivo: string;
    logoColetivo: string;
}

function Header({nomeColetivo, logoColetivo}: HeaderProps) {
    return (
        <header>
            <h1>Dashboard</h1>
            <div className="header-raitec">
                <img src={logo_raitec} alt="Logo RAITec" />
                <h1>RAITec - Causa Animal</h1>
            </div>

            <div className="header-coletivo">
                <img src={logoColetivo} alt={`Logo ${nomeColetivo}`} />
                <h1>{nomeColetivo}</h1>
            </div>
        </header>
    )
}

export default Header;