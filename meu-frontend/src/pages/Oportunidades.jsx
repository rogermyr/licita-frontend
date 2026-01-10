// src/pages/Oportunidades.jsx

import React from 'react';
import { 
    FiSearch, FiMapPin, FiSettings, FiInbox, 
    FiChevronRight, FiChevronLeft, FiCheck,
    FiDollarSign, FiFilter, FiAlertCircle, FiX, FiMinusCircle 
} from "react-icons/fi";
import MatchTable from '../components/ui/MatchTable';
import { MODALIDADES_DISPONIVEIS } from '../utils/constants';

export default function Oportunidades({
    rodarVarredura, matches, loadingScan, setModalItem, token,
    selectedSingleModalidade, setSelectedSingleModalidade,
    setShowUfModal, isUFActive, selectedUFs,
    perfis, selectedProfiles, handleCheckbox,
    currentPageIndex, cursorInfo, handleNextPage, handlePreviousPage,
    minValue, setMinValue, 
    maxValue, setMaxValue,
    customKeywords = "", 
    setCustomKeywords,
    customNegativeKeywords = "",
    setCustomNegativeKeywords 
}) {
    
    const opportunities = matches; 

    const handleProfileClick = (perfil) => {
        handleCheckbox(perfil.id);

        if (perfil.palavras_chave) {
            const keywords = Array.isArray(perfil.palavras_chave) 
                ? perfil.palavras_chave.join(', ') 
                : perfil.palavras_chave;
            setCustomKeywords(keywords);
        } else {
            setCustomKeywords("");
        }

        if (perfil.palavras_negativas) {
            const negKeywords = Array.isArray(perfil.palavras_negativas) 
                ? perfil.palavras_negativas.join(', ') 
                : perfil.palavras_negativas;
            setCustomNegativeKeywords(negKeywords);
        } else {
            setCustomNegativeKeywords("");
        }
    };

    const renderTags = (sourceString, type = 'primary') => {
        if (!sourceString) return null;
        const tags = sourceString.split(',').filter(k => k.trim() !== '');
        
        return (
            <div className="tags-container" style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {tags.map((tag, i) => (
                    <span key={i} className={`tag-badge ${type}`} style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                        {tag.trim()}
                    </span>
                ))}
            </div>
        );
    };

    const wordCount = (customKeywords || "").split(',').filter(word => word.trim().length > 0).length;
    const isOverLimit = wordCount > 20;
    const temPerfil = selectedProfiles.length > 0;
    const temCustom = customKeywords && customKeywords.trim().length > 0;
    const podeBuscar = (temPerfil || temCustom) && !isOverLimit;

    let content;
    if (loadingScan) {
        content = (
            <div className="state-container" style={{padding:'60px', textAlign:'center', width: '100%'}}>
                <div className="loader-spinner"></div>
                <p style={{marginTop: '15px', color: '#64748b'}}>Buscando oportunidades...</p>
            </div>
        );
    } 
    else if (!opportunities) {
        content = (
            <div className="state-container" style={{padding:'80px', textAlign:'center', color:'#64748b', width: '100%'}}>
                <FiSearch size={48} style={{opacity: 0.2, marginBottom: '20px'}} />
                <h3>Pronto para começar?</h3>
                <p>Selecione um perfil ou digite termos e clique em <strong>Buscar</strong>.</p>
            </div>
        );
    }
    else if (opportunities.length === 0) {
        content = (
            <div className="state-container" style={{padding:'80px', textAlign:'center', color:'#64748b', width: '100%'}}>
                <FiInbox size={48} style={{opacity: 0.2, marginBottom: '20px'}} />
                <p>Nenhuma oportunidade encontrada para os filtros aplicados.</p>
            </div>
        );
    }
    else {
        content = <MatchTable matches={opportunities} setModalItem={setModalItem} token={token} />;
    }

    const getRangeInputStyle = (value) => ({
        width: '100%', height: '42px', borderRadius: '8px',
        border: value ? '2px solid #2563eb' : '1px solid #e2e8f0',
        padding: '0 12px 0 35px', fontSize: '0.9rem',
        backgroundColor: value ? '#f8faff' : '#fff', transition: 'all 0.2s ease'
    });

    return (
        <div className="opportunities-container animated fadeIn" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="control-bar card shadow-sm" style={{ width: '100%', padding: '24px' }}> 
                
                {/* 1. SEÇÃO DE PERFIS (AGORA NO TOPO) */}
                <div className="profiles-selection-zone" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '12px' }}>
                        <FiFilter size={14} style={{marginRight: '6px'}}/> Selecione um perfil para carregar a configuração:
                    </p>

                    <div className="chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {perfis.map(p => {
                            const isSelected = selectedProfiles.includes(p.id); 
                            return (
                                <label 
                                    key={p.id} 
                                    className={`profile-chip ${isSelected ? 'selected' : ''}`}
                                    style={{
                                        display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '50px',
                                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                                        color: isSelected ? '#1d4ed8' : '#64748b',
                                        cursor: 'pointer', fontSize: '0.85rem', fontWeight: isSelected ? '700' : '500', transition: 'all 0.15s ease'
                                    }}
                                >
                                    <input type="radio" name="profileSelection" checked={isSelected} onChange={() => handleProfileClick(p)} style={{ display: 'none' }} /> 
                                    {isSelected && <FiCheck style={{ marginRight: '6px' }} size={14}/>}
                                    {p.nome_perfil}
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* 2. SEÇÃO DE BUSCA PERSONALIZADA */}
                <div className="custom-search-zone" style={{ 
                    marginBottom: '24px', padding: '20px', backgroundColor: '#f8fafc', 
                    borderRadius: '12px', border: '1.5px solid #e2e8f0'
                }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        
                        {/* COLUNA: TERMOS POSITIVOS */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#1e40af' }}>
                                    <FiSearch size={16} /> TERMOS DE BUSCA (QUERO ENCONTRAR)
                                </label>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isOverLimit ? '#ef4444' : '#64748b' }}>
                                    {wordCount} / 20
                                </span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text"
                                    placeholder="Ex: notebook, dell, monitor..."
                                    value={customKeywords}
                                    onChange={(e) => setCustomKeywords(e.target.value)}
                                    style={{
                                        width: '100%', height: '44px', borderRadius: '8px',
                                        border: isOverLimit ? '2px solid #ef4444' : '1px solid #cbd5e1',
                                        padding: '0 35px 0 12px', fontSize: '0.95rem', outline: 'none'
                                    }}
                                />
                                {customKeywords && (
                                    <FiX onClick={() => setCustomKeywords('')} style={{ position: 'absolute', right: '12px', top: '14px', cursor: 'pointer', color: '#94a3b8' }} />
                                )}
                            </div>
                            {renderTags(customKeywords, 'primary')}
                        </div>

                        {/* COLUNA: TERMOS NEGATIVOS */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>
                                    <FiMinusCircle size={16} /> EXCLUIR TERMOS (NÃO QUERO)
                                </label>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text"
                                    placeholder="Ex: usado, sucata, manutenção..."
                                    value={customNegativeKeywords}
                                    onChange={(e) => setCustomNegativeKeywords(e.target.value)}
                                    style={{
                                        width: '100%', height: '44px', borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        padding: '0 35px 0 12px', fontSize: '0.95rem', outline: 'none'
                                    }}
                                />
                                {customNegativeKeywords && (
                                    <FiX onClick={() => setCustomNegativeKeywords('')} style={{ position: 'absolute', right: '12px', top: '14px', cursor: 'pointer', color: '#94a3b8' }} />
                                )}
                            </div>
                            {renderTags(customNegativeKeywords, 'neg')}
                        </div>
                    </div>
                </div>
                
                {/* 3. LINHA DE FILTROS SECUNDÁRIOS */}
                <div className="primary-filters-bar" style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    
                    <div className="filter-group" style={{ minWidth: '220px', flex: 1 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                            <FiSettings size={14} /> Modalidade
                        </label>
                        <select 
                            value={selectedSingleModalidade} 
                            onChange={e => setSelectedSingleModalidade(e.target.value)} 
                            className="form-select"
                            style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        >
                            <option value="todos">Todas as Modalidades</option>
                            {Object.entries(MODALIDADES_DISPONIVEIS).map(([codigo, nome]) => (
                                <option key={codigo} value={codigo}>{nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group" style={{ minWidth: '320px', flex: 1.5 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                            <FiDollarSign size={14} /> Faixa de Valor
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#94a3b8' }}>R$</span>
                                <input type="number" placeholder="Mín" value={minValue} onChange={(e) => setMinValue(e.target.value)} style={getRangeInputStyle(minValue)} />
                            </div>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#94a3b8' }}>R$</span>
                                <input type="number" placeholder="Máx" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} style={getRangeInputStyle(maxValue)} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            className={`btn-secondary ${isUFActive ? 'active' : ''}`} 
                            onClick={() => setShowUfModal(true)} 
                            style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', padding: '0 16px', border: '1px solid #e2e8f0' }}
                        >
                            <FiMapPin size={16} /> UF {isUFActive && <span style={{ background: '#2563eb', color: 'white', padding: '1px 5px', borderRadius: '4px', fontSize: '0.7rem' }}>{selectedUFs.length}</span>}
                        </button>
                        
                        <button 
                            className="btn-primary" 
                            onClick={() => rodarVarredura()} 
                            disabled={loadingScan || !podeBuscar} 
                            style={{ 
                                height: '42px', 
                                minWidth: '180px', // Aumentei um pouco para caber o texto + spinner
                                borderRadius: '8px', 
                                fontWeight: '700', 
                                backgroundColor: !podeBuscar ? '#94a3b8' : '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px' // Garante espaçamento entre spinner e texto
                            }}
                        >
                            {loadingScan ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span>Buscando...</span>
                                </>
                            ) : (
                                <>
                                    <FiSearch size={18}/> 
                                    <span>Buscar Agora</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* PAGINAÇÃO E RESULTADOS PERMANECEM IGUAIS */}
            {opportunities?.length > 0 && (
                <div className="pagination-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 5px' }}>
                    <span className="text-muted" style={{ fontSize: '0.9rem', color: '#64748b' }}>Página <strong>{currentPageIndex + 1}</strong></span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handlePreviousPage} disabled={loadingScan || currentPageIndex === 0} className="btn-pagination"><FiChevronLeft /> Anterior</button>
                        <button onClick={handleNextPage} disabled={loadingScan || !cursorInfo} className="btn-pagination">Próxima <FiChevronRight /></button>
                    </div>
                </div>
            )}
            
            <div className="results-wrapper card shadow-sm" style={{ padding: 0, overflow: 'hidden', width: '100%', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {content} 
            </div>
        </div>
    );
}