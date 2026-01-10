// src/pages/Dashboard.jsx

import React, { 
    useState, useEffect, useMemo, useCallback, 
    lazy, Suspense
} from 'react';
import { jwtDecode } from "jwt-decode";
import api from '../services/api'; 

// Hooks
import { useProfileManagement } from '../hooks/useProfileManagement';
import { useLicitacoesSearch } from '../hooks/useLicitacoesSearch'; 

// Layout & UI
import Sidebar from '../components/layout/Sidebar';
import UserDropdown from '../components/ui/UserDropdown';
import OpportunityDetailModal from '../components/modals/DetailsModal';
import UfFilterModal from '../components/modals/UfFilterModal';
import ProfileModal from '../components/modals/ProfileModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

import '../App.css'; 

// Lazy Pages
const AcompanhamentoPage = lazy(() => import('../pages/Acompanhamento'));
const GerenciarPerfis = lazy(() => import('../pages/GerenciarPerfis'));
const OportunidadesPage = lazy(() => import('../pages/Oportunidades'));
// AnaliseIA removida daqui
const MeuPerfil = lazy(() => import('../pages/MeuPerfil'));

function Dashboard({ token, setToken }) {
    
    const [activeTab, setActiveTab] = useState('oportunidades'); 
    const [showUfModal, setShowUfModal] = useState(false);
    const [modalItem, setModalItem] = useState(null);
    // iaLoading removido daqui
    const [ufsDisponiveis, setUfsDisponiveis] = useState([]);

    const username = useMemo(() => { 
        try { return token ? jwtDecode(token).sub : "Usuário"; } 
        catch { return "Usuário"; } 
    }, [token]);

    const searchHook = useLicitacoesSearch(api, ufsDisponiveis); 

    const { 
        matches, loadingScan, totalItems, 
        currentPageIndex, cursorInfo, 
        handleNextPage, handlePreviousPage, rodarVarredura, 
        selectedProfiles, handleProfileSelection,
        selectedUFs, handleUFCheckbox, limparSelecaoUFs, selecionarTodosUFs,
        selectedSingleModalidade, setSelectedSingleModalidade,
        minValue, setMinValue,
        maxValue, setMaxValue,
        customKeywords, setCustomKeywords,
        customNegativeKeywords, setCustomNegativeKeywords, 
        carregarUFs 
    } = searchHook;

    const loadUfs = useCallback(async () => {
        try {
            const res = await api.get('/ufs-disponiveis');
            setUfsDisponiveis(res.data);
            if (carregarUFs) carregarUFs(res.data); 
        } catch(e) { 
            console.error("Erro ao carregar UFs:", e); 
        }
    }, [api, carregarUFs]);
    
    const {
        perfis, carregarPerfis, 
        showProfileModal, fecharModal, 
        nome, setNome, keys, setKeys, negs, setNegs, editingId,
        salvarPerfil, excluirPerfil, abrirModalCriacao, iniciarEdicao,
    } = useProfileManagement(api, loadUfs);

    const isUFActive = useMemo(() => 
        (selectedUFs.length > 0) && (selectedUFs.length < ufsDisponiveis.length),
        [selectedUFs, ufsDisponiveis] 
    );
    
    useEffect(() => {
        if (!token) return;

        if (activeTab === 'perfis' || activeTab === 'oportunidades') {
            carregarPerfis();
            loadUfs();     
        }
    }, [activeTab, token, carregarPerfis, loadUfs]); 

    const logout = () => { 
        localStorage.removeItem('access_token'); 
        setToken(null); 
    }; 

    if (!token) return <LoadingSpinner text="Autenticando..." />;

    const renderContent = () => {
        switch (activeTab) {
            case 'perfis':
                return (
                    <GerenciarPerfis
                        perfis={perfis}
                        iniciarEdicao={iniciarEdicao}
                        excluirPerfil={excluirPerfil}
                        abrirModalCriacao={abrirModalCriacao}
                    />
                );
            case 'acompanhamento':
                return <AcompanhamentoPage api={api} />;
            case 'perfil':
                return <MeuPerfil api={api} />;
            // Case 'edicao_ia' removido daqui
            case 'oportunidades':
                return (
                    <OportunidadesPage
                        token={token}
                        perfis={perfis}
                        matches={matches}
                        loadingScan={loadingScan}
                        rodarVarredura={rodarVarredura}
                        setModalItem={setModalItem}
                        currentPageIndex={currentPageIndex} 
                        cursorInfo={cursorInfo} 
                        handleNextPage={handleNextPage} 
                        handlePreviousPage={handlePreviousPage}
                        selectedProfiles={selectedProfiles}
                        handleCheckbox={handleProfileSelection} 
                        selectedSingleModalidade={selectedSingleModalidade}
                        setSelectedSingleModalidade={setSelectedSingleModalidade} 
                        minValue={minValue}
                        setMinValue={setMinValue}
                        maxValue={maxValue}
                        setMaxValue={setMaxValue}
                        customKeywords={customKeywords}
                        setCustomKeywords={setCustomKeywords}
                        customNegativeKeywords={customNegativeKeywords}
                        setCustomNegativeKeywords={setCustomNegativeKeywords}
                        ufsDisponiveis={ufsDisponiveis} 
                        selectedUFs={selectedUFs}
                        handleUFCheckbox={handleUFCheckbox}
                        limparSelecaoUFs={limparSelecaoUFs}
                        selecionarTodosUFs={selecionarTodosUFs}
                        setShowUfModal={setShowUfModal}
                        isUFActive={isUFActive}
                    />
                );
            default:
                return <div>Página não encontrada.</div>;
        }
    };

    return (
        <div className="dashboard-container">
            {/* Lembre-se de remover o item do menu dentro do componente Sidebar também */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} logout={logout} />

            <main className="main-content">
                <div className="page-container">
                    <header className="header-top">
                        <h2>
                            {activeTab === 'perfis' && 'Meus Perfis'}
                            {activeTab === 'oportunidades' && 'Buscar Licitações'}
                            {activeTab === 'acompanhamento' && 'Minhas Licitações'} 
                            {/* Título de Análise por IA removido */}
                            {activeTab === 'perfil' && 'Meu Perfil'}
                        </h2>
                        
                        <div className="user-info">
                            <UserDropdown 
                                userName={username} 
                                api={api} 
                                onLogoutSuccess={logout} 
                                onNavigate={(path) => setActiveTab(path.replace('/', ''))}
                            />
                        </div>
                    </header>
                    
                    <Suspense fallback={<LoadingSpinner text="Carregando..." />}>
                        {renderContent()}
                    </Suspense>
                </div>

                <ProfileModal
                    showProfileModal={showProfileModal} fecharModal={fecharModal} editingId={editingId} 
                    nome={nome} setNome={setNome} keys={keys} setKeys={setKeys} negs={negs} setNegs={setNegs}
                    salvarPerfil={salvarPerfil}
                />
                
                <UfFilterModal
                    showUfModal={showUfModal} setShowUfModal={setShowUfModal}
                    ufsDisponiveis={ufsDisponiveis} selectedUFs={selectedUFs}
                    handleUFCheckbox={handleUFCheckbox} limparSelecaoUFs={limparSelecaoUFs}
                    selecionarTodosUFs={selecionarTodosUFs}
                />

                <OpportunityDetailModal
                    modalItem={modalItem}
                    setModalItem={setModalItem}
                />
            </main>
        </div>
    );
}

export default Dashboard;