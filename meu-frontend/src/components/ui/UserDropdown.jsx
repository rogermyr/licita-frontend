// src/components/ui/UserDropdown.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser } from "react-icons/fi"; // Importamos o ícone aqui para agrupamento visual

const USER_MENU_ITEMS = [
    { id: 'profile', label: 'Meu Perfil', path: '/perfil' },
    { id: 'billing', label: 'Faturamento', path: '/faturamento', applicable: true }, 
    { id: 'support', label: 'Ajuda e Suporte', path: '/suporte' },
    { id: 'separator', isSeparator: true },
    { id: 'logout', label: 'Sair' }
];


// Adicionando onNavigate às props
export default function UserDropdown({ userName, api, onLogoutSuccess, onNavigate }) { // MODIFICADO
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Lógica para fechar o dropdown se o usuário clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout'); 
        } catch (error) {
            console.error("Erro ao fazer logout, mas forçando o cliente a sair:", error);
        } finally {
            if (onLogoutSuccess) {
                onLogoutSuccess();
            }
            navigate('/login');
        }
    };

    const handleItemClick = (item) => {
        setIsOpen(false);
        
        if (item.id === 'logout') {
            handleLogout();
        } else if (item.path) {
            // CRÍTICO: Usar onNavigate para mudar a aba dentro do Dashboard
            if (onNavigate) {
                onNavigate(item.path); // Manda o caminho para o Dashboard atualizar activeTab
            } else {
                // Fallback (se usado fora do Dashboard)
                navigate(item.path);
            }
        }
    }; // MODIFICADO

    // --- Estilos embutidos são mantidos ---
    const dropdownStyles = {
        position: 'absolute',
        top: '100%',
        right: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        border: '1px solid #e2e8f0', 
        borderRadius: '8px',       
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)', 
        minWidth: '180px',
        padding: '5px 0',
        marginTop: '5px' 
    };
    const itemStyles = {
        padding: '10px 15px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.1s'
    };
    const itemHoverStyles = {
        backgroundColor: '#f1f5f9' 
    };
    const separatorStyles = {
        height: '1px',
        backgroundColor: '#e2e8f0',
        margin: '5px 0'
    };
    const userButtonStyles = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: 0,
        fontWeight: '600',
        color: 'inherit',
    };

    return (
        <div 
            ref={dropdownRef} 
            style={{ position: 'relative', display: 'inline-block' }}
            aria-expanded={isOpen}
            className="user-info-dropdown-wrapper"
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={userButtonStyles}
                aria-haspopup="true"
                aria-controls="user-menu-list"
            >
                <span>{userName}</span>
                <div className="avatar"><FiUser /></div> 
            </button>
            
            {isOpen && (
                <ul id="user-menu-list" style={{ ...dropdownStyles, listStyle: 'none', margin: 0, padding: 0 }}>
                    {USER_MENU_ITEMS.map((item) => {
                        if (item.isSeparator) {
                            return <li key={item.id} style={separatorStyles} />;
                        }
                        
                        // Renderização condicional para "Faturamento"
                        if (item.id === 'billing' && !item.applicable) return null;

                        return (
                            <li 
                                key={item.id}
                                style={{ ...itemStyles, 
                                    color: item.id === 'logout' ? '#ef4444' : '#333'
                                }}
                                onClick={() => handleItemClick(item)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = itemHoverStyles.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                tabIndex={0}
                            >
                                {item.label}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}