// src/hooks/useProfileManagement.js
import { useState, useCallback } from 'react';

// O hook recebe a instância singleton do Axios (api) e a função de recarregamento auxiliar (carregarUFs)
export const useProfileManagement = (api, carregarUFs) => {
    // ESTADOS DE DADOS
    const [perfis, setPerfis] = useState([]);
    
    // ESTADOS PARA CRUD DE PERFIL
    const [editingId, setEditingId] = useState(null);
    const [nome, setNome] = useState('');
    const [keys, setKeys] = useState('');
    const [negs, setNegs] = useState('');
    const [showProfileModal, setShowProfileModal] = useState(false);

    // FUNÇÕES DE GESTÃO DE MODAL
    // Usamos useCallback para que essas funções tenham referências estáveis
    const fecharModal = useCallback(() => {
        setEditingId(null);
        setShowProfileModal(false);
    }, []);

    const abrirModalCriacao = useCallback(() => {
        setEditingId(null); setNome(''); setKeys(''); setNegs('');
        setShowProfileModal(true);
    }, []);

    const iniciarEdicao = useCallback((p) => {
        setEditingId(p.id); setNome(p.nome_perfil);
        setKeys(p.palavras_chave); setNegs(p.palavras_negativas || '');
        setShowProfileModal(true);
    }, []);

    // FUNÇÕES DE CARREGAMENTO (AJUSTADO PARA CONFIAR NO FLUXO DE DASHBOARD)
    const carregarPerfis = useCallback(async () => {
        // NOTA: O Dashboard garante que só chamamos esta função se o token estiver no estado.
        // A checagem de localStorage foi removida para evitar bloqueios de race condition.
        
        // Opcional: Limpa a lista para feedback visual enquanto carrega.
        setPerfis([]); 

        try {
            const res = await api.get('/perfis');
            setPerfis(res.data);
        } catch (e) {
            console.error("Erro ao carregar perfis:", e);
            // O interceptor do Axios lidará com o 401.
        }
    }, [api]); // Dependência em api

    
    // FUNÇÕES DE CRUD
    const salvarPerfil = useCallback(async () => {
        if (!nome || !keys) return alert("Preencha nome e palavras-chave!");
        
        // Limpeza de entrada antes de enviar para o backend
        const trimmedKeys = keys.trim();
        const trimmedNegs = negs ? negs.trim() : '';
        
        // Validação de segurança básica: garantir que a nova senha é forte, se necessário
        // (Embora isso seja mais relevante para a troca de senha, mantemos o princípio de validação)

        const dados = { 
            nome_perfil: nome, 
            palavras_chave: trimmedKeys, 
            palavras_negativas: trimmedNegs 
        };

        try {
            if (editingId) {
                await api.put(`/perfis/${editingId}`, dados);
                alert("Perfil atualizado!");
            }
            else {
                await api.post('/perfis', dados);
                alert("Novo perfil criado!");
            }
            fecharModal();
            carregarPerfis();
        } catch (e) { 
            // Tratamento de erro detalhado
            alert("Erro ao salvar perfil: " + (e.response?.data?.detail || e.message));
        }
    }, [nome, keys, negs, editingId, api, carregarPerfis, fecharModal]);

    const excluirPerfil = useCallback(async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este perfil?")) {
            try {
                await api.delete(`/perfis/${id}`);
                
                // Recarrega dados após exclusão
                carregarPerfis();
                carregarUFs(); // Recarrega UFs, pois a exclusão pode afetar filtros ou contagens.
            } catch (e) {
                alert("Erro ao excluir perfil: " + (e.response?.data?.detail || e.message));
            }
        }
    }, [api, carregarPerfis, carregarUFs]); // Dependências ajustadas

    return {
        // Dados
        perfis, setPerfis,

        // Estado do Modal
        showProfileModal, fecharModal,

        // Campos do formulário CRUD
        nome, setNome, keys, setKeys, negs, setNegs, editingId,

        // Funções
        carregarPerfis, salvarPerfil, excluirPerfil,
        abrirModalCriacao, iniciarEdicao,
    };
};