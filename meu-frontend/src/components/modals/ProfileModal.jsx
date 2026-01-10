// src/components/ProfileModal.jsx

import { FiX, FiEdit, FiPlus, FiInfo } from "react-icons/fi";
import TagInput from '../TagInput'; 

export default function ProfileModal({ 
    showProfileModal, fecharModal, editingId, 
    nome, setNome, keys, setKeys, negs, setNegs, salvarPerfil 
}) {
    if (!showProfileModal) return null;

    // As contagens agora são apenas informativas, o TagInput lida com o limite
    const countKeys = keys.split(',').filter(k => k.trim() !== '').length;
    // const countNegs = negs.split(',').filter(n => n.trim() !== '').length; 
    
    // MODIFICADO: Aumentado o limite de 5 para 10 termos conforme requisito
    const MAX_TAGS = 20;

    return (
        <div className="modal-overlay" onClick={fecharModal}>
            {/* MODIFICADO: Adicionado overflowY no modal-content para garantir que com 10 tags o modal seja rolável em telas pequenas */}
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '500px', width: '95%', maxHeight: '90vh', overflowY: 'auto'}}>
                
                <div className="modal-header">
                    <h3>{editingId ? <FiEdit/> : <FiPlus/>} {editingId ? 'Editar Perfil' : 'Novo Perfil'}</h3>
                    <button onClick={fecharModal} className="btn-close"><FiX /></button>
                </div>
                
                <div className="modal-body">
                    <div className="form-group">
                        <label>Nome do Perfil</label>
                        <input 
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                            placeholder="Ex: Serviços TI" 
                            className="form-control"
                        />
                    </div>
                    
                    {/* TagInput para Palavras-Chave */}
                    <TagInput
                        label={
                            <>
                                Palavras-Chave ({countKeys}/{MAX_TAGS})
                                <FiInfo title="Termos que DEVEM aparecer na licitação. Ex: servidor, cloud, suporte" className="tooltip-icon" />
                            </>
                        }
                        limit={MAX_TAGS} // MODIFICADO: Agora passa 10
                        initialValue={keys}
                        onChange={setKeys} 
                        className="primary"
                    />

                    {/* TagInput para Palavras Negativas */}
                    <TagInput
                        label={
                            <>
                                Palavras Negativas 
                                <FiInfo title="Termos que DEVEM EXCLUIR a licitação. Ex: obras, limpeza, predial" className="tooltip-icon" />
                            </>
                        }
                        limit={MAX_TAGS} // MODIFICADO: Agora passa 10
                        initialValue={negs}
                        onChange={setNegs} 
                        className="neg"
                    />

                </div>
                
                <div className="modal-footer" style={{justifyContent: 'flex-end', gap: '10px', marginTop: '10px'}}>
                    <button onClick={fecharModal} className="btn-secondary">Cancelar</button>
                    {/* Validação: Nome obrigatório e pelo menos 1 palavra-chave */}
                    <button className="btn-primary" onClick={salvarPerfil} disabled={!nome || countKeys === 0}>
                        {editingId ? 'Atualizar Perfil' : 'Salvar Novo Perfil'}
                    </button>
                </div>
            </div>
        </div>
    );
}