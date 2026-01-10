// src/api/acompanhamento.js

import apiClient from '../services/api.js';

/**
 * Busca a lista de licitações acompanhadas com suporte à paginação.
 * 
 * @param {number} page - Número da página a ser buscada (começando em 1).
 * @param {number} pageSize - Número de itens por página (o limite).
 * @returns {Promise<Array>} Uma promessa que resolve para um array de acompanhamentos.
 */
export async function fetchAcompanhamentos(page, pageSize) {
    // Cálculo do offset (skip) baseado na página e no limite
    // O backend FastAPI geralmente usa 'skip' para o offset, começando em 0.
    const skip = (page - 1) * pageSize; 
    const limit = pageSize;

    const url = `/minhas/?skip=${skip}&limit=${limit}`;

    try {
        // Usa o apiClient que já inclui o token JWT automaticamente via interceptor
        const response = await apiClient.get(url);
        
        // Se o backend retornar {items: [], total: N}, ajuste aqui para retornar apenas items.
        // Assumindo que o backend retorna diretamente o array de acompanhamentos:
        return response.data; 

    } catch (error) {
        console.error("Erro na camada de API (fetchAcompanhamentos):", error);
        // Relança o erro para que a página AcompanhamentoPage possa capturá-lo
        throw new Error(error.message || "Erro desconhecido na comunicação com o servidor.");
    }
}