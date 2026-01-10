// src/pages/Acompanhamento.jsx

import React, { useState, useEffect, useCallback } from 'react';
import TabelaAcompanhamento from '../components/ui/TabelaAcompanhamento'; 
import Paginacao from '../components/ui/Paginacao'; 
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ITENS_POR_PAGINA = 50; 

function AcompanhamentoPage({ api }) { 
    const [acompanhamentos, setAcompanhamentos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0); 

    const carregarDados = useCallback(async (page) => {
        if (!api) return; 

        setIsLoading(true);
        setError(null);
        
        const skip = (page - 1) * ITENS_POR_PAGINA;
        
        try {
            const res = await api.get('/acompanhamento/', {
                params: {
                    skip: skip,
                    limit: ITENS_POR_PAGINA,
                    sort_by: 'data_encerramento', 
                    order: 'asc'                 
                }
            });

            // MODIFICADO: Lógica simplificada. 
            // Os dados agora vêm prontos do Backend (SQL Raw + Processor).
            const dadosProcessados = res.data.map(item => {
                return {
                    ...item,
                    // O campo valor_total_item vem do backend. 
                    // Mapeamos para valor_total_estimado se a TabelaAcompanhamento ainda usar o nome antigo.
                    valor_total_estimado: item.valor_total_item || 0,
                    // Garantimos que campos como local e descrição estejam presentes
                    local: item.local || 'N/A',
                    palavra_encontrada: item.palavra_encontrada || item.descricao
                };
            });

            setAcompanhamentos(dadosProcessados); 
            
            // Tenta obter o total real do header (se configurado no backend) ou usa o tamanho da lista
            const totalCount = res.headers['x-total-count'];
            setTotalItems(totalCount ? parseInt(totalCount) : dadosProcessados.length);

        } catch (err) {
            console.error("Falha ao carregar acompanhamentos:", err); 
            setError(err.response?.data?.detail || "Não foi possível carregar as licitações acompanhadas.");
        } finally {
            setIsLoading(false);
        }
    }, [api]); 

    const handleRemoveAcompanhamento = async (itemId) => {
        if (!window.confirm("Tem certeza que deseja remover este item do acompanhamento?")) {
            return; 
        }
        
        try {
            // MODIFICADO: Garantir que a URL e o payload batam com o backend
            await api.post('/acompanhamento/toggle/', {
                item_id: itemId,
                acompanhar: false 
            });

            // Recarregar os dados após a remoção
            carregarDados(currentPage); 

        } catch (err) {
            console.error("Falha ao remover acompanhamento:", err);
            alert(err.response?.data?.detail || "Erro ao remover item.");
        }
    };

    useEffect(() => {
        carregarDados(currentPage);
    }, [currentPage, carregarDados]); 

    const handlePageChange = (newPage) => {
        if (!isLoading) {
            setCurrentPage(newPage);
        }
    };
    
    // Lógica de Paginação
    const totalPages = Math.ceil(totalItems / ITENS_POR_PAGINA);
    const hasNextPageSimulado = acompanhamentos.length === ITENS_POR_PAGINA; 


    if (isLoading) {
        return <LoadingSpinner text="Carregando suas licitações..." />;
    }

    if (error) {
        return (
            <div className="error-container" style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                <h3>Erro de Carregamento</h3>
                <p>{error}</p>
                <button className="btn-primary" onClick={() => carregarDados(currentPage)}>Tentar Novamente</button>
            </div>
        );
    }
    
    // MODIFICADO: Mensagem amigável com nota sobre validade
    if (acompanhamentos.length === 0 && currentPage === 1) {
        return (
            <div className="info-message" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                <p style={{ fontSize: '1.2rem' }}>Você não está acompanhando nenhuma licitação ainda.</p>
                <p style={{ fontSize: '0.9rem' }}>Vá para a página de Oportunidades e clique na estrela para salvar itens aqui.</p>
            </div>
        );
    }

    return (
        <div className="acompanhamento-container animated fadeIn" style={{ padding: '20px' }}>
            <div className="page-header" style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#1e293b' }}>Minhas Licitações em Acompanhamento</h1>
                <p style={{ color: '#64748b' }}>Gerencie os itens que você marcou para monitorar.</p>
            </div>
            
            <div className="results-card card shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
                <TabelaAcompanhamento 
                    dados={acompanhamentos} 
                    onRemove={handleRemoveAcompanhamento} 
                />
            </div>
            
            <div className="pagination-wrapper" style={{ marginTop: '20px' }}>
                <Paginacao 
                    currentPage={currentPage}
                    hasNextPage={totalPages > 0 ? currentPage < totalPages : hasNextPageSimulado} 
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default AcompanhamentoPage;