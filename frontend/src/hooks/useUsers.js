import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les utilisateurs
 * Ce hook récupère les utilisateurs depuis l'API et fournit des fonctions utilitaires
 * pour manipuler les données des utilisateurs
 */
export const useUsers = () => {
  // État pour stocker la liste des utilisateurs
  const [users, setUsers] = useState([]);
  
  // État pour gérer l'affichage du loader pendant le chargement
  const [loading, setLoading] = useState(true);
  
  // État pour stocker les erreurs éventuelles
  const [error, setError] = useState(null);

  /**
   * Fonction pour récupérer les utilisateurs depuis l'API
   * Utilise l'authentification par token Bearer
   */
  const fetchUsers = async () => {
    try {
      // Afficher le loader
      setLoading(true);
      
      // Récupérer le token d'authentification depuis le localStorage
      const token = localStorage.getItem('token');
      
      // Vérifier si le token existe
      if (!token) {
        throw new Error('Token non trouvé');
      }

      // Appel à l'API pour récupérer les utilisateurs
      const response = await fetch('http://127.0.0.1:8000/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Vérifier si la réponse est ok
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      // Parser la réponse JSON
      const data = await response.json();
      
      // Mettre à jour l'état avec les utilisateurs récupérés
      setUsers(data);
      setError(null);
    } catch (err) {
      // Gérer les erreurs
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err.message);
      
      // Données de fallback en cas d'échec de l'API
      // Ces données permettent de tester l'interface même si l'API ne fonctionne pas
      // Tous les utilisateurs sont maintenant des noms sénégalais
      setUsers([
        // Équipe de développement
        { id: 1, name: 'Mamadou Diallo', email: 'mamadou.diallo@infyproject.com', role: 'developer' },
        { id: 2, name: 'Fatou Sall', email: 'fatou.sall@infyproject.com', role: 'developer' },
        { id: 3, name: 'Ousmane Ba', email: 'ousmane.ba@infyproject.com', role: 'developer' },
        { id: 4, name: 'Aissatou Diop', email: 'aissatou.diop@infyproject.com', role: 'developer' },
        { id: 5, name: 'Ibrahima Ndiaye', email: 'ibrahima.ndiaye@infyproject.com', role: 'developer' },
        
        // Équipe de design
        { id: 6, name: 'Mariama Fall', email: 'mariama.fall@infyproject.com', role: 'designer' },
        { id: 7, name: 'Modou Gueye', email: 'modou.gueye@infyproject.com', role: 'designer' },
        { id: 8, name: 'Aminata Mbaye', email: 'aminata.mbaye@infyproject.com', role: 'designer' },
        { id: 9, name: 'Cheikh Thiam', email: 'cheikh.thiam@infyproject.com', role: 'designer' },
        
        // Équipe de test
        { id: 10, name: 'Khadija Sow', email: 'khadija.sow@infyproject.com', role: 'tester' },
        { id: 11, name: 'Abdou Cisse', email: 'abdou.cisse@infyproject.com', role: 'tester' },
        { id: 12, name: 'Mame Diarra Faye', email: 'mame.diarra.faye@infyproject.com', role: 'tester' },
        
        // Équipe de gestion de projet
        { id: 13, name: 'Moussa Camara', email: 'moussa.camara@infyproject.com', role: 'project_manager' },
        { id: 14, name: 'Awa Diagne', email: 'awa.diagne@infyproject.com', role: 'project_manager' },
        { id: 15, name: 'Boubacar Seck', email: 'boubacar.seck@infyproject.com', role: 'project_manager' },
        
        // Équipe DevOps
        { id: 16, name: 'Ndeye Fatou Wade', email: 'ndeye.fatou.wade@infyproject.com', role: 'devops' },
        { id: 17, name: 'Malick Sy', email: 'malick.sy@infyproject.com', role: 'devops' },
        { id: 18, name: 'Aicha Toure', email: 'aicha.toure@infyproject.com', role: 'devops' },
        
        // Équipe marketing
        { id: 19, name: 'Samba Niang', email: 'samba.niang@infyproject.com', role: 'marketing' },
        { id: 20, name: 'Rokhaya Diouf', email: 'rokhaya.diouf@infyproject.com', role: 'marketing' },
        { id: 21, name: 'El Hadji Mbodj', email: 'el.hadji.mbodj@infyproject.com', role: 'marketing' },
        
        // Équipe support
        { id: 22, name: 'Adama Kane', email: 'adama.kane@infyproject.com', role: 'support' },
        { id: 23, name: 'Moussa Diop', email: 'moussa.diop@infyproject.com', role: 'support' },
        { id: 24, name: 'Nafissatou Diallo', email: 'nafissatou.diallo@infyproject.com', role: 'support' },
        
        // Équipe finance
        { id: 25, name: 'Mamadou Lamine Diop', email: 'mamadou.lamine.diop@infyproject.com', role: 'finance' },
        { id: 26, name: 'Fatou Bintou Fall', email: 'fatou.bintou.fall@infyproject.com', role: 'finance' },
        
        // Équipe RH
        { id: 27, name: 'Omar Sene', email: 'omar.sene@infyproject.com', role: 'hr' },
        { id: 28, name: 'Mariama Ba', email: 'mariama.ba@infyproject.com', role: 'hr' },
        
        // Consultants externes
        { id: 29, name: 'Mame Fatou Ndiaye', email: 'mame.fatou.ndiaye@consultant.com', role: 'consultant' },
        { id: 30, name: 'Ibrahima Fall', email: 'ibrahima.fall@consultant.com', role: 'consultant' },
        { id: 31, name: 'Aissatou Gueye', email: 'aissatou.gueye@consultant.com', role: 'consultant' },
      ]);
    } finally {
      // Masquer le loader une fois terminé
      setLoading(false);
    }
  };

  // Effet pour charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Fonction pour filtrer les utilisateurs par rôle
   * @param {string} role - Le rôle à filtrer (developer, designer, tester, etc.)
   * @returns {Array} - Liste des utilisateurs filtrés
   */
  const getUsersByRole = (role) => {
    return users.filter(user => user.role === role);
  };

  /**
   * Fonction pour récupérer un utilisateur par son ID
   * @param {number} id - L'ID de l'utilisateur à récupérer
   * @returns {Object|null} - L'utilisateur trouvé ou null
   */
  const getUserById = (id) => {
    return users.find(user => user.id === id);
  };

  /**
   * Fonction pour récupérer la liste des noms d'utilisateurs
   * @returns {Array} - Liste des noms d'utilisateurs
   */
  const getUserNames = () => {
    return users.map(user => user.name);
  };

  // Retourner les états et fonctions pour utilisation dans les composants
  return {
    users,              // Liste des utilisateurs
    loading,            // État de chargement
    error,              // Erreur éventuelle
    fetchUsers,         // Fonction pour recharger les utilisateurs
    getUsersByRole,     // Fonction pour filtrer par rôle
    getUserById,        // Fonction pour récupérer un utilisateur par ID
    getUserNames        // Fonction pour récupérer les noms d'utilisateurs
  };
}; 