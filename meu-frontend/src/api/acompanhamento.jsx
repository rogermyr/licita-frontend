// src/api/acompanhamento.js


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

    const url = `${API_BASE_URL}/minhas/?skip=${skip}&limit=${limit}`;

    try {
        // Observação: Em uma aplicação real, você deve incluir 
        // o token JWT nos headers para autenticação.
        // const token = localStorage.getItem('accessToken');
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Exemplo de inclusão de token:
                // Authorization: `Bearer ${token}`, 
            },
        });

        // Tratamento de erros HTTP (4xx, 5xx)
        if (!response.ok) {
            // Tenta ler a mensagem de erro do backend, se disponível
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.detail || `Erro HTTP ${response.status}: Falha ao buscar dados.`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Se o backend retornar {items: [], total: N}, ajuste aqui para retornar apenas items.
        // Assumindo que o backend retorna diretamente o array de acompanhamentos:
        return data; 

    } catch (error) {
        console.error("Erro na camada de API (fetchAcompanhamentos):", error);
        // Relança o erro para que a página AcompanhamentoPage possa capturá-lo
        throw new Error(error.message || "Erro desconhecido na comunicação com o servidor.");
    }
}