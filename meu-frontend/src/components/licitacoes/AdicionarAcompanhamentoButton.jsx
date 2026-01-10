// AdicionarAcompanhamentoButton.jsx (Refatorado para importar a API)

import React, { useState } from 'react';
import axios from 'axios'; 
// *** ALTERAÇÃO AQUI: Importa a instância centralizada da API ***
import api from '../../services/api'; // Ajuste o caminho conforme sua estrutura real

import { FiPlus, FiCheck } from 'react-icons/fi';

const TOGGLE_ENDPOINT = '/acompanhamento/toggle'; 

/**
 * Componente de botão para adicionar/remover uma licitação para acompanhamento interno.
 * @param {object} matchItem - O objeto MatchResponse completo.
 * @param {string} token - O token JWT do usuário.
 * @param {function} onAcompanhado - Callback para ser executado após sucesso.
 */
export default function AdicionarAcompanhamentoButton({ 
    matchItem, 
    token, 
    onAcompanhado,
}) {    
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    
    // *** USO AQUI: Cria a instância da API logo no componente ***
    // (O ideal seria criar esta instância uma única vez fora, mas esta abordagem funciona)

    const handleToggleAcompanhar = async () => {
        if (status === 'loading') return;

        setStatus('loading');
        
        const payload = {
            item_id: matchItem.id, 
            acompanhar: true 
        };

        try {
            await api.post(TOGGLE_ENDPOINT, payload);
            setStatus('success');
            alert(`Item ID ${matchItem.id} adicionado para acompanhamento!`);
            
            if (onAcompanhado) onAcompanhado(matchItem.id, true); 

        } catch (error) {
            setStatus('error');
            const status_code = error.response?.status;
            const detail = error.response?.data?.detail;

            // Tratamento do erro 401 (Unauthorized)
            if (status_code === 401) {
                alert('Sessão expirada ou não autorizada. Por favor, faça login novamente.');
                // Você deve adicionar aqui a lógica para deslogar ou redirecionar o usuário
            } else if (status_code === 400) {
                alert(`Erro de Requisição (400): ${detail || 'Item não encontrado ou falha no DB.'}`);
            } else {
                alert(`Erro no servidor: ${detail || 'Falha ao conectar ao serviço de acompanhamento.'}`);
            }
        }
    };

    // ... (restante do código JSX e estilos) ...
    const isProcessing = status === 'loading';
    const isSuccess = status === 'success';

    const baseStyle = {
        padding: '5px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        cursor: isProcessing || isSuccess ? 'not-allowed' : 'pointer',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'background-color 0.2s',
        whiteSpace: 'nowrap'
    };

    if (isSuccess) {
        return <button style={{ ...baseStyle, backgroundColor: '#10b981', color: 'white' }} disabled><FiCheck /> Acompanhado</button>;
    }
    
    return (
        <button 
            onClick={handleToggleAcompanhar}
            disabled={isProcessing}
            title="Adicionar esta licitação à sua lista de acompanhamento interno"
            style={{ ...baseStyle, backgroundColor: isProcessing ? '#9ca3af' : '#2563eb', color: 'white' }}
        >
            {isProcessing ? 'Processando...' : <><FiPlus size={14} /> Acompanhar</>}
        </button>
    );
}