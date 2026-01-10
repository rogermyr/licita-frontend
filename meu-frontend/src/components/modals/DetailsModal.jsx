// src/components/ui/DetailsModal.js
import React from 'react';
import { FiX, FiEye, FiExternalLink, FiInfo, FiDollarSign, FiCalendar, FiMapPin } from "react-icons/fi";
import { getModalidadeNome } from '../../utils/constants'; 

export default function DetailsModal({ modalItem, setModalItem }) {
    // Se não houver item para exibir, não renderiza nada
    if (!modalItem) return null;

    // --- FORMATAÇÕES (Helpers Internos) ---
    const formatCurrency = (value) => 
        value ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';
    
    const formatNumber = (value) => 
        value !== null && value !== undefined ? value.toLocaleString('pt-BR') : '0';
    
    const formatDate = (dateString) => 
        dateString ? new Date(dateString).toLocaleDateString('pt-BR') : 'N/A';

    // --- LÓGICA DE DADOS ---
    
    // MODIFICADO: Usamos o valor total que já vem calculado do Backend (SQL)
    // Isso evita o erro de (Valor Total * Quantidade) caso o unitário já fosse o total.
    const valorTotal = modalItem.valor_total_item || 0;
    
    // NOVO: Fallback para valor unitário caso o nome do campo mude
    const valorUnitario = modalItem.valor_unitario || modalItem.valor_estimado || 0;

    // MODIFICADO: Lógica de Modalidade. 
    // Tenta traduzir o código, se falhar (ou se já for um texto), usa o nome bruto do banco.
    const modalidadeDisplay = modalItem.modalidade_codigo || 'N/A';

    return (
        <div className="modal-overlay" onClick={() => setModalItem(null)}>
            <div className="modal-content animated zoomIn" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px', width: '95%', borderRadius: '12px' }}>
                
                {/* Header */}
                <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b' }}>
                        <FiEye size={20} color="#2563eb" /> Detalhes da Oportunidade
                    </h3>
                    <button onClick={() => setModalItem(null)} className="btn-close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <FiX size={24} />
                    </button>
                </div>

                <div className="modal-body" style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
                    
                    {/* Seção 1: Descrição do Item */}
                    <div className="detail-section" style={{ marginBottom: '25px' }}>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px', letterSpacing: '0.05em' }}>
                            <FiInfo style={{ marginRight: '5px' }} /> Item de Referência
                        </h4>
                        <p style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.1rem', lineHeight: '1.4' }}>
                            {modalItem.palavra_encontrada}
                        </p>
                        <div className="tags-container" style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>                            
                            {modalItem.termo_chave && (
                                <span className="tag-badge primary" style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #dbeafe' }}>
                                    <strong>{modalItem.termo_chave}</strong>
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Seção 2: Grid de Informações */}
                    <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                        
                        {/* Coluna Financeira */}
                        <div>
                            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                                <FiDollarSign style={{ marginRight: '5px' }} /> Dados Financeiros
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <p style={{ margin: 0 }}><strong>Quantidade:</strong> {formatNumber(modalItem.quantidade)}</p>
                                <p style={{ margin: 0 }}><strong>Valor Unitário:</strong> {formatCurrency(valorUnitario)}</p>
                                <div style={{ marginTop: '10px', padding: '12px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #d1fae5' }}>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#065f46', textTransform: 'uppercase' }}>Valor Total Estimado</span>
                                    <span style={{ fontWeight: '800', color: '#059669', fontSize: '1.4rem' }}>
                                        {formatCurrency(valorTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Coluna Licitação */}
                        <div>
                            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                                <FiCalendar style={{ marginRight: '5px' }} /> Detalhes do Edital
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                                <p style={{ margin: 0 }}><strong>Modalidade:</strong> {modalidadeDisplay}</p>
                                <p style={{ margin: 0 }}><strong>Local:</strong> <FiMapPin size={12}/> {modalItem.local || 'Não informado'}</p>
                                <p style={{ margin: 0 }}>
                                    <strong>Encerramento:</strong> 
                                    <span style={{ color: '#ef4444', fontWeight: '700', marginLeft: '5px' }}>
                                        {formatDate(modalItem.data_encerramento)}
                                    </span>
                                </p>
                                <div style={{ marginTop: '10px' }}>
                                    <strong>Objeto:</strong>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {modalItem.objeto_licitacao || 'Nenhum objeto detalhado.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="modal-footer" style={{ padding: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#ffffff', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                    <button className="btn-secondary" onClick={() => setModalItem(null)} style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                        Fechar
                    </button>
                    {modalItem.link_pncp && (
                        <a 
                            href={modalItem.link_pncp} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-primary" 
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', textDecoration: 'none', fontWeight: '600' }}
                        >
                            <FiExternalLink /> Acessar no PNCP
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}