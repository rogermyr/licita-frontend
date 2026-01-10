// src/utils/userMenuItems.js (Opcional, mas recomendado para modularidade)

const USER_MENU_ITEMS = [
    { id: 'profile', label: 'Meu Perfil', path: '/perfil' },
    { id: 'billing', label: 'Faturamento', path: '/faturamento', applicable: true }, // Se aplicável
    { id: 'support', label: 'Ajuda e Suporte', path: '/suporte' },
    { id: 'separator', isSeparator: true },
    { id: 'logout', label: 'Sair' }
];

export default USER_MENU_ITEMS;