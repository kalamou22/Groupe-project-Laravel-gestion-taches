<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Task - Représente une tâche dans l'application
 * 
 * Ce modèle gère les tâches avec leurs états, assignations et relations avec les projets et utilisateurs
 */
class Task extends Model
{
    use HasFactory;

    /**
     * Les attributs qui sont assignables en masse
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'titre',          // Titre de la tâche
        'description',    // Description détaillée de la tâche
        'etat',           // État de la tâche (terminée, en cours, en attente)
        'deadline',       // Date limite de la tâche
        'project_id',     // ID du projet auquel appartient la tâche
        'assigned_to',    // ID de l'utilisateur assigné à la tâche
    ];

    /**
     * Les attributs qui doivent être convertis en types natifs
     * 
     * @var array<string, string>
     */
    protected $casts = [
        'deadline' => 'datetime',  // La deadline est convertie en objet DateTime
    ];

    /**
     * Relation avec le projet auquel appartient la tâche
     * Une tâche appartient à un projet
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Relation avec l'utilisateur assigné à la tâche
     * Une tâche est assignée à un utilisateur
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Relation avec les commentaires de la tâche
     * Une tâche peut avoir plusieurs commentaires
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Vérifie si la tâche est terminée
     * 
     * @return bool
     */
    public function isCompleted(): bool
    {
        return $this->etat === 'terminée';
    }

    /**
     * Vérifie si la tâche est en cours
     * 
     * @return bool
     */
    public function isInProgress(): bool
    {
        return $this->etat === 'en cours';
    }

    /**
     * Vérifie si la tâche est en attente
     * 
     * @return bool
     */
    public function isPending(): bool
    {
        return $this->etat === 'en attente';
    }

    /**
     * Vérifie si la tâche est en retard
     * 
     * @return bool
     */
    public function isOverdue(): bool
    {
        if (!$this->deadline) {
            return false;
        }

        return $this->deadline->isPast() && !$this->isCompleted();
    }

    /**
     * Vérifie si la tâche est urgente (deadline dans les 3 prochains jours)
     * 
     * @return bool
     */
    public function isUrgent(): bool
    {
        if (!$this->deadline) {
            return false;
        }

        return $this->deadline->diffInDays(now(), false) <= 3 && !$this->isCompleted();
    }

    /**
     * Récupère le nom d'affichage de l'état
     * 
     * @return string
     */
    public function getEtatDisplayName(): string
    {
        $etatNames = [
            'terminée' => 'Terminée',
            'en cours' => 'En cours',
            'en attente' => 'En attente',
        ];

        return $etatNames[$this->etat] ?? $this->etat;
    }

    /**
     * Récupère la couleur CSS associée à l'état
     * 
     * @return string
     */
    public function getEtatColor(): string
    {
        $etatColors = [
            'terminée' => 'green',
            'en cours' => 'yellow',
            'en attente' => 'red',
        ];

        return $etatColors[$this->etat] ?? 'gray';
    }

    /**
     * Récupère les jours restants jusqu'à la deadline
     * 
     * @return int|null
     */
    public function getDaysUntilDeadline(): ?int
    {
        if (!$this->deadline) {
            return null;
        }

        return $this->deadline->diffInDays(now(), false);
    }

    /**
     * Récupère le statut de la deadline
     * 
     * @return string
     */
    public function getDeadlineStatus(): string
    {
        if (!$this->deadline) {
            return 'no_deadline';
        }

        $daysUntilDeadline = $this->getDaysUntilDeadline();

        if ($this->isCompleted()) {
            return 'completed';
        }

        if ($daysUntilDeadline < 0) {
            return 'overdue';
        }

        if ($daysUntilDeadline <= 3) {
            return 'urgent';
        }

        if ($daysUntilDeadline <= 7) {
            return 'soon';
        }

        return 'normal';
    }

    /**
     * Récupère les statistiques de la tâche
     * 
     * @return array
     */
    public function getStats(): array
    {
        return [
            'is_completed' => $this->isCompleted(),
            'is_in_progress' => $this->isInProgress(),
            'is_pending' => $this->isPending(),
            'is_overdue' => $this->isOverdue(),
            'is_urgent' => $this->isUrgent(),
            'days_until_deadline' => $this->getDaysUntilDeadline(),
            'deadline_status' => $this->getDeadlineStatus(),
            'comments_count' => $this->comments()->count(),
        ];
    }

    /**
     * Scope pour filtrer les tâches par état
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $etat
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByEtat($query, $etat)
    {
        return $query->where('etat', $etat);
    }

    /**
     * Scope pour filtrer les tâches terminées
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCompleted($query)
    {
        return $query->where('etat', 'terminée');
    }

    /**
     * Scope pour filtrer les tâches en cours
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInProgress($query)
    {
        return $query->where('etat', 'en cours');
    }

    /**
     * Scope pour filtrer les tâches en attente
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('etat', 'en attente');
    }

    /**
     * Scope pour filtrer les tâches en retard
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOverdue($query)
    {
        return $query->where('deadline', '<', now())
                    ->where('etat', '!=', 'terminée');
    }

    /**
     * Scope pour filtrer les tâches urgentes
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUrgent($query)
    {
        return $query->where('deadline', '<=', now()->addDays(3))
                    ->where('etat', '!=', 'terminée');
    }

    /**
     * Scope pour filtrer les tâches assignées à un utilisateur
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAssignedTo($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    /**
     * Scope pour filtrer les tâches d'un projet
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $projectId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByProject($query, $projectId)
    {
        return $query->where('project_id', $projectId);
    }
}
