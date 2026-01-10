// src/components/ui/Paginacao.jsx
import React from 'react';

export default function Paginacao({ currentPage, hasNextPage, onPageChange }) {
    const handleNext = () => onPageChange(currentPage + 1);
    const handlePrev = () => onPageChange(currentPage - 1);

    const hasPrevPage = currentPage > 1;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <button 
                onClick={handlePrev} 
                disabled={!hasPrevPage} 
                className="btn-secondary"
            >
                &larr; Anterior
            </button>
            <span style={{ padding: '8px 15px', border: '1px solid #ccc', borderRadius: '4px' }}>
                Página {currentPage}
            </span>
            <button 
                onClick={handleNext} 
                disabled={!hasNextPage} 
                className="btn-secondary"
            >
                Próxima &rarr;
            </button>
        </div>
    );
}