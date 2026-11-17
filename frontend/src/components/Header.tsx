import logo_raitec from "../assets/logo_raitec.png";

interface HeaderProps {
    nomeColetivo: string;
    logoColetivo: string;
}

function Header({nomeColetivo, logoColetivo}: HeaderProps) {
    return (
        <header>
            <h1>Dashboard</h1>
            <div>
                <img src={logo_raitec} alt="Logo RAITec" />
                <span>RAITec - Causa Animal</span>
            </div>

            <div>
                <img src={logoColetivo} alt={`Logo ${nomeColetivo}`} />
                <span>{nomeColetivo}</span>
            </div>
        </header>
    )
}

export default Header;