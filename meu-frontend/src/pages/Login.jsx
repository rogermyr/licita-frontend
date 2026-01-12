// src/pages/Login.jsx (Refinamentos UX/UI - Conteúdo COMPLETO)

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    FiUser, FiLock, FiArrowRight, FiMail, 
    FiPhone, FiCreditCard, FiBriefcase 
} from "react-icons/fi";
import { BsBuildingsFill } from "react-icons/bs";
import '../App.css'; 

// MODIFICADO: Recebe tokenStorageKey como prop
function Login({ setToken, tokenStorageKey }) {
    
    // --- ESTADOS DO FORMULÁRIO ---
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [nomeCompleto, setNomeCompleto] = useState(''); 
    const [telefone, setTelefone] = useState('');         
    const [cpf, setCpf] = useState('');                   
    const [cargo, setCargo] = useState('');               
    
    // --- ESTADOS DE UI ---
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // --- UTILS DE FORMATO (MELHORIA UX) ---
    const formatCpf = (value) => {
        value = value.replace(/\D/g, ''); 
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return value.substring(0, 14);
    };

    const formatPhone = (value) => {
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

    const handleCpfChange = (e) => { setCpf(formatCpf(e.target.value)); };
    const handleTelefoneChange = (e) => { setTelefone(formatPhone(e.target.value)); };
    // --- FIM UTILS ---


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        if (isRegistering) {
            // Lógica de Cadastro
            const registrationPayload = {
                email: email, 
                password: password,
                nome_completo: nomeCompleto,
                telefone: telefone.replace(/\D/g, ''),
                cpf: cpf.replace(/\D/g, ''),
                cargo: cargo
            };

            try {
                await axios.post(`${baseUrl}/registrar`, registrationPayload); 
                alert('Conta criada! Faça login com seu e-mail e senha.');
                
                setNomeCompleto('');
                setTelefone('');
                setCpf('');
                setCargo('');
                setIsRegistering(false);

            } catch (error) {
                console.error("Erro no registro:", error);
                alert(error.response?.data?.detail || 'Erro ao criar conta. Verifique os dados.');
            } finally {
                setLoading(false);
            }
        } else {
            // Lógica de Login (Token OAuth2)
            const formData = new FormData();
            formData.append('username', email); 
            formData.append('password', password);
            
            try {
                const res = await axios.post(`${baseUrl}/token`, formData);
                const t = res.data.access_token;
                
                // 1. PERSISTÊNCIA E CORREÇÃO DA CHAVE
                // MODIFICADO: Usamos a chave correta (access_token)
                localStorage.setItem(tokenStorageKey, t); 
                
                // 2. CORREÇÃO DE RACE CONDITION (ADICIONANDO DELAY)
                // NOVO: Espera 100ms para garantir que o LocalStorage foi persistido 
                // antes que o Dashboard (e o Interceptor) disparem a leitura.
                console.log("Token salvo localmente. Aguardando 100ms para sincronização...");
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // 3. ATUALIZA ESTADO (Dispara o render do Dashboard)
                setToken(t);
                
                // Navegação é tratada pelo App.jsx devido à mudança de estado do token
                // Não é necessário chamar navigate('/dashboard') explicitamente

            } catch (error) {
                alert('Credenciais inválidas');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="login-wrapper">
            {/* ... (Restante da UI permanece igual) ... */}
            <div className="login-brand">
                <div className="brand-content">
                    <h1><BsBuildingsFill /> Licitou</h1>
                    <p>Plataforma inteligente de monitoramento de licitações públicas.</p>
                </div>
                <div className="brand-overlay"></div>
            </div>
            
            <div className="login-form-container">
                <div className="form-box" style={{ maxWidth: isRegistering ? '500px' : '400px', transition: 'max-width 0.3s ease-in-out' }}> 
                    <div className="form-header">
                        <h2>{isRegistering ? 'Criar Nova Conta' : 'Bem-vindo'}</h2>
                        <p>{isRegistering ? 'Preencha seus dados para acesso completo.' : 'Faça login com seu e-mail e senha.'}</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        
                        {/* CAMPOS EXTRAS DE REGISTRO */}
                        {isRegistering && (
                            <>
                                {/* NOME COMPLETO */}
                                <div className="input-group">
                                    <FiUser className="input-icon" />
                                    <input 
                                        type="text" 
                                        placeholder="Nome Completo" 
                                        value={nomeCompleto} 
                                        onChange={e => setNomeCompleto(e.target.value)} 
                                        required 
                                        aria-label="Nome Completo"
                                    />
                                </div>
                                
                                {/* CPF (COM MÁSCARA UX) */}
                                <div className="input-group">
                                    <FiCreditCard className="input-icon" />
                                    <input 
                                        type="text" 
                                        placeholder="CPF" 
                                        value={cpf} 
                                        onChange={handleCpfChange} 
                                        maxLength={14} 
                                        required 
                                        aria-label="CPF"
                                    />
                                </div>
                                
                                {/* TELEFONE (COM MÁSCARA UX) */}
                                <div className="input-group">
                                    <FiPhone className="input-icon" />
                                    <input 
                                        type="tel" 
                                        placeholder="Telefone (DDD + Número)" 
                                        value={telefone} 
                                        onChange={handleTelefoneChange} 
                                        maxLength={15} 
                                        required 
                                        aria-label="Telefone"
                                    />
                                </div>
                                
                                {/* CARGO/FUNÇÃO */}
                                <div className="input-group">
                                    <FiBriefcase className="input-icon" />
                                    <input 
                                        type="text" 
                                        placeholder="Cargo/Função (Ex: Analista de Licitações)" 
                                        value={cargo} 
                                        onChange={e => setCargo(e.target.value)} 
                                        required 
                                        aria-label="Cargo/Função"
                                    />
                                </div>
                            </>
                        )}
                        
                        {/* CAMPO DE E-MAIL (LOGIN) */}
                        <div className="input-group">
                            <FiMail className="input-icon" />
                            <input 
                                type="email" 
                                placeholder="E-mail"
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                                aria-label="E-mail"
                            />
                        </div>
                        
                        {/* CAMPO DE SENHA */}
                        <div className="input-group">
                            <FiLock className="input-icon" />
                            <input 
                                type="password" 
                                placeholder="Senha" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                                aria-label="Senha"
                            />
                        </div>
                        
                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'Processando...' : (isRegistering ? 'Cadastrar Conta' : 'Entrar')} 
                            <FiArrowRight />
                        </button>

                    </form>
                    <div className="form-footer">
                        <p>
                            {isRegistering ? 'Já possui uma conta?' : 'Não possui uma conta?'} 
                            <span onClick={() => { 
                                setIsRegistering(!isRegistering);
                                setPassword(''); 
                            }}>
                                {isRegistering ? 'Fazer Login' : 'Cadastre-se'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
