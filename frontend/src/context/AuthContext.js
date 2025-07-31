import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Configuration axios avec token
    useEffect(() => {
        if (token) {
            console.log('🔧 Configuration du token axios:', token.substring(0, 10) + '...');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            console.log('🔧 Aucun token trouvé, arrêt du chargement');
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            console.log('🔍 Récupération du profil utilisateur...');
            const response = await axios.get('http://127.0.0.1:8000/api/user');
            console.log('✅ Profil utilisateur récupéré:', response.data);
            setUser(response.data);
        } catch (error) {
            console.error('❌ Erreur lors de la récupération du profil:', error);
            // Ne pas appeler logout() automatiquement, juste nettoyer l'état
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            console.log('🔐 Tentative de connexion...', { email });
            
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email,
                password
            });
            
            console.log('✅ Réponse API reçue:', response.data);
            
            const { token: newToken, user: userData } = response.data;
            
            // Mettre à jour l'état de manière synchrone
            setToken(newToken);
            setUser(userData);
            setLoading(false);
            
            // Sauvegarder dans localStorage
            localStorage.setItem('token', newToken);
            
            // Configurer axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            
            console.log('✅ Connexion réussie, utilisateur défini:', userData);
            
            return { success: true };
        } catch (error) {
            console.error('❌ Erreur de connexion:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Erreur de connexion' 
            };
        }
    };

    const register = async (name, email, password, password_confirmation) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register', {
                name,
                email,
                password,
                password_confirmation
            });
            
            const { token: newToken, user: userData } = response.data;
            
            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Erreur d\'inscription' 
            };
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post('http://127.0.0.1:8000/api/logout');
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            setToken(null);
            setUser(null);
            setLoading(false);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 