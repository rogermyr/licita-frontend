// src/services/api.js (Nome corrigido para refletir a importação em Dashboard)

import axios from 'axios';

// 1. Definição do URL Base
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'; 

// 2. Criação da Instância Central do Axios (Singleton)
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 3. Interceptor de Requisição (Garante injeção dinâmica do token)
apiClient.interceptors.request.use(
    (config) => {
        // Tenta obter o token
        const token = localStorage.getItem('access_token');
        
        // CORREÇÃO CRÍTICA: Verifica se o token existe E não é a string literal 'undefined'
        if (token && token !== 'undefined') { 
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // Remove o cabeçalho se o token não for encontrado,
            // permitindo que o backend retorne 401, mas sem enviar "Bearer undefined".
            delete config.headers.Authorization; 
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 4. Interceptor de Resposta (Para lidar com 401 globais)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("[API Interceptor] Token expirado ou inválido.");
            // AÇÃO DE LOGOUT (Opcional, mas recomendado):
            // localStorage.removeItem('access_token');
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

// 5. Exporta a instância única
export default apiClient;