// src/components/ui/MatchTable.js

import React from 'react';
import { FiCalendar, FiMapPin, FiInfo } from "react-icons/fi";
import AdicionarAcompanhamentoButton from '../licitacoes/AdicionarAcompanhamentoButton'; 

// --- FUNÇÕES DE FORMATAÇÃO (Helpers) ---
const getSortedMatches = (matches) => {
    if (!Array.isArray(matches)) return [];
    // MODIFICADO: Garante ordenação numérica decrescente pelo valor total calculado no banco
    return [...matches].sort((a, b) => {
        const valA = parseFloat(a.valor_total_item) || 0;
        const valB = parseFloat(b.valor_total_item) || 0;
        return valB - valA;
    });
}

const formatCurrency = (value) => 
    value ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';

const formatDate = (dateString) => 
    dateString ? new Date(dateString).toLocaleDateString('pt-BR') : '-';

// --- COMPONENTE PRINCIPAL ---

export default function MatchTable({ matches, setModalItem, token }) { 
    
    if (!matches || matches.length === 0) return null;
    
    const sortedMatches = getSortedMatches(matches);

    const handleAcompanhado = () => { 
        // Lógica disparada após marcar/desmarcar, se necessário atualizar o estado global
    };

    return (
        <div className="table-container-fixed animated fadeIn" style={{ width: '100%', overflowX: 'auto' }}>
            <table className="match-table" style={{ 
                width: '100%', 
                tableLayout: 'fixed', 
                borderCollapse: 'collapse',
                minWidth: '800px' // Garante legibilidade em telas menores com scroll
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ width: '10%', textAlign: 'center', padding: '12px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Match</th>
                        <th style={{ width: '15%', textAlign: 'center', padding: '12px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Localidade</th> 
                        <th style={{ width: '35%', textAlign: 'left', padding: '12px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Descrição do Item</th>
                        <th style={{ width: '15%', textAlign: 'center', padding: '12px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Valor Total</th>
                        <th style={{ width: '13%', textAlign: 'center', padding: '12px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Encerramento</th> 
                        <th style={{ width: '12%', textAlign: 'center', padding: '12px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedMatches.map(m => (
                        <tr key={m.id} className="table-row" style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                            
                            {/* 1. MATCH (TAGS / PERFIL) */}
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                                    <span className="tag-badge-mini" style={{ backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                                        {m.termo_chave || 'Match'}
                                    </span>
                                </div>
                            </td>
                            
                            {/* 2. LOCALIDADE */}
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }} title={m.local}>
                                    <FiMapPin size={12} color="#94a3b8" /> {m.local || 'N/A'}
                                </div>
                            </td>
                            
                            {/* 3. DESCRIÇÃO (FOCO NA LEGIBILIDADE) */}
                            <td style={{ padding: '12px' }}>
                                <div style={{ marginBottom: '4px', fontSize: '0.65rem', color: '#3b82f6', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.025em' }}>
                                    {m.modalidade_codigo}
                                </div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    lineHeight: '1.4',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2', // Mantém a tabela organizada, mas o Modal mostrará tudo
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    color: '#1e293b',
                                    fontWeight: '500'
                                }} title={m.palavra_encontrada}>
                                    {m.palavra_encontrada}
                                </div>
                                <button 
                                    onClick={() => setModalItem(m)} 
                                    className="btn-details-link"
                                    style={{ 
                                        fontSize: '0.75rem', 
                                        color: '#2563eb', 
                                        background: 'none', 
                                        border: 'none', 
                                        padding: 0, 
                                        marginTop: '6px', 
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <FiInfo size={12}/> detalhes do item
                                </button>
                            </td>
                            
                            {/* 4. VALOR TOTAL (CALCULADO NO BACKEND) */}
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                <div style={{ fontWeight: '700', color: '#059669', fontSize: '0.95rem' }}>
                                    {formatCurrency(m.valor_total_item)}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Total Estimado</div>
                            </td>
                            
                            {/* 5. DATA DE ENCERRAMENTO */}
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '0.8rem' }}>
                                {m.data_encerramento ? (
                                    <div style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#fef2f2' }}>
                                        <div style={{ color: '#ef4444', fontWeight: 'bold' }}>
                                            {formatDate(m.data_encerramento)}
                                        </div>
                                    </div>
                                ) : (
                                    <span style={{ color: '#94a3b8' }}>-</span>
                                )}
                            </td>
                            
                            {/* 6. AÇÃO (ACOMPANHAMENTO) */}
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                <AdicionarAcompanhamentoButton 
                                    matchItem={m} 
                                    token={token}
                                    onAcompanhado={handleAcompanhado}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}