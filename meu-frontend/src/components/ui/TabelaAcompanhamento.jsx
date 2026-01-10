// src/components/acompanhamento/TabelaAcompanhamento.jsx
import React from 'react';
import { FiExternalLink, FiTrash2, FiMapPin } from 'react-icons/fi';

// Função utilitária para formatar a data
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (e) {
        return dateString;
    }
};

// Função para formatar moeda
const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return 'R$ 0,00';
    return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function TabelaAcompanhamento({ dados, onRemove }) { 
    if (!dados || dados.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                <p>Nenhum item em acompanhamento encontrado.</p>
            </div>
        );
    }
    
    return (
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="match-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        {/* MODIFICADO: Coluna ID removida */}
                        <th style={{ padding: '12px', textAlign: 'left' }}>Item / Objeto da Licitação</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Localidade</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Fechamento</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Valor Total</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Salvo em</th>
                        <th style={{ padding: '12px', textAlign: 'center', width: '100px' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="hover-row">
                            
                            {/* 1. DESCRIÇÃO COM LINK PNCP */}
                            <td style={{ padding: '12px', minWidth: '300px' }}>
                                <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    {item.modalidade_codigo || 'Licitação'}
                                </div>
                                <a 
                                    href={item.link_pncp || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{ 
                                        color: '#1e293b', 
                                        textDecoration: 'none', 
                                        fontWeight: '600',
                                        display: 'block',
                                        lineHeight: '1.4'
                                    }} 
                                    title="Clique para abrir no PNCP"
                                >
                                    <span style={{ borderBottom: '1px dashed #cbd5e1' }}>
                                        {item.palavra_encontrada || item.objeto_licitacao || 'Descrição Indisponível'}
                                        <FiExternalLink size={12} style={{ marginLeft: '6px', color: '#94a3b8' }} />
                                    </span>
                                </a>
                            </td>

                            {/* 2. LOCALIDADE */}
                            <td style={{ padding: '12px', textAlign: 'left', color: '#475569' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <FiMapPin size={12} style={{ color: '#94a3b8' }} />
                                    {item.local || '-'}
                                </div>
                            </td>

                            {/* 3. DATA ENCERRAMENTO */}
                            <td style={{ padding: '12px', textAlign: 'center', color: '#ef4444', fontWeight: '600' }}>
                                {formatDate(item.data_match || item.data_encerramento)}
                            </td>

                            {/* 4. VALOR TOTAL (SINCRONIZADO) */}
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: '#059669' }}>
                                {formatCurrency(item.valor_total_item || item.valor_total_estimado)}
                            </td>

                            {/* 5. DATA EM QUE FOI SALVO */}
                            <td style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '0.75rem' }}>
                                {formatDate(item.data_acompanhamento)}
                            </td>

                            {/* 6. AÇÕES */}
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                <button 
                                    onClick={() => onRemove(item.id)} 
                                    style={{ 
                                        padding: '8px', 
                                        backgroundColor: 'transparent', 
                                        color: '#ef4444', 
                                        border: '1px solid #fee2e2', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        transition: 'all 0.2s'
                                    }}
                                    title="Remover Acompanhamento"
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}