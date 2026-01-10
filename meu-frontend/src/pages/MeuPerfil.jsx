import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FiSave, FiAlertTriangle, FiMail, FiCreditCard } from 'react-icons/fi'; // NOVO: Ícone para CPF

export default function MeuPerfil({ api }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // --- UTILS DE FORMATO (MELHORIA UX) ---
    // Funções mantidas, garantindo que funcionam com valor bruto ou parcialmente formatado
    const formatCpf = (value) => {
        if (!value) return '';
        value = value.replace(/\D/g, ''); 
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return value.substring(0, 14);
    };

    const formatPhone = (value) => {
        if (!value) return '';
        value = value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d{0,2})$/, '($1');
        }
        return value.substring(0, 15);
    };
    
    // Função para limpar valor (para envio à API) - MODIFICADO para limpar apenas
    const cleanValue = (value) => {
        if (!value) return '';
        // Retorna apenas dígitos
        return value.replace(/\D/g, '');
    };
    // --- FIM UTILS ---

    const loadUserProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/users/eu');
            
            // CRÍTICO: Aplica formatação aos dados recebidos antes de salvar no estado
            const userData = response.data;
            console.log("Dados do usuário carregados:", userData);
            const loadedUser = {
                ...userData,
                // Aplicamos a formatação completa ao valor BRUTO vindo do DB
                cpf: formatCpf(userData.cpf || ''),
                telefone: formatPhone(userData.telefone || '')
            };
            setUser(loadedUser); // Salva o estado já formatado
            
        } catch (err) {
            console.error("Erro ao carregar perfil:", err);
            setError("Não foi possível carregar os dados do perfil.");
        } finally {
            setIsLoading(false);
        }
    }, [api]); 

    useEffect(() => {
        loadUserProfile();
    }, [loadUserProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // MODIFICADO: Ignora a mudança se o campo for CPF, garantindo que o estado não mude
        // embora o readOnly no input já previna isso no navegador.
        if (name === 'cpf') {
            return; 
        }

        let formattedValue = value;
        if (name === 'telefone') {
            // Aplica a formatação na DIGITAÇÃO
            formattedValue = formatPhone(value);
        }
        
        setUser(prev => ({ ...prev, [name]: formattedValue }));
        setSuccess(false); 
        setError(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        setError(null);
        
        // CRÍTICO: Limpar a formatação antes de enviar para o backend
        const updatePayload = {
            nome_completo: user.nome_completo,
            // Usamos cleanValue para garantir que apenas dígitos sejam enviados
            telefone: cleanValue(user.telefone), 
            cpf: cleanValue(user.cpf), // O CPF é enviado limpo, mesmo sendo read-only
            cargo: user.cargo,
        };

        try {
            await api.put('/users/eu', updatePayload);
            setSuccess(true);
            // Re-carregar após salvar (para garantir que a formatação seja consistente)
            loadUserProfile(); 
            setTimeout(() => setSuccess(false), 3000); 
        } catch (err) {
            console.error("Erro ao salvar perfil:", err);
            const detail = err.response?.data?.detail || "Falha ao salvar. Tente novamente.";
            setError(detail);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Carregando perfil..." />;
    }

    if (error && !user) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="perfil-container card">
            <h1>Meu Perfil</h1>
            <p style={{ color: '#64748b' }}>Revise e atualize suas informações pessoais e de contato.</p>
            
            {/* Seção de Status e Feedback */}
            <div style={{ marginBottom: '20px' }}>
                {error && (
                    <div className="alert-error" style={{ color: '#991b1b', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiAlertTriangle /> <span>Erro: {error}</span>
                    </div>
                )}
                {success && (
                    <div className="alert-success" style={{ color: '#065f46', backgroundColor: '#d1fae5', padding: '10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiSave /> <span>Perfil atualizado com sucesso!</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSave}>
                
                {/* LINHA 1: NOME COMPLETO (Full Width) */}
                <div className="form-group">
                    <label>Nome Completo</label>
                    <input type="text" name="nome_completo" value={user.nome_completo || ''} onChange={handleInputChange} required />
                </div>
                
                {/* LINHA 2: E-MAIL (Chave de Login - Read-Only) */}
                <div className="form-group">
                    <label>E-mail (Chave de Acesso)</label>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px' }}>
                        <FiMail style={{ color: '#64748b', marginRight: '10px' }} />
                        <span style={{ fontWeight: '500', color: '#1e293b' }}>{user.username}</span>
                    </div>
                    <small style={{ color: '#64748b', marginTop: '5px' }}>Este campo não pode ser alterado.</small>
                </div>

                {/* LINHA 3: CPF, TELEFONE, CARGO (Grid 3 colunas) */}
                <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    
                    {/* CPF (Com máscara UX) - AGORA READ-ONLY */}
                    <div className="form-group" style={{ margin: 0 }}>
                        <label>CPF</label>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px' }}>
                            <FiCreditCard style={{ color: '#64748b', marginRight: '10px' }} />
                            <span style={{ fontWeight: '500', color: '#1e293b' }}>{user.cpf}</span>
                        </div>
                        <small style={{ color: '#64748b', marginTop: '5px' }}>O CPF é usado como identificador primário e não pode ser alterado.</small>
                    </div>
                    
                    {/* TELEFONE (Com máscara UX) */}
                    <div className="form-group" style={{ margin: 0 }}>
                        <label>Telefone</label>
                        <input 
                            type="tel" 
                            name="telefone" 
                            value={user.telefone || ''} 
                            onChange={handleInputChange} 
                            maxLength={15} 
                            required 
                        />
                    </div>
                    
                    {/* CARGO */}
                    <div className="form-group" style={{ margin: 0 }}>
                        <label>Cargo/Função</label>
                        <input 
                            type="text" 
                            name="cargo" 
                            value={user.cargo || ''} 
                            onChange={handleInputChange} 
                        />
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', textAlign: 'right' }}>
                    <button type="submit" className="btn-primary" disabled={isSaving} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <FiSave />
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
            
            {/* Opção para Alterar Senha - Destacada */}
            <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #fecaca', borderRadius: '8px', backgroundColor: '#fff7ed' }}>
                 <p style={{ margin: 0, fontWeight: '600' }}>Para alterar sua senha, use a opção dedicada no menu de segurança.</p>
                 <button className="btn-secondary" style={{ marginTop: '10px' }} disabled>
                     Alterar Senha (Em breve)
                 </button>
            </div>
        </div>
    );
}