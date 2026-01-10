// src/hooks/useLicitacoesSearch.jsx

import { useState, useCallback, useRef, useEffect } from 'react';

const ENDPOINT_VARREDURA = '/executar-varredura'; 
const LIMIT = 50; 

export const useLicitacoesSearch = (api, allUFs) => {
    
    // --- 1. ESTADO DE DADOS ---
    const [matches, setMatches] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loadingScan, setLoadingScan] = useState(false);
    
    // --- 2. ESTADO DE FILTROS ---
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [selectedSingleModalidade, setSelectedSingleModalidade] = useState('todos');
    const [selectedUFs, setSelectedUFs] = useState([]);
    const [apenasMeEpp, setApenasMeEpp] = useState(false);
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');
    const [customKeywords, setCustomKeywords] = useState('');
    // NOVO: Estado para termos negativos
    const [customNegativeKeywords, setCustomNegativeKeywords] = useState('');

    // --- 3. ESTADO DE PAGINAÇÃO KEYSET (CURSOR) ---
    const [cursorInfo, setCursorInfo] = useState(null); 
    const [cursorHistory, setCursorHistory] = useState([null]); 
    const [currentPageIndex, setCurrentPageIndex] = useState(0); 
    
    const isInitialMount = useRef(true); 
    const pageIndexRef = useRef(currentPageIndex); 
    const cursorHistoryRef = useRef(cursorHistory); 

    useEffect(() => {
        pageIndexRef.current = currentPageIndex;
        cursorHistoryRef.current = cursorHistory;
    }, [currentPageIndex, cursorHistory]);

    // --- 4. FUNÇÕES DE RESET E MANIPULAÇÃO ---
    
    const resetKeyset = useCallback(() => {
        setCursorHistory([null]); 
        setCurrentPageIndex(0);
        setCursorInfo(null);
    }, []);

    const handleProfileSelection = (id) => { 
        setSelectedProfiles(prev => {
            const isSelected = prev.includes(id);
            const next = isSelected ? [] : [id]; 
            resetKeyset();
            return next;
        });
    };

    const handleUFCheckbox = (ufSigla) => {
        setSelectedUFs(prev => {
            const exists = prev.includes(ufSigla);
            const next = exists ? prev.filter(u => u !== ufSigla) : [...prev, ufSigla];
            resetKeyset();
            return next;
        });
    };

    const handleSingleModalidadeChange = (modalidade) => {
        setSelectedSingleModalidade(modalidade);
        resetKeyset();
    };

    const handleApenasMeEppChange = (val) => {
        setApenasMeEpp(val);
        resetKeyset();
    };

    const handleMinValueChange = (val) => {
        setMinValue(val);
        resetKeyset();
    };

    const handleMaxValueChange = (val) => {
        setMaxValue(val);
        resetKeyset();
    };

    const handleCustomKeywordsChange = (val) => {
        setCustomKeywords(val);
        resetKeyset();
    };

    // NOVO: Handler para palavras negativas
    const handleCustomNegativeKeywordsChange = (val) => {
        setCustomNegativeKeywords(val);
        resetKeyset();
    };

    // --- 5. FUNÇÃO PRINCIPAL DE VARREDURA (API CALL) ---
    
    const rodarVarredura = useCallback(async () => {
        const temPerfil = selectedProfiles.length > 0;
        const temCustom = customKeywords && customKeywords.trim().length > 0;

        if (!temPerfil && !temCustom) {
            alert("Selecione um perfil ou digite termos personalizados para buscar."); 
            return; 
        }

        setLoadingScan(true);
        
        const currentCursor = cursorHistoryRef.current[pageIndexRef.current];
        
        const modalidadeFiltro = selectedSingleModalidade !== 'todos' 
            ? [parseInt(selectedSingleModalidade)] 
            : null;
            
        const ufsFiltro = selectedUFs.length > 0 ? selectedUFs : null;

        const requestData = {
            perfil_ids: selectedProfiles,
            custom_keywords: customKeywords || null,
            // NOVO: Enviando termos negativos para o Backend
            custom_negative_keywords: customNegativeKeywords || null, 
            filtro_uf: ufsFiltro,
            filtro_modalidade: modalidadeFiltro,
            apenas_me_epp: apenasMeEpp,
            valor_min: minValue ? parseFloat(minValue) : null,
            valor_max: maxValue ? parseFloat(maxValue) : null,
            limit: LIMIT,
            offset: currentCursor ? 0 : (pageIndexRef.current * LIMIT),
            last_valor_total: currentCursor?.last_valor_total || null,
            last_item_id: currentCursor?.last_item_id || null,
        };

        try {
            const res = await api.post(ENDPOINT_VARREDURA, requestData); 
            const { resultados, total_items, cursor } = res.data; 

            setMatches(resultados || []); 
            setTotalItems(total_items || 0);
            
            if (cursor && cursor.next_last_item_id) {
                setCursorInfo({
                    last_valor_total: cursor.next_last_valor_total,
                    last_item_id: cursor.next_last_item_id,
                });
            } else {
                setCursorInfo(null);
            }
        } catch (e) { 
            console.error("Erro na varredura Silver:", e);
            const msg = e.response?.data?.detail || "Erro ao conectar com o servidor.";
            alert("Falha na busca: " + msg); 
        } finally { 
            setLoadingScan(false); 
        }
        // ADICIONADO customNegativeKeywords nas dependências abaixo
    }, [api, selectedProfiles, selectedSingleModalidade, selectedUFs, apenasMeEpp, minValue, maxValue, customKeywords, customNegativeKeywords]); 


    // --- 6. NAVEGAÇÃO ---
    
    const handleNextPage = useCallback(() => {
        if (!cursorInfo) return; 

        if (currentPageIndex === cursorHistory.length - 1) {
            setCursorHistory(prev => [...prev, cursorInfo]);
        }
        
        setCurrentPageIndex(prev => prev + 1);
    }, [cursorInfo, currentPageIndex, cursorHistory.length]);

    const handlePreviousPage = useCallback(() => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
        }
    }, [currentPageIndex]);

    // --- 7. EFEITOS ---

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
        const temCriterio = selectedProfiles.length > 0 || (customKeywords && customKeywords.trim().length > 0);
        if (temCriterio) { 
             rodarVarredura();
        }
    }, [currentPageIndex]); 

    // --- 8. RETORNO PÚBLICO ---
    return {
        matches, 
        totalItems, 
        loadingScan, 
        currentPageIndex, 
        cursorInfo, 
        handleNextPage, 
        handlePreviousPage,
        selectedProfiles, 
        selectedUFs,
        selectedSingleModalidade,
        apenasMeEpp,
        minValue,
        setMinValue: handleMinValueChange,
        maxValue,
        setMaxValue: handleMaxValueChange,
        customKeywords,
        setCustomKeywords: handleCustomKeywordsChange,
        // NOVO: Retornando estados negativos
        customNegativeKeywords,
        setCustomNegativeKeywords: handleCustomNegativeKeywordsChange,
        setApenasMeEpp: handleApenasMeEppChange, 
        handleProfileSelection,
        handleUFCheckbox, 
        limparSelecaoUFs: () => { setSelectedUFs([]); resetKeyset(); },
        selecionarTodosUFs: () => { setSelectedUFs(allUFs); resetKeyset(); },
        setSelectedSingleModalidade: handleSingleModalidadeChange, 
        rodarVarredura, 
    };
};