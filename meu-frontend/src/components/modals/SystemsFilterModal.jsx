import { FiX, FiGlobe, FiPlus } from "react-icons/fi";

export default function SystemsFilterModal({
    showSystemsModal,
    setShowSystemsModal,
    sistemasDisponiveis,
    selectedSystems,
    handleSystemCheckbox,
    selecionarTodosSistemas,
    limparSelecaoSistemas,
}) {
    // Retorna null se o modal não estiver visível
    if (!showSystemsModal) return null;

    // Calcula se o filtro está "ativo" (ou seja, se nem todos nem nenhum estão selecionados)
    const isFilterApplied = selectedSystems.length > 0 && selectedSystems.length < sistemasDisponiveis.length;

    return (
        <div className="modal-overlay" onClick={() => setShowSystemsModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '600px', width: '95%'}}>
                
                <div className="modal-header">
                    <h3><FiGlobe/> Filtrar por Portal de Origem</h3>
                    <button onClick={() => setShowSystemsModal(false)} className="btn-close"><FiX /></button>
                </div>
                
                <div className="modal-body">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                        <span className="filter-label">Selecione os portais para incluir:</span>
                        <button 
                            onClick={selecionarTodosSistemas} 
                            className="btn-secondary" 
                            style={{padding:'4px 8px', fontSize:'0.85rem'}}
                        >
                            <FiPlus size={12}/> Selecionar Todos
                        </button>
                    </div>
                    
                    <div className="chips-wrapper" style={{maxHeight: '300px', overflowY: 'auto', padding: '5px', border: '1px solid #e2e8f0', borderRadius: '6px'}}>
                        {sistemasDisponiveis.map(s => (
                            <label 
                                key={s} 
                                className={`filter-chip ${selectedSystems.includes(s) ? 'active' : ''}`}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={selectedSystems.includes(s)} 
                                    onChange={() => handleSystemCheckbox(s)} 
                                    style={{display:'none'}}
                                /> 
                                {s}
                            </label>
                        ))}
                    </div>
                    {/* Feedback visual se o filtro está aplicado */}
                    {isFilterApplied && (
                        <p style={{marginTop:'10px', fontSize:'0.85rem', color:'#2563eb'}}>
                            **Filtro Ativo:** {selectedSystems.length} de {sistemasDisponiveis.length} portais selecionados.
                        </p>
                    )}
                </div>
                
                <div className="modal-footer" style={{justifyContent: 'flex-start', gap: '10px'}}>
                    <button onClick={limparSelecaoSistemas} className="btn-secondary">
                        Limpar Seleção ({selectedSystems.length})
                    </button>
                    <button className="btn-primary" onClick={() => setShowSystemsModal(false)}>
                        Aplicar Filtro
                    </button>
                </div>
            </div>
        </div>
    );
}