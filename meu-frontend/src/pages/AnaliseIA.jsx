// src/pages/AnaliseIA.jsx

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; 
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { FiUpload, FiGlobe, FiX } from "react-icons/fi";

// [REMOVIDO MOCK_IA_RESULT, pois não será mais usado]

// O componente agora espera apenas 'api', 'iaLoading', e 'setIaLoading'
export default function AnaliseIA({ api, iaLoading, setIaLoading }) { 
    // ESTADOS LOCAIS: upload e resultado
    const [uploadedFile, setUploadedFile] = useState(null); 
    const [iaResult, setIaResult] = useState(null);

    // FUNÇÃO DE ANÁLISE DE EDITAL COM IA (Lógica Mock Removida)
    const handleIaEdit = async () => {
        if (!uploadedFile) return alert("Por favor, selecione um arquivo PDF para análise.");
        if (uploadedFile.type !== 'application/pdf') return alert("O arquivo deve ser no formato PDF.");

        setIaLoading(true);
        setIaResult(null);

        // [LÓGICA MOCK MODE REMOVIDA]
        // O código agora segue diretamente para a chamada de API real:

        const formData = new FormData();
        formData.append('file', uploadedFile); 

        try {
            const res = await api.post('/ia/analisar_edital', formData, { 
                    headers: { 'Content-Type': 'multipart/form-data' } 
                });
            setIaResult(res.data.analise_completa); 
        } catch (e) {
            alert("Erro ao processar o edital: " + (e.response?.data?.detail || e.message || e.toString()));
            setIaResult("Erro: Não foi possível processar o edital.");
        } finally {
            setIaLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setUploadedFile(file);
            setIaResult(null); 
        } else if (file) {
            alert("Por favor, selecione apenas arquivos PDF.");
            setUploadedFile(null);
            e.target.value = null; 
        }
    };

    return (
        <div className="ia-analysis-container grid-layout" style={{gridTemplateColumns: '1fr', gap: '20px'}}>
            
            {/* COLUNA ESQUERDA: UPLOAD */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{marginBottom: '15px'}}>Upload do Edital em PDF</h3>
                
                {/* [CONTROLE DE MOCK MODE REMOVIDO AQUI] */}
                
                {uploadedFile ? (
                    // Exibe o arquivo selecionado
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '10px', 
                        border: '1px solid #2563eb', 
                        borderRadius: '8px',
                        backgroundColor: '#eff6ff',
                        marginBottom: '15px'
                    }}>
                        <span style={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '10px' }}>
                            <FiGlobe size={14} style={{ marginRight: '5px' }}/> {uploadedFile.name}
                        </span>
                        <button 
                            onClick={() => setUploadedFile(null)} 
                            className="btn-action delete" 
                            title="Remover arquivo"
                            style={{ height: '30px', width: '30px', flexShrink: 0 }}
                        >
                            <FiX />
                        </button>
                    </div>
                ) : (
                    // Campo de Upload (estilizado para ser um botão)
                    <label 
                        htmlFor="pdf-upload" 
                        style={{ 
                            display: 'block', 
                            padding: '40px 20px', 
                            border: '2px dashed #ccc', 
                            borderRadius: '8px', 
                            textAlign: 'center',
                            cursor: iaLoading ? 'default' : 'pointer', 
                            backgroundColor: iaLoading ? '#f1f1f1' : '#fff',
                            marginBottom: '15px',
                        }}
                    >
                        <FiUpload size={30} color="#0056b3" style={{ marginBottom: '5px' }}/>
                        <p style={{ fontWeight: 'bold', color: '#0056b3' }}>Clique ou arraste o PDF do Edital aqui</p>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Apenas arquivos .pdf são aceitos.</p>
                        <input 
                            type="file" 
                            id="pdf-upload" 
                            accept=".pdf" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }}
                            disabled={iaLoading}
                        />
                    </label>
                )}

                <button 
                    onClick={handleIaEdit} 
                    className="btn-primary" 
                    disabled={iaLoading || !uploadedFile}
                    style={{marginTop: '0px'}}
                >
                    {iaLoading ? 'Analisando Edital...' : '✨ Analisar Edital com IA'}
                </button>
                <small style={{marginTop: '10px', color: '#666'}}>A IA irá extrair o texto e identificar cláusulas, riscos e prazos.</small>
            </div>

            {/* COLUNA DIREITA: RESULTADO */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{marginBottom: '15px'}}>✅ Análise Detalhada da IA</h3>
                <div 
                    style={{
                        backgroundColor: '#f7f7f7',
                        padding: '15px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        minHeight: '200px',
                        flexGrow: 1,
                        fontSize: '1rem'
                    }}
                >
                    {iaLoading && <p style={{color: '#333'}}>Processando análise, aguarde...</p>}
                    
                    {/* Lógica de renderização simplificada sem mock mode */}
                    {(iaResult && !iaLoading) && (
                        <>
                            <p style={{marginBottom: '10px', fontWeight: 'bold', color: '#0056b3'}}>Resultado da Análise:</p>
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                            >
                                {iaResult}
                            </ReactMarkdown>
                        </>
                    )}
                    {(!iaLoading && !iaResult && !uploadedFile) && <p style={{color: '#999'}}>Carregue um PDF de edital ao lado para iniciar a análise inteligente.</p>}
                </div>
            </div>
        </div>
    );
}