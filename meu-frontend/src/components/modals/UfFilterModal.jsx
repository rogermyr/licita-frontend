import { FiX, FiMapPin, FiPlus } from "react-icons/fi";

export default function UfFilterModal({
    showUfModal,
    setShowUfModal,
    ufsDisponiveis,
    selectedUFs,
    handleUFCheckbox,
    selecionarTodosUFs,
    limparSelecaoUFs,
}) {
    // Retorna null se o modal não estiver visível
    if (!showUfModal) return null;

    // Calcula se o filtro está "ativo" (ou seja, se nem todos nem nenhum estão selecionados)
    const isFilterApplied = selectedUFs.length > 0 && selectedUFs.length < ufsDisponiveis.length;

    return (
        <div className="modal-overlay" onClick={() => setShowUfModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '600px', width: '95%'}}>
                
                <div className="modal-header">
                    <h3><FiMapPin/> Filtrar por UF (Local)</h3>
                    <button onClick={() => setShowUfModal(false)} className="btn-close"><FiX /></button>
                </div>
                
                <div className="modal-body">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                        <span className="filter-label">Selecione as UFs para incluir:</span>
                        <button 
                            onClick={selecionarTodosUFs} 
                            className="btn-secondary" 
                            style={{padding:'4px 8px', fontSize:'0.85rem'}}
                        >
                            <FiPlus size={12}/> Selecionar Todos
                        </button>
                    </div>
                    
                    <div className="chips-wrapper" style={{maxHeight: '300px', overflowY: 'auto', padding: '5px', border: '1px solid #e2e8f0', borderRadius: '6px'}}>
                        {ufsDisponiveis.map(uf => (
                            <label 
                                key={uf} 
                                className={`filter-chip ${selectedUFs.includes(uf) ? 'active' : ''}`}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={selectedUFs.includes(uf)} 
                                    onChange={() => handleUFCheckbox(uf)} 
                                    style={{display:'none'}}
                                /> 
                                {uf}
                            </label>
                        ))}
                    </div>
                    {/* Feedback visual se o filtro está aplicado */}
                    {isFilterApplied && (
                        <p style={{marginTop:'10px', fontSize:'0.85rem', color:'#2563eb'}}>
                            **Filtro Ativo:** {selectedUFs.length} de {ufsDisponiveis.length} UFs selecionadas.
                        </p>
                    )}
                </div>
                
                <div className="modal-footer" style={{justifyContent: 'flex-start', gap: '10px'}}>
                    <button onClick={limparSelecaoUFs} className="btn-secondary">
                        Limpar Seleção ({selectedUFs.length})
                    </button>
                    <button className="btn-primary" onClick={() => setShowUfModal(false)}>
                        Aplicar Filtro
                    </button>
                </div>
            </div>
        </div>
    );
}