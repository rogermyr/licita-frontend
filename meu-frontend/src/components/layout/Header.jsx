// src/components/layout/Header.jsx

import React from 'react';
// Certifique-se que o UserDropdown está importado
import UserDropdown from '../ui/UserDropdown'; 

export default function Header({ activeTab, username, api, onLogoutSuccess }) {
    return (
        <header className="header-top">
            <div>
                <h2>{activeTab === 'perfis' ? 'Meus Perfis' : 'Monitoramento'}</h2>
            </div>
            
            <div className="user-info">
                {/* CRÍTICO: Substituir <span> e <div class="avatar"> pelo componente */}
                <UserDropdown 
                    userName={username} 
                    api={api} 
                    onLogoutSuccess={onLogoutSuccess} 
                />
            </div>
        </header>
    );
}