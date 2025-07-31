<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder pour créer les utilisateurs de l'application
 * Ce seeder crée 30 utilisateurs sénégalais répartis dans différentes équipes
 */
class UsersSeeder extends Seeder
{
    /**
     * Exécute le seeder pour créer les utilisateurs
     * Crée 30 utilisateurs sénégalais avec différents rôles
     */
    public function run(): void
    {
        // Tableau des utilisateurs à créer
        // Chaque utilisateur a un nom sénégalais, un email et un rôle spécifique
        $users = [
            // ===== ÉQUIPE DE DÉVELOPPEMENT (5 utilisateurs) =====
            // Développeurs responsables du code et de l'architecture
            ['name' => 'Mamadou Diallo', 'email' => 'mamadou.diallo@infyproject.com', 'password' => 'password123', 'role' => 'developer'],
            ['name' => 'Fatou Sall', 'email' => 'fatou.sall@infyproject.com', 'password' => 'password123', 'role' => 'developer'],
            ['name' => 'Ousmane Ba', 'email' => 'ousmane.ba@infyproject.com', 'password' => 'password123', 'role' => 'developer'],
            ['name' => 'Aissatou Diop', 'email' => 'aissatou.diop@infyproject.com', 'password' => 'password123', 'role' => 'developer'],
            ['name' => 'Ibrahima Ndiaye', 'email' => 'ibrahima.ndiaye@infyproject.com', 'password' => 'password123', 'role' => 'developer'],
            
            // ===== ÉQUIPE DE DESIGN (4 utilisateurs) =====
            // Designers responsables de l'interface utilisateur et de l'expérience utilisateur
            ['name' => 'Mariama Fall', 'email' => 'mariama.fall@infyproject.com', 'password' => 'password123', 'role' => 'designer'],
            ['name' => 'Modou Gueye', 'email' => 'modou.gueye@infyproject.com', 'password' => 'password123', 'role' => 'designer'],
            ['name' => 'Aminata Mbaye', 'email' => 'aminata.mbaye@infyproject.com', 'password' => 'password123', 'role' => 'designer'],
            ['name' => 'Cheikh Thiam', 'email' => 'cheikh.thiam@infyproject.com', 'password' => 'password123', 'role' => 'designer'],
            
            // ===== ÉQUIPE DE TEST (3 utilisateurs) =====
            // Testeurs responsables de la qualité et des tests
            ['name' => 'Khadija Sow', 'email' => 'khadija.sow@infyproject.com', 'password' => 'password123', 'role' => 'tester'],
            ['name' => 'Abdou Cisse', 'email' => 'abdou.cisse@infyproject.com', 'password' => 'password123', 'role' => 'tester'],
            ['name' => 'Mame Diarra Faye', 'email' => 'mame.diarra.faye@infyproject.com', 'password' => 'password123', 'role' => 'tester'],
            
            // ===== ÉQUIPE DE GESTION DE PROJET (3 utilisateurs) =====
            // Chefs de projet responsables de la coordination et du suivi
            ['name' => 'Moussa Camara', 'email' => 'moussa.camara@infyproject.com', 'password' => 'password123', 'role' => 'project_manager'],
            ['name' => 'Awa Diagne', 'email' => 'awa.diagne@infyproject.com', 'password' => 'password123', 'role' => 'project_manager'],
            ['name' => 'Boubacar Seck', 'email' => 'boubacar.seck@infyproject.com', 'password' => 'password123', 'role' => 'project_manager'],
            
            // ===== ÉQUIPE DEVOPS (3 utilisateurs) =====
            // Administrateurs système et déploiement
            ['name' => 'Ndeye Fatou Wade', 'email' => 'ndeye.fatou.wade@infyproject.com', 'password' => 'password123', 'role' => 'devops'],
            ['name' => 'Malick Sy', 'email' => 'malick.sy@infyproject.com', 'password' => 'password123', 'role' => 'devops'],
            ['name' => 'Aicha Toure', 'email' => 'aicha.toure@infyproject.com', 'password' => 'password123', 'role' => 'devops'],
            
            // ===== ÉQUIPE MARKETING (3 utilisateurs) =====
            // Responsables marketing et communication
            ['name' => 'Samba Niang', 'email' => 'samba.niang@infyproject.com', 'password' => 'password123', 'role' => 'marketing'],
            ['name' => 'Rokhaya Diouf', 'email' => 'rokhaya.diouf@infyproject.com', 'password' => 'password123', 'role' => 'marketing'],
            ['name' => 'El Hadji Mbodj', 'email' => 'el.hadji.mbodj@infyproject.com', 'password' => 'password123', 'role' => 'marketing'],
            
            // ===== ÉQUIPE SUPPORT (3 utilisateurs) =====
            // Support client et assistance utilisateur
            ['name' => 'Adama Kane', 'email' => 'adama.kane@infyproject.com', 'password' => 'password123', 'role' => 'support'],
            ['name' => 'Moussa Diop', 'email' => 'moussa.diop@infyproject.com', 'password' => 'password123', 'role' => 'support'],
            ['name' => 'Nafissatou Diallo', 'email' => 'nafissatou.diallo@infyproject.com', 'password' => 'password123', 'role' => 'support'],
            
            // ===== ÉQUIPE FINANCE (2 utilisateurs) =====
            // Responsables financiers et comptabilité
            ['name' => 'Mamadou Lamine Diop', 'email' => 'mamadou.lamine.diop@infyproject.com', 'password' => 'password123', 'role' => 'finance'],
            ['name' => 'Fatou Bintou Fall', 'email' => 'fatou.bintou.fall@infyproject.com', 'password' => 'password123', 'role' => 'finance'],
            
            // ===== ÉQUIPE RH (2 utilisateurs) =====
            // Ressources humaines et recrutement
            ['name' => 'Omar Sene', 'email' => 'omar.sene@infyproject.com', 'password' => 'password123', 'role' => 'hr'],
            ['name' => 'Mariama Ba', 'email' => 'mariama.ba@infyproject.com', 'password' => 'password123', 'role' => 'hr'],
            
            // ===== CONSULTANTS EXTERNES (3 utilisateurs) =====
            // Consultants externes pour des missions spécifiques
            ['name' => 'Mame Fatou Ndiaye', 'email' => 'mame.fatou.ndiaye@consultant.com', 'password' => 'password123', 'role' => 'consultant'],
            ['name' => 'Ibrahima Fall', 'email' => 'ibrahima.fall@consultant.com', 'password' => 'password123', 'role' => 'consultant'],
            ['name' => 'Aissatou Gueye', 'email' => 'aissatou.gueye@consultant.com', 'password' => 'password123', 'role' => 'consultant'],
        ];

        // Parcourir chaque utilisateur et le créer en base de données
        foreach ($users as $userData) {
            // Créer l'utilisateur avec les données fournies
            User::create([
                'name' => $userData['name'],                    // Nom complet de l'utilisateur
                'email' => $userData['email'],                  // Adresse email unique
                'password' => Hash::make($userData['password']), // Mot de passe hashé pour la sécurité
                'role' => $userData['role'],                    // Rôle dans l'organisation
                'email_verified_at' => now(),                   // Email vérifié automatiquement
            ]);
        }

        // Afficher un message de confirmation
        $this->command->info('30 utilisateurs sénégalais créés avec succès !');
    }
}
