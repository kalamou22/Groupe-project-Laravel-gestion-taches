<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Factory pour créer des utilisateurs de test
 * Ce factory génère des utilisateurs avec des noms sénégalais
 */
class UserFactory extends Factory
{
    /**
     * Définit l'état par défaut du modèle
     * 
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Liste des noms sénégalais courants pour générer des utilisateurs réalistes
        // Ces noms sont utilisés pour remplacer les noms générés automatiquement par Faker
        $senegaleseNames = [
            // Prénoms masculins sénégalais
            'Mamadou Diallo', 'Ousmane Ba', 'Ibrahima Ndiaye', 'Abdou Cisse', 'Moussa Camara',
            'Boubacar Seck', 'Malick Sy', 'Samba Niang', 'El Hadji Mbodj', 'Adama Kane',
            'Moussa Diop', 'Mamadou Lamine Diop', 'Omar Sene', 'Ibrahima Fall',
            
            // Prénoms féminins sénégalais
            'Fatou Sall', 'Aissatou Diop', 'Mariama Fall', 'Modou Gueye', 'Aminata Mbaye',
            'Cheikh Thiam', 'Khadija Sow', 'Mame Diarra Faye', 'Awa Diagne', 'Ndeye Fatou Wade',
            'Aicha Toure', 'Rokhaya Diouf', 'Nafissatou Diallo', 'Fatou Bintou Fall',
            'Mariama Ba', 'Mame Fatou Ndiaye', 'Aissatou Gueye',
        ];

        return [
            'name' => fake()->randomElement($senegaleseNames),  // Nom sénégalais aléatoire
            'email' => fake()->unique()->safeEmail(),           // Email unique généré automatiquement
            'email_verified_at' => now(),                       // Email vérifié automatiquement
            'password' => Hash::make('password123'),            // Mot de passe par défaut hashé
            'remember_token' => Str::random(10),                // Token de "se souvenir de moi"
            'role' => fake()->randomElement([                   // Rôle aléatoire parmi les rôles disponibles
                'developer',     // Développeur
                'designer',      // Designer
                'tester',        // Testeur
                'project_manager', // Chef de projet
                'devops',        // Administrateur système
                'marketing',     // Marketing
                'support',       // Support client
                'finance',       // Finance
                'hr',           // Ressources humaines
                'consultant'    // Consultant externe
            ]),
        ];
    }

    /**
     * Indique que l'email de l'utilisateur n'a pas été vérifié
     * 
     * @return $this
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,  // Email non vérifié
        ]);
    }

    /**
     * Crée un utilisateur avec le rôle administrateur
     * 
     * @return $this
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',  // Rôle administrateur
        ]);
    }

    /**
     * Crée un utilisateur avec le rôle développeur
     * 
     * @return $this
     */
    public function developer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'developer',  // Rôle développeur
        ]);
    }

    /**
     * Crée un utilisateur avec le rôle designer
     * 
     * @return $this
     */
    public function designer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'designer',  // Rôle designer
        ]);
    }

    /**
     * Crée un utilisateur avec le rôle chef de projet
     * 
     * @return $this
     */
    public function projectManager(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'project_manager',  // Rôle chef de projet
        ]);
    }
}
