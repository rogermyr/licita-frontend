// src/App.jsx (VERSÃO FINAL)

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"; 

import Login from './pages/Login'
import Dashboard from './pages/Dashboard' 

import './App.css'

// CHAVE PADRONIZADA PARA O LOCALSTORAGE
const TOKEN_STORAGE_KEY = 'access_token'; // MODIFICADO/NOVO: Usamos a chave correta do interceptor

function App() {
    // MODIFICADO: Lendo a chave padronizada
    const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY))

    useEffect(() => {
        try {
            if (token) {
                const decoded = jwtDecode(token);
                // Verifica se o token expirou
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem(TOKEN_STORAGE_KEY); // MODIFICADO
                    setToken(null);
                    alert('Sessão expirada. Faça login novamente.');
                }
            }
        } catch (e) {
            console.error("Erro ao decodificar token:", e);
            localStorage.removeItem(TOKEN_STORAGE_KEY); // MODIFICADO
            setToken(null);
        }
    }, [token]);

    return (
        <BrowserRouter>
            <Routes>
                {/* Rota de Login */}
                <Route 
                    path="/login" 
                    element={!token ? <Login setToken={setToken} tokenStorageKey={TOKEN_STORAGE_KEY} /> : <Navigate to="/oportunidades" />} 
                />
                
                {/* Rota Protegida Principal */}
                <Route 
                    path="/*" 
                    element={
                        token 
                            ? <Dashboard token={token} setToken={setToken} tokenStorageKey={TOKEN_STORAGE_KEY} /> 
                            : <Navigate to="/login" />
                    } 
                />
                
                {/* Catch-all */}
                <Route 
                    path="*" 
                    element={<Navigate to={token ? "/oportunidades" : "/login"} />} 
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App