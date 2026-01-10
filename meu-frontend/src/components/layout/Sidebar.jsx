import { FiLogOut, FiSearch, FiSettings, FiStar } from "react-icons/fi"; // Adicionado FiStar
import { BsBuildingsFill } from "react-icons/bs";

export default function Sidebar({ activeTab, setActiveTab, logout }) {
    return (
        <aside className="sidebar">
            <div className="logo"><BsBuildingsFill /> Licitou</div>
            <nav>
                <button 
                    className={`menu-btn ${activeTab === 'perfis' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('perfis')}
                >
                    <FiSettings /> Gerenciar Perfis
                </button>
                
                {/* -------------------------------------------------------- */}
                {/* NOVO ITEM DE MENU: LICITAÇÕES EM ACOMPANHAMENTO           */}
                {/* -------------------------------------------------------- */}
                <button 
                    className={`menu-btn ${activeTab === 'acompanhamento' ? 'active' : ''}`} // NOVO
                    onClick={() => setActiveTab('acompanhamento')} // NOVO
                >
                    <FiStar /> Minhas Licitações 
                </button>
                
                <button 
                    className={`menu-btn ${activeTab === 'oportunidades' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('oportunidades')}
                >
                    <FiSearch /> Buscar Licitações
                </button>
                
                <button onClick={logout} className="menu-btn logout-btn">
                    <FiLogOut /> Sair
                </button>
            </nav>
        </aside>
    );
}