// src/pages/GerenciarPerfis.jsx

import React from 'react';
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

// Recebe apenas as props necessárias do Layout
export default function GerenciarPerfis({ perfis, abrirModalCriacao, iniciarEdicao, excluirPerfil }) {
    return (
        <div className="grid-layout" style={{gridTemplateColumns: '1fr', gap: '20px'}}>
            <div className="card" style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '-10px'}}>
                <button onClick={abrirModalCriacao} className="btn-primary"><FiPlus /> Novo Perfil</button>
            </div>
            
            <div className="card">
                <h3>Perfis Ativos ({perfis.length})</h3>
                <div className="profile-grid-container"> 
                    {perfis.length === 0 ? (
                        <p style={{textAlign: 'center', color: '#64748b'}}>Nenhum perfil cadastrado. Clique em "Novo Perfil" para começar a monitorar!</p>
                    ) : (
                        perfis.map(p => (
                            <div key={p.id} className="profile-card">
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                    <strong>{p.nome_perfil}</strong>
                                    <div style={{display:'flex', gap:'5px'}}>
                                        <button onClick={() => iniciarEdicao(p)} className="btn-action edit" title="Editar"><FiEdit /></button>
                                        <button onClick={() => excluirPerfil(p.id)} className="btn-action delete" title="Excluir"><FiTrash2 /></button>
                                    </div>
                                </div>
                                <div className="tags-container" style={{marginTop:'8px', display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                                    {p.palavras_chave.split(',').filter(k => k.trim() !== '').map((k,i)=><span key={i} className="tag-badge primary">{k.trim()}</span>)}
                                    {p.palavras_negativas && p.palavras_negativas.split(',').filter(n => n.trim() !== '').map((n,i)=><span key={`neg-${i}`} className="tag-badge neg">{n.trim()}</span>)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}