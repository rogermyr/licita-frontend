// src/components/ui/LoadingSpinner.jsx
import React from 'react';

export default function LoadingSpinner({ text }) {
    return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#007bff' }}>
            {/* Ícone de loading básico ou um texto */}
            <div className="spinner-border" role="status">
                <span className="sr-only">Carregando...</span>
            </div>
            <p style={{ marginTop: '10px' }}>{text || "Aguarde..."}</p>
        </div>
    );
}