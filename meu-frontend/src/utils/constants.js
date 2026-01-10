// Objeto constante para mapear códigos e nomes das modalidades
export const MODALIDADES_CATEGORIZADAS = {
    'Competitiva': {
        icon: '🥇',
        modals: {
            6: "Pregão - Eletrônico",
            7: "Pregão - Presencial",
            4: "Concorrência - Eletrônica",
            5: "Concorrência - Presencial",
            1: "Leilão Eletrônico",
            13: "Leilão - Presencial",
            3: "Concurso"
        }
    },
    'Consultiva': {
        icon: '💡',
        modals: {
            2: "Diálogo Competitivo",
            11: "Pré-qualificação",
            10: "Manifestação de Interesse",
            15: "Chamada pública",
            12: "Credenciamento"
        }
    },
    'Contratação Direta': {
        icon: '⛔',
        modals: {
            8: "Dispensa",
            9: "Inexigibilidade",
            14: "Inaplicabilidade da Licitação"
        }
    }
};

// Lista plana para popular o ComboBox na interface
export const MODALIDADES_DISPONIVEIS = {};
Object.values(MODALIDADES_CATEGORIZADAS).forEach(category => {
    Object.assign(MODALIDADES_DISPONIVEIS, category.modals);
});

// Função auxiliar para obter o nome da modalidade com base no código
export const getModalidadeNome = (codigo) => {
    const codigoString = String(codigo); 
    const nome = MODALIDADES_DISPONIVEIS[codigoString];
    
    if (nome) {
        const categoria = Object.values(MODALIDADES_CATEGORIZADAS).find(cat => cat.modals[codigoString]);
        const icon = categoria ? categoria.icon : '📄';
        return `${icon} ${nome}`;
    }
    return 'Modalidade Desconhecida';
}