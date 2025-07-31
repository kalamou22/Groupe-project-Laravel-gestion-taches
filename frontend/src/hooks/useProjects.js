import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les projets
 * Ce hook récupère les projets depuis l'API et fournit des fonctions utilitaires
 * pour manipuler les données des projets
 */
export const useProjects = () => {
  // État pour stocker la liste des projets
  const [projects, setProjects] = useState([]);
  
  // État pour gérer l'affichage du loader pendant le chargement
  const [loading, setLoading] = useState(true);
  
  // État pour stocker les erreurs éventuelles
  const [error, setError] = useState(null);

  /**
   * Fonction pour récupérer les projets depuis l'API
   * Utilise l'authentification par token Bearer
   */
  const fetchProjects = async () => {
    try {
      // Afficher le loader
      setLoading(true);
      
      // Récupérer le token d'authentification depuis le localStorage
      const token = localStorage.getItem('token');
      
      // Vérifier si le token existe
      if (!token) {
        throw new Error('Token non trouvé');
      }

      // Appel à l'API pour récupérer les projets
      const response = await fetch('http://127.0.0.1:8000/api/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Vérifier si la réponse est ok
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des projets');
      }

      // Parser la réponse JSON
      const data = await response.json();
      
      // Mettre à jour l'état avec les projets récupérés
      setProjects(data);
      setError(null);
    } catch (err) {
      // Gérer les erreurs
      console.error('Erreur lors du chargement des projets:', err);
      setError(err.message);
      
      // Données de fallback en cas d'échec de l'API
      // Ces données permettent de tester l'interface même si l'API ne fonctionne pas
      setProjects([
        {
          id: 1,
          name: "Développement Site E-commerce",
          description: "Création d'une plateforme e-commerce complète avec paiement en ligne",
          tasks: [
            { id: 1, titre: "Design de l'interface utilisateur", description: "Créer les maquettes UI/UX", etat: "terminée", assigned_to: 1 },
            { id: 2, titre: "Développement frontend", description: "Implémenter les pages avec React", etat: "en cours", assigned_to: 2 },
            { id: 3, titre: "Intégration API paiement", description: "Connecter Stripe pour les paiements", etat: "en attente", assigned_to: 3 },
            { id: 4, titre: "Tests unitaires", description: "Écrire les tests pour les composants", etat: "en attente", assigned_to: 4 },
            { id: 5, titre: "Optimisation SEO", description: "Améliorer le référencement", etat: "en attente", assigned_to: 5 },
            { id: 6, titre: "Déploiement production", description: "Mettre en ligne sur serveur", etat: "en attente", assigned_to: 1 }
          ],
          deadline: "2025-08-15",
          budget: 50000,
          status: "pending"
        },
        {
          id: 2,
          name: "Application Mobile Fitness",
          description: "App mobile pour suivre les entraînements et la nutrition",
          tasks: [
            { id: 7, titre: "Conception de la base de données", description: "Modéliser les données utilisateurs", etat: "terminée", assigned_to: 6 },
            { id: 8, titre: "Développement API backend", description: "Créer les endpoints REST", etat: "en cours", assigned_to: 7 },
            { id: 9, titre: "Interface utilisateur mobile", description: "Développer avec React Native", etat: "en cours", assigned_to: 8 },
            { id: 10, titre: "Intégration GPS", description: "Suivi des parcours de course", etat: "en attente", assigned_to: 9 },
            { id: 11, titre: "Système de notifications", description: "Rappels d'entraînement", etat: "en attente", assigned_to: 10 },
            { id: 12, titre: "Tests sur appareils", description: "Tests sur iOS et Android", etat: "en attente", assigned_to: 11 }
          ],
          deadline: "2025-07-30",
          budget: 40000,
          status: "pending"
        },
        {
          id: 3,
          name: "Système de Gestion RH",
          description: "Plateforme pour gérer les ressources humaines",
          tasks: [
            { id: 13, titre: "Analyse des besoins", description: "Rencontres avec les utilisateurs", etat: "terminée", assigned_to: 12 },
            { id: 14, titre: "Architecture système", description: "Conception technique", etat: "en cours", assigned_to: 13 },
            { id: 15, titre: "Module recrutement", description: "Gestion des candidatures", etat: "en attente", assigned_to: 14 },
            { id: 16, titre: "Module paie", description: "Calcul des salaires", etat: "en attente", assigned_to: 15 },
            { id: 17, titre: "Module formation", description: "Suivi des formations", etat: "en attente", assigned_to: 16 }
          ],
          deadline: "2025-08-30",
          budget: 35000,
          status: "pending"
        }
      ]);
    } finally {
      // Masquer le loader une fois terminé
      setLoading(false);
    }
  };

  // Effet pour charger les projets au montage du composant
  useEffect(() => {
    fetchProjects();
  }, []);

  /**
   * Fonction pour filtrer les projets par statut
   * @param {string} status - Le statut à filtrer (pending, in_progress, completed)
   * @returns {Array} - Liste des projets filtrés
   */
  const getProjectsByStatus = (status) => {
    return projects.filter(project => project.status === status);
  };

  /**
   * Fonction pour récupérer un projet par son ID
   * @param {number} id - L'ID du projet à récupérer
   * @returns {Object|null} - Le projet trouvé ou null
   */
  const getProjectById = (id) => {
    return projects.find(project => project.id === id);
  };

  /**
   * Fonction pour récupérer la liste des noms de projets
   * @returns {Array} - Liste des noms de projets
   */
  const getProjectNames = () => {
    return projects.map(project => project.name);
  };

  // Retourner les états et fonctions pour utilisation dans les composants
  return {
    projects,           // Liste des projets
    loading,           // État de chargement
    error,             // Erreur éventuelle
    fetchProjects,     // Fonction pour recharger les projets
    getProjectsByStatus, // Fonction pour filtrer par statut
    getProjectById,    // Fonction pour récupérer un projet par ID
    getProjectNames    // Fonction pour récupérer les noms de projets
  };
}; 