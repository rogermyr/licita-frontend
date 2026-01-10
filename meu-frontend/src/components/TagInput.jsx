// src/components/TagInput.jsx

import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

/**
 * Componente de entrada para tags/tokens com limite de palavras.
 * 
 * @param {string} label - O rótulo do campo.
 * @param {number} limit - O número máximo de tags permitidas (ex: 5).
 * @param {string} initialValue - O valor inicial (string separada por vírgulas).
 * @param {function} onChange - Callback para retornar o valor atualizado (string separada por vírgulas).
 * @param {string} className - Classe CSS adicional para o contêiner (ex: 'primary' ou 'negativo').
 */
export default function TagInput({ label, limit, initialValue = '', onChange, className = 'primary' }) {
    // Estado que armazena as tags como um array
    const [tags, setTags] = useState([]);
    // Estado para o valor digitado atualmente no input
    const [inputValue, setInputValue] = useState('');

    // Efeito para inicializar o estado das tags a partir do valor inicial
    useEffect(() => {
        if (initialValue) {
            const initialTags = initialValue.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '');
            setTags(initialTags);
        }
    }, [initialValue]);

    // Função interna que notifica o componente pai sobre a mudança
    useEffect(() => {
        if (onChange) {
            onChange(tags.join(','));
        }
    }, [tags, onChange]);

    // Função central que adiciona uma ou mais tags
    const addTag = (value) => {
        // Divide o valor se houver vírgulas (para suportar Ctrl+V de listas) // MODIFICADO
        const potentialTags = value.split(',').map(v => v.trim()).filter(v => v !== '');
        
        let newTags = [...tags];
        
        for (const newTag of potentialTags) {
            // Regra de Negócio: Parar se o limite for atingido
            if (newTags.length >= limit) {
                break;
            }
            // Regra de Negócio: Não adiciona se a tag já existe
            if (!newTags.includes(newTag)) {
                newTags.push(newTag);
            }
        }
        
        if (newTags.length > tags.length) {
            setTags(newTags);
        }
        
        setInputValue(''); // Limpa o input após adicionar as tags
    }; // FIM MODIFICADO

    // Função que remove a tag
    const removeTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    // Handler para capturar eventos de teclado (Enter ou Vírgula)
    const handleKeyDown = (e) => {
        // Vírgula (key 'Comma') ou Enter (key 'Enter')
        if (e.key === 'Comma' || e.key === 'Enter') { // MODIFICADO: Usando e.key é mais moderno que e.keyCode
            e.preventDefault(); 
            
            if (inputValue) {
                // A função addTag agora lida com a separação por vírgula se houver
                addTag(inputValue);
            }
        }
        
        // Backspace para remover a última tag (se o input estiver vazio)
        if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) { // MODIFICADO: Usando e.key
            removeTag(tags.length - 1);
        }
    };

    // Handler para o evento onChange do input (atualiza o inputValue)
    const handleInputChange = (e) => {
        const value = e.target.value;
        
        // Permite que o usuário digite a vírgula, mas trata a vírgula como um separador imediato
        if (value.endsWith(',')) {
            // Se a vírgula foi o último caractere, adiciona a tag antes da vírgula
            const tagBeforeComma = value.slice(0, -1);
            if (tagBeforeComma.trim() !== '') {
                addTag(tagBeforeComma);
            }
            // Não precisamos definir o input value, pois addTag já limpa.
            return;
        }

        setInputValue(value);
    };

    return (
        <div className="form-group">
            <label>{label}</label>
            <div className={`tag-input-container ${className}`}>
                
                {/* 1. Exibição das Tags */}
                {tags.map((tag, index) => (
                    <span key={index} className={`tag-badge ${className}`}> 
                        {tag}
                        <button 
                            type="button" 
                            onClick={() => removeTag(index)} 
                            aria-label={`Remover ${tag}`}
                        >
                            <FiX />
                        </button>
                    </span>
                ))}

                {/* 2. Input de Digitação */}
                {tags.length < limit && (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange} // MODIFICADO: Usando o novo handler
                        onKeyDown={handleKeyDown}
                        placeholder={tags.length === 0 ? `Digite tags e separe por vírgula ou Enter (Max: ${limit})` : ''}
                        // Estilos inlines para comportamento de layout
                        style={{ flexGrow: 1, border: 'none', outline: 'none', padding: '0 5px', backgroundColor: 'transparent' }} 
                    />
                )}
            </div>
             {/* 3. Status e Limite */}
            <small style={{ marginTop: '5px', display: 'block', color: tags.length >= limit ? 'red' : '#64748b' }}>
                {tags.length} de {limit} palavras utilizadas.
                {tags.length >= limit && ' (Limite Atingido)'}
            </small>
        </div>
    );
}