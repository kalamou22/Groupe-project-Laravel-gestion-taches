<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Project - Représente un projet dans l'application
 * 
 * Ce modèle gère les projets avec leurs tâches associées et les relations avec les utilisateurs
 */
class Project extends Model
{
    use HasFactory;

    /**
     * Les attributs qui sont assignables en masse
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'name',           // Nom du projet
        'description',    // Description détaillée du projet
        'deadline',       // Date limite du projet
        'budget',         // Budget alloué au projet
        'status',         // Statut du projet (pending, in_progress, completed)
        'owner_id',       // ID du propriétaire du projet
    ];

    /**
     * Les attributs qui doivent être convertis en types natifs
     * 
     * @var array<string, string>
     */
    protected $casts = [
        'deadline' => 'date',     // La deadline est convertie en objet Date
        'budget' => 'decimal:2',  // Le budget est un nombre décimal avec 2 chiffres après la virgule
    ];

    /**
     * Relation avec le propriétaire du projet
     * Un projet appartient à un utilisateur
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Relation avec les tâches du projet
     * Un projet peut avoir plusieurs tâches
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Relation avec les commentaires du projet
     * Un projet peut avoir plusieurs commentaires
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Récupère les tâches terminées du projet
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function completedTasks()
    {
        return $this->hasMany(Task::class)->where('etat', 'terminée');
    }

    /**
     * Récupère les tâches en cours du projet
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function inProgressTasks()
    {
        return $this->hasMany(Task::class)->where('etat', 'en cours');
    }

    /**
     * Récupère les tâches en attente du projet
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pendingTasks()
    {
        return $this->hasMany(Task::class)->where('etat', 'en attente');
    }

    /**
     * Calcule le pourcentage de progression du projet
     * Basé sur le nombre de tâches terminées
     * 
     * @return float
     */
    public function getProgressPercentage(): float
    {
        $totalTasks = $this->tasks()->count();
        
        if ($totalTasks === 0) {
            return 0;
        }

        $completedTasks = $this->completedTasks()->count();
        return round(($completedTasks / $totalTasks) * 100, 2);
    }

    /**
     * Détermine le statut du projet basé sur les tâches
     * 
     * @return string
     */
    public function getCalculatedStatus(): string
    {
        $totalTasks = $this->tasks()->count();
        $completedTasks = $this->completedTasks()->count();
        $inProgressTasks = $this->inProgressTasks()->count();

        if ($totalTasks === 0) {
            return 'pending';
        }

        if ($completedTasks === $totalTasks) {
            return 'completed';
        }

        if ($inProgressTasks > 0) {
            return 'in_progress';
        }

        return 'pending';
    }

    /**
     * Vérifie si le projet est en retard
     * 
     * @return bool
     */
    public function isOverdue(): bool
    {
        if (!$this->deadline) {
            return false;
        }

        return $this->deadline->isPast() && $this->getCalculatedStatus() !== 'completed';
    }

    /**
     * Vérifie si le projet est terminé
     * 
     * @return bool
     */
    public function isCompleted(): bool
    {
        return $this->getCalculatedStatus() === 'completed';
    }

    /**
     * Vérifie si le projet est en cours
     * 
     * @return bool
     */
    public function isInProgress(): bool
    {
        return $this->getCalculatedStatus() === 'in_progress';
    }

    /**
     * Vérifie si le projet est en attente
     * 
     * @return bool
     */
    public function isPending(): bool
    {
        return $this->getCalculatedStatus() === 'pending';
    }

    /**
     * Récupère les statistiques du projet
     * 
     * @return array
     */
    public function getStats(): array
    {
        $totalTasks = $this->tasks()->count();
        $completedTasks = $this->completedTasks()->count();
        $inProgressTasks = $this->inProgressTasks()->count();
        $pendingTasks = $this->pendingTasks()->count();

        return [
            'total_tasks' => $totalTasks,
            'completed_tasks' => $completedTasks,
            'in_progress_tasks' => $inProgressTasks,
            'pending_tasks' => $pendingTasks,
            'progress_percentage' => $this->getProgressPercentage(),
            'is_overdue' => $this->isOverdue(),
            'days_until_deadline' => $this->deadline ? $this->deadline->diffInDays(now(), false) : null,
        ];
    }

    /**
     * Récupère le nom d'affichage du statut
     * 
     * @return string
     */
    public function getStatusDisplayName(): string
    {
        $statusNames = [
            'pending' => 'En attente',
            'in_progress' => 'En cours',
            'completed' => 'Terminé',
        ];

        return $statusNames[$this->status] ?? $this->status;
    }

    /**
     * Scope pour filtrer les projets par statut
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $status
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope pour filtrer les projets en retard
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOverdue($query)
    {
        return $query->where('deadline', '<', now())
                    ->where('status', '!=', 'completed');
    }

    /**
     * Scope pour filtrer les projets terminés
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope pour filtrer les projets en cours
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }
}
