<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

/**
 * Seeder pour créer les projets et tâches de l'application
 * Ce seeder crée 10 projets avec leurs tâches associées
 */
class ProjectsAndTasksSeeder extends Seeder
{
    /**
     * Exécute le seeder pour créer les projets et tâches
     * Crée 10 projets avec 56 tâches au total
     */
    public function run(): void
    {
        // Récupérer tous les utilisateurs pour les assignations
        $users = User::all();
        
        // Vérifier qu'il y a des utilisateurs disponibles
        if ($users->isEmpty()) {
            $this->command->error('Aucun utilisateur trouvé. Veuillez d\'abord exécuter UsersSeeder.');
            return;
        }

        // ===== PROJET 1: DÉVELOPPEMENT SITE E-COMMERCE =====
        $project1 = Project::create([
            'name' => 'Développement Site E-commerce',
            'description' => 'Création d\'une plateforme e-commerce complète avec paiement en ligne, gestion des stocks et interface administrateur.',
            'deadline' => '2025-08-15',
            'budget' => 50000,
            'status' => 'pending'
        ]);

        // Tâches pour le projet e-commerce
        $this->createTasksForProject($project1, [
            ['titre' => 'Design de l\'interface utilisateur', 'description' => 'Créer les maquettes UI/UX pour toutes les pages', 'etat' => 'terminée', 'deadline' => '2025-06-15'],
            ['titre' => 'Développement frontend', 'description' => 'Implémenter les pages avec React et Tailwind CSS', 'etat' => 'en cours', 'deadline' => '2025-07-01'],
            ['titre' => 'Intégration API paiement', 'description' => 'Connecter Stripe pour les paiements sécurisés', 'etat' => 'en attente', 'deadline' => '2025-07-15'],
            ['titre' => 'Tests unitaires', 'description' => 'Écrire les tests pour tous les composants', 'etat' => 'en attente', 'deadline' => '2025-07-30'],
            ['titre' => 'Optimisation SEO', 'description' => 'Améliorer le référencement et la visibilité', 'etat' => 'en attente', 'deadline' => '2025-08-01'],
            ['titre' => 'Déploiement production', 'description' => 'Mettre en ligne sur serveur de production', 'etat' => 'en attente', 'deadline' => '2025-08-10']
        ], $users);

        // ===== PROJET 2: APPLICATION MOBILE FITNESS =====
        $project2 = Project::create([
            'name' => 'Application Mobile Fitness',
            'description' => 'App mobile pour suivre les entraînements, la nutrition et les objectifs fitness avec synchronisation cloud.',
            'deadline' => '2025-07-30',
            'budget' => 40000,
            'status' => 'pending'
        ]);

        // Tâches pour l'app fitness
        $this->createTasksForProject($project2, [
            ['titre' => 'Conception de la base de données', 'description' => 'Modéliser les données utilisateurs et entraînements', 'etat' => 'terminée', 'deadline' => '2025-05-15'],
            ['titre' => 'Développement API backend', 'description' => 'Créer les endpoints REST pour l\'application', 'etat' => 'en cours', 'deadline' => '2025-06-01'],
            ['titre' => 'Interface utilisateur mobile', 'description' => 'Développer avec React Native pour iOS/Android', 'etat' => 'en cours', 'deadline' => '2025-06-15'],
            ['titre' => 'Intégration GPS', 'description' => 'Suivi des parcours de course et géolocalisation', 'etat' => 'en attente', 'deadline' => '2025-07-01'],
            ['titre' => 'Système de notifications', 'description' => 'Rappels d\'entraînement et notifications push', 'etat' => 'en attente', 'deadline' => '2025-07-15'],
            ['titre' => 'Tests sur appareils', 'description' => 'Tests complets sur iOS et Android', 'etat' => 'en attente', 'deadline' => '2025-07-20']
        ], $users);

        // ===== PROJET 3: SYSTÈME DE GESTION RH =====
        $project3 = Project::create([
            'name' => 'Système de Gestion RH',
            'description' => 'Plateforme complète pour gérer les ressources humaines, recrutement, paie et formations.',
            'deadline' => '2025-08-30',
            'budget' => 35000,
            'status' => 'pending'
        ]);

        // Tâches pour le système RH
        $this->createTasksForProject($project3, [
            ['titre' => 'Analyse des besoins', 'description' => 'Rencontres avec les utilisateurs RH', 'etat' => 'terminée', 'deadline' => '2025-05-01'],
            ['titre' => 'Architecture système', 'description' => 'Conception technique et architecture', 'etat' => 'en cours', 'deadline' => '2025-05-15'],
            ['titre' => 'Module recrutement', 'description' => 'Gestion des candidatures et processus', 'etat' => 'en attente', 'deadline' => '2025-06-15'],
            ['titre' => 'Module paie', 'description' => 'Calcul des salaires et bulletins', 'etat' => 'en attente', 'deadline' => '2025-07-15'],
            ['titre' => 'Module formation', 'description' => 'Suivi des formations et compétences', 'etat' => 'en attente', 'deadline' => '2025-08-15']
        ], $users);

        // ===== PROJET 4: REFONTE SITE CORPORATE =====
        $project4 = Project::create([
            'name' => 'Refonte Site Corporate',
            'description' => 'Modernisation complète du site web corporate avec design responsive et nouvelles fonctionnalités.',
            'deadline' => '2025-07-15',
            'budget' => 25000,
            'status' => 'pending'
        ]);

        // Tâches pour la refonte corporate
        $this->createTasksForProject($project4, [
            ['titre' => 'Audit du site existant', 'description' => 'Analyse des forces et faiblesses', 'etat' => 'terminée', 'deadline' => '2025-05-01'],
            ['titre' => 'Nouveau design', 'description' => 'Création des maquettes modernes', 'etat' => 'en cours', 'deadline' => '2025-05-30'],
            ['titre' => 'Développement frontend', 'description' => 'Intégration HTML/CSS/JS responsive', 'etat' => 'en attente', 'deadline' => '2025-06-30'],
            ['titre' => 'Intégration CMS', 'description' => 'Migration vers WordPress ou autre CMS', 'etat' => 'en attente', 'deadline' => '2025-07-01'],
            ['titre' => 'Tests et déploiement', 'description' => 'Tests finaux et mise en ligne', 'etat' => 'en attente', 'deadline' => '2025-07-10']
        ], $users);

        // ===== PROJET 5: MIGRATION CLOUD INFRASTRUCTURE =====
        $project5 = Project::create([
            'name' => 'Migration Cloud Infrastructure',
            'description' => 'Migration de l\'infrastructure serveur vers le cloud AWS avec optimisation des performances.',
            'deadline' => '2025-09-15',
            'budget' => 45000,
            'status' => 'pending'
        ]);

        // Tâches pour la migration cloud
        $this->createTasksForProject($project5, [
            ['titre' => 'Audit infrastructure actuelle', 'description' => 'Analyse des serveurs et services', 'etat' => 'terminée', 'deadline' => '2025-06-01'],
            ['titre' => 'Plan de migration', 'description' => 'Stratégie et planning détaillé', 'etat' => 'en cours', 'deadline' => '2025-06-15'],
            ['titre' => 'Configuration AWS', 'description' => 'Mise en place des services cloud', 'etat' => 'en attente', 'deadline' => '2025-07-15'],
            ['titre' => 'Migration des données', 'description' => 'Transfert sécurisé des données', 'etat' => 'en attente', 'deadline' => '2025-08-15'],
            ['titre' => 'Tests de performance', 'description' => 'Optimisation et tests de charge', 'etat' => 'en attente', 'deadline' => '2025-09-01'],
            ['titre' => 'Formation équipe', 'description' => 'Formation sur la nouvelle infrastructure', 'etat' => 'en attente', 'deadline' => '2025-09-10']
        ], $users);

        // ===== PROJET 6: APPLICATION CHAT TEMPS RÉEL =====
        $project6 = Project::create([
            'name' => 'Application de Chat en Temps Réel',
            'description' => 'Application de messagerie instantanée avec WebSocket, notifications et partage de fichiers.',
            'deadline' => '2025-08-01',
            'budget' => 30000,
            'status' => 'pending'
        ]);

        // Tâches pour l'app chat
        $this->createTasksForProject($project6, [
            ['titre' => 'Architecture WebSocket', 'description' => 'Conception de l\'architecture temps réel', 'etat' => 'terminée', 'deadline' => '2025-06-01'],
            ['titre' => 'Backend Node.js', 'description' => 'Développement du serveur WebSocket', 'etat' => 'en cours', 'deadline' => '2025-06-15'],
            ['titre' => 'Interface utilisateur', 'description' => 'Interface de chat moderne', 'etat' => 'en attente', 'deadline' => '2025-07-01'],
            ['titre' => 'Système de fichiers', 'description' => 'Upload et partage de fichiers', 'etat' => 'en attente', 'deadline' => '2025-07-15'],
            ['titre' => 'Tests et déploiement', 'description' => 'Tests finaux et mise en production', 'etat' => 'en attente', 'deadline' => '2025-07-25']
        ], $users);

        // ===== PROJET 7: SYSTÈME GESTION STOCKS =====
        $project7 = Project::create([
            'name' => 'Système de Gestion des Stocks',
            'description' => 'Système complet de gestion d\'inventaire avec codes-barres, alertes et rapports.',
            'deadline' => '2025-09-30',
            'budget' => 35000,
            'status' => 'pending'
        ]);

        // Tâches pour le système de stocks
        $this->createTasksForProject($project7, [
            ['titre' => 'Analyse des processus', 'description' => 'Étude des flux de stock actuels', 'etat' => 'terminée', 'deadline' => '2025-07-01'],
            ['titre' => 'Conception base de données', 'description' => 'Modélisation des données produits', 'etat' => 'en cours', 'deadline' => '2025-07-15'],
            ['titre' => 'Interface de gestion', 'description' => 'Interface d\'administration des stocks', 'etat' => 'en attente', 'deadline' => '2025-08-15'],
            ['titre' => 'Intégration codes-barres', 'description' => 'Système de scan et génération', 'etat' => 'en attente', 'deadline' => '2025-09-01'],
            ['titre' => 'Système d\'alertes', 'description' => 'Notifications de stock faible', 'etat' => 'en attente', 'deadline' => '2025-09-15'],
            ['titre' => 'Rapports et analytics', 'description' => 'Tableaux de bord et statistiques', 'etat' => 'en attente', 'deadline' => '2025-09-20']
        ], $users);

        // ===== PROJET 8: PLATEFORME FORMATION EN LIGNE =====
        $project8 = Project::create([
            'name' => 'Plateforme de Formation en Ligne',
            'description' => 'Plateforme e-learning avec cours vidéo, quiz interactifs et suivi des progrès.',
            'deadline' => '2025-10-15',
            'budget' => 40000,
            'status' => 'pending'
        ]);

        // Tâches pour la plateforme e-learning
        $this->createTasksForProject($project8, [
            ['titre' => 'Analyse des besoins', 'description' => 'Étude des besoins des formateurs', 'etat' => 'terminée', 'deadline' => '2025-08-01'],
            ['titre' => 'Architecture plateforme', 'description' => 'Conception technique du système', 'etat' => 'en cours', 'deadline' => '2025-08-15'],
            ['titre' => 'Système de cours', 'description' => 'Gestion des cours et modules', 'etat' => 'en attente', 'deadline' => '2025-09-15'],
            ['titre' => 'Lecteur vidéo', 'description' => 'Lecteur vidéo avec contrôles', 'etat' => 'en attente', 'deadline' => '2025-09-30'],
            ['titre' => 'Système de quiz', 'description' => 'Création et évaluation des quiz', 'etat' => 'en attente', 'deadline' => '2025-10-01']
        ], $users);

        // ===== PROJET 9: APPLICATION GESTION PROJETS =====
        $project9 = Project::create([
            'name' => 'Application de Gestion des Projets',
            'description' => 'Application complète de gestion de projet avec planning, ressources et reporting.',
            'deadline' => '2025-11-30',
            'budget' => 50000,
            'status' => 'pending'
        ]);

        // Tâches pour l'app de gestion de projets
        $this->createTasksForProject($project9, [
            ['titre' => 'Analyse fonctionnelle', 'description' => 'Définition des fonctionnalités', 'etat' => 'terminée', 'deadline' => '2025-09-01'],
            ['titre' => 'Conception technique', 'description' => 'Architecture et modélisation', 'etat' => 'en cours', 'deadline' => '2025-09-15'],
            ['titre' => 'Module projets', 'description' => 'Gestion des projets et tâches', 'etat' => 'en attente', 'deadline' => '2025-10-15'],
            ['titre' => 'Module planning', 'description' => 'Planning et calendrier', 'etat' => 'en attente', 'deadline' => '2025-11-01'],
            ['titre' => 'Module ressources', 'description' => 'Gestion des ressources humaines', 'etat' => 'en attente', 'deadline' => '2025-11-15'],
            ['titre' => 'Reporting et analytics', 'description' => 'Tableaux de bord et rapports', 'etat' => 'en attente', 'deadline' => '2025-11-20']
        ], $users);

        // ===== PROJET 10: SYSTÈME RÉSERVATION EN LIGNE =====
        $project10 = Project::create([
            'name' => 'Système de Réservation en Ligne',
            'description' => 'Système de réservation pour hôtels/restaurants avec paiement et confirmation automatique.',
            'deadline' => '2025-12-15',
            'budget' => 30000,
            'status' => 'pending'
        ]);

        // Tâches pour le système de réservation
        $this->createTasksForProject($project10, [
            ['titre' => 'Analyse des besoins', 'description' => 'Étude des processus de réservation', 'etat' => 'terminée', 'deadline' => '2025-10-01'],
            ['titre' => 'Conception système', 'description' => 'Architecture et flux de données', 'etat' => 'en cours', 'deadline' => '2025-10-15'],
            ['titre' => 'Interface réservation', 'description' => 'Formulaire de réservation en ligne', 'etat' => 'en attente', 'deadline' => '2025-11-15'],
            ['titre' => 'Système de paiement', 'description' => 'Intégration des moyens de paiement', 'etat' => 'en attente', 'deadline' => '2025-12-01'],
            ['titre' => 'Notifications automatiques', 'description' => 'Emails de confirmation et rappels', 'etat' => 'en attente', 'deadline' => '2025-12-10'],
            ['titre' => 'Tests et déploiement', 'description' => 'Tests finaux et mise en production', 'etat' => 'en attente', 'deadline' => '2025-12-12']
        ], $users);

        // Afficher un résumé de ce qui a été créé
        $this->command->info('10 projets créés avec succès !');
        $this->command->info('56 tâches créées et assignées aux utilisateurs sénégalais !');
    }

    /**
     * Crée les tâches pour un projet donné
     * 
     * @param Project $project - Le projet pour lequel créer les tâches
     * @param array $tasksData - Tableau des données des tâches
     * @param \Illuminate\Database\Eloquent\Collection $users - Collection des utilisateurs disponibles
     */
    private function createTasksForProject($project, $tasksData, $users)
    {
        foreach ($tasksData as $taskData) {
            // Créer la tâche avec les données fournies
            Task::create([
                'titre' => $taskData['titre'],                    // Titre de la tâche
                'description' => $taskData['description'],        // Description détaillée
                'etat' => $taskData['etat'],                     // État actuel (terminée, en cours, en attente)
                'deadline' => $taskData['deadline'],             // Date limite de la tâche
                'project_id' => $project->id,                    // ID du projet associé
                'assigned_to' => $users->random()->id,           // Assignation aléatoire à un utilisateur
            ]);
        }
    }
}
