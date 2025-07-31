<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Modèle User - Représente un utilisateur de l'application
 * 
 * Ce modèle gère l'authentification, les rôles et les relations avec les autres modèles
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Les attributs qui sont assignables en masse
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'name',           // Nom complet de l'utilisateur
        'email',          // Adresse email unique
        'password',       // Mot de passe hashé
        'role',           // Rôle dans l'organisation (developer, designer, admin, etc.)
    ];

    /**
     * Les attributs qui doivent être cachés lors de la sérialisation
     * 
     * @var array<int, string>
     */
    protected $hidden = [
        'password',        // Mot de passe (toujours caché)
        'remember_token',  // Token de "se souvenir de moi"
    ];

    /**
     * Les attributs qui doivent être convertis en types natifs
     * 
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',  // Date de vérification de l'email
        'password' => 'hashed',             // Le mot de passe est automatiquement hashé
    ];

    /**
     * Relation avec les projets dont l'utilisateur est propriétaire
     * Un utilisateur peut avoir plusieurs projets
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function projects()
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    /**
     * Relation avec les tâches assignées à l'utilisateur
     * Un utilisateur peut avoir plusieurs tâches assignées
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    /**
     * Relation avec les commentaires créés par l'utilisateur
     * Un utilisateur peut créer plusieurs commentaires
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany(Comment::class, 'user_id');
    }

    /**
     * Vérifie si l'utilisateur a le rôle administrateur
     * 
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Vérifie si l'utilisateur a le rôle développeur
     * 
     * @return bool
     */
    public function isDeveloper(): bool
    {
        return $this->role === 'developer';
    }

    /**
     * Vérifie si l'utilisateur a le rôle designer
     * 
     * @return bool
     */
    public function isDesigner(): bool
    {
        return $this->role === 'designer';
    }

    /**
     * Vérifie si l'utilisateur a le rôle chef de projet
     * 
     * @return bool
     */
    public function isProjectManager(): bool
    {
        return $this->role === 'project_manager';
    }

    /**
     * Vérifie si l'utilisateur a un rôle spécifique
     * 
     * @param string $role - Le rôle à vérifier
     * @return bool
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Vérifie si l'utilisateur a l'un des rôles spécifiés
     * 
     * @param array $roles - Liste des rôles à vérifier
     * @return bool
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Récupère le nom d'affichage du rôle
     * 
     * @return string
     */
    public function getRoleDisplayName(): string
    {
        $roleNames = [
            'admin' => 'Administrateur',
            'developer' => 'Développeur',
            'designer' => 'Designer',
            'tester' => 'Testeur',
            'project_manager' => 'Chef de Projet',
            'devops' => 'DevOps',
            'marketing' => 'Marketing',
            'support' => 'Support',
            'finance' => 'Finance',
            'hr' => 'Ressources Humaines',
            'consultant' => 'Consultant',
        ];

        return $roleNames[$this->role] ?? $this->role;
    }

    /**
     * Récupère les statistiques de l'utilisateur
     * 
     * @return array
     */
    public function getStats(): array
    {
        return [
            'total_projects' => $this->projects()->count(),
            'assigned_tasks' => $this->assignedTasks()->count(),
            'completed_tasks' => $this->assignedTasks()->where('etat', 'terminée')->count(),
            'pending_tasks' => $this->assignedTasks()->where('etat', 'en attente')->count(),
            'in_progress_tasks' => $this->assignedTasks()->where('etat', 'en cours')->count(),
        ];
    }
}
